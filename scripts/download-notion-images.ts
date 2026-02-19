import { Client } from "@notionhq/client"
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"

type PageObjectResponse = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const ARTWORK_DB_ID = process.env.NOTION_ARTWORK_DATABASE_ID!

const PUBLIC_DIR = join(process.cwd(), "public", "images")

function getTitle(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop]
  if (p?.type === "title" && p.title.length > 0) {
    return p.title.map((t) => t.plain_text).join("")
  }
  return ""
}

function getNumber(page: PageObjectResponse, prop: string): number {
  const p = page.properties[prop] as any
  if (p?.type === "number" && p.number !== null) {
    return p.number
  }
  return 0
}

function getSelect(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop] as any
  if (p?.type === "select" && p.select) {
    return p.select.name
  }
  return ""
}

function getFileUrl(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop] as any
  if (p?.type === "files" && Array.isArray(p.files) && p.files.length > 0) {
    const file = p.files[0]
    if (file.type === "file") return file.file.url
    if (file.type === "external") return file.external.url
  }
  return null
}

async function downloadImage(
  url: string,
  filepath: string,
  retries = 3
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(filepath, buffer)
      return
    } catch (error) {
      if (attempt === retries) throw error
      console.log(`  Retry ${attempt}/${retries}...`)
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
}

async function main() {
  console.log("Fetching artwork entries from Notion...")

  const response = await notion.databases.query({
    database_id: ARTWORK_DB_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [
      { property: "Sort Order", direction: "ascending" },
    ],
  })

  const pages = response.results.filter(
    (page): page is PageObjectResponse => "properties" in page
  )

  console.log(`Found ${pages.length} published artworks.`)

  // Ensure directories exist
  for (const dir of ["paintings", "drawings"]) {
    const dirPath = join(PUBLIC_DIR, dir)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
      console.log(`Created directory: ${dirPath}`)
    }
  }

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const page of pages) {
    const title = getTitle(page, "Title")
    const category = getSelect(page, "Category")
    const sortOrder = getNumber(page, "Sort Order")
    const imageUrl = getFileUrl(page, "Image")

    const singular = category === "paintings" ? "painting" : "drawing"
    const filename = `${singular}-${sortOrder}.jpg`
    const filepath = join(PUBLIC_DIR, category, filename)

    if (!imageUrl) {
      console.log(`  SKIP: "${title}" — no image uploaded in Notion`)
      skipped++
      continue
    }

    // Always download (Notion URLs expire, so we can't check freshness)
    try {
      console.log(`  Downloading: "${title}" → ${category}/${filename}`)
      await downloadImage(imageUrl, filepath)
      downloaded++
    } catch (error) {
      console.error(
        `  FAILED: "${title}" — ${error instanceof Error ? error.message : error}`
      )
      failed++
    }
  }

  console.log(
    `\nDone. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`
  )

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
