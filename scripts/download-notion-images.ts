import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import {
  queryAllPages,
  getTitle,
  getRichText,
  getSelect,
  getFileUrl,
} from "../lib/notion"

const PUBLIC_DIR = join(process.cwd(), "public", "images")

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

  const pages = await queryAllPages({
    database_id: process.env.NOTION_ARTWORK_DATABASE_ID!,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Sort Order", direction: "ascending" }],
  })

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
    const filenameBase = getRichText(page, "filename")
    const imageUrl = getFileUrl(page, "Image")

    if (!filenameBase) {
      console.log(`  SKIP: "${title}" — no filename set in Notion`)
      skipped++
      continue
    }

    const filename = `${filenameBase}.jpg`
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
