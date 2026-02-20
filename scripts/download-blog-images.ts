import { Client } from "@notionhq/client"
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join, extname } from "path"

type PageObjectResponse = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const BLOG_DB_ID = process.env.NOTION_BLOG_DATABASE_ID!
const PUBLIC_DIR = join(process.cwd(), "public", "images", "blog")

function getRichText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop] as any
  if (p?.type === "rich_text" && p.rich_text.length > 0) {
    return p.rich_text.map((t: any) => t.plain_text).join("")
  }
  return ""
}

// Must use the same extension derivation logic as resolveImageBlocks() in lib/notion.ts.
function getExtFromUrl(url: string): string {
  try {
    return extname(new URL(url).pathname) || ".jpg"
  } catch {
    return ".jpg"
  }
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

async function getPageBlocks(pageId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)
  return blocks
}

async function queryAllPages(
  params: Parameters<typeof notion.databases.query>[0]
): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const response = await notion.databases.query({ ...params, start_cursor: cursor, page_size: 100 })
    for (const page of response.results) {
      if ("properties" in page) pages.push(page as PageObjectResponse)
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)
  return pages
}

async function main() {
  console.log("Fetching published blog posts from Notion...")

  const pages = await queryAllPages({
    database_id: BLOG_DB_ID,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  })

  console.log(`Found ${pages.length} published blog posts.`)

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const page of pages) {
    const slug = getRichText(page, "Slug")
    if (!slug) {
      console.log(`  SKIP: page ${page.id} — no slug`)
      skipped++
      continue
    }

    const blocks = await getPageBlocks(page.id)
    const imageBlocks = blocks.filter(
      (b) => "type" in b && b.type === "image"
    )

    if (imageBlocks.length === 0) continue

    const slugDir = join(PUBLIC_DIR, slug)
    if (!existsSync(slugDir)) {
      await mkdir(slugDir, { recursive: true })
      console.log(`  Created directory: public/images/blog/${slug}/`)
    }

    for (const block of imageBlocks) {
      const img = (block as any).image
      if (!img) continue

      if (img.type === "external") {
        console.log(`  SKIP (external): block ${block.id} in "${slug}"`)
        skipped++
        continue
      }

      const fileUrl = img.file?.url
      if (!fileUrl) {
        console.log(`  SKIP: block ${block.id} in "${slug}" — no file URL`)
        skipped++
        continue
      }

      const ext = getExtFromUrl(fileUrl)
      const filename = `${block.id}${ext}`
      const filepath = join(slugDir, filename)

      try {
        console.log(`  Downloading: ${slug}/${filename}`)
        await downloadImage(fileUrl, filepath)
        downloaded++
      } catch (error) {
        console.error(
          `  FAILED: block ${block.id} in "${slug}" — ${error instanceof Error ? error.message : error}`
        )
        failed++
      }
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
