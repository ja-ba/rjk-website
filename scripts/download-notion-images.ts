import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { isHeic, toJpeg } from "./image-utils"
import {
  queryAllPages,
  getTitle,
  getRichText,
  getSelect,
  getFileUrl,
  getNumber,
} from "../lib/notion"
import { ARTWORK_CATEGORIES, isArtworkCategory } from "../lib/types"

const PUBLIC_DIR = join(process.cwd(), "public", "images")

async function downloadImage(
  url: string,
  filepath: string,
  retries = 3
): Promise<void> {
  let buffer: Buffer | undefined
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      buffer = Buffer.from(await response.arrayBuffer())
      break
    } catch (error) {
      if (attempt === retries) throw error
      console.log(`  Retry ${attempt}/${retries}...`)
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
  if (isHeic(buffer!)) {
    console.log(`  Converting HEIC → JPEG: ${filepath}`)
    buffer = await toJpeg(buffer!)
  }
  await writeFile(filepath, buffer!)
}

export interface DimensionEntry {
  title: string
  filename: string
  category: string
  width: number
  height: number
}

export function findMissingDimensions(entries: DimensionEntry[]): DimensionEntry[] {
  return entries.filter((e) => e.width === 0 || e.height === 0)
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
  for (const dir of ARTWORK_CATEGORIES) {
    const dirPath = join(PUBLIC_DIR, dir)
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true })
      console.log(`Created directory: ${dirPath}`)
    }
  }

  let downloaded = 0
  let skipped = 0
  let failed = 0
  const dimensionEntries: DimensionEntry[] = []

  for (const page of pages) {
    const title = getTitle(page, "Title")
    const category = getSelect(page, "Category")
    const filenameBase = getRichText(page, "filename")
    const imageUrl = getFileUrl(page, "Image")

    if (!isArtworkCategory(category)) {
      console.log(`  SKIP: "${title}" — unsupported category "${category}"`)
      skipped++
      continue
    }

    // Track dimensions for all valid-category entries (they appear in the gallery)
    dimensionEntries.push({
      title,
      filename: filenameBase,
      category,
      width: getNumber(page, "Aspect Width"),
      height: getNumber(page, "Aspect Height"),
    })

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

  // Validate dimensions after processing all pages
  const missingDimensions = findMissingDimensions(dimensionEntries)
  if (missingDimensions.length > 0) {
    console.log(
      `\n⚠️  MISSING DIMENSIONS (${missingDimensions.length} artwork(s) will not render in gallery):`
    )
    for (const entry of missingDimensions) {
      console.log(
        `  - "${entry.title}" (${entry.category}/${entry.filename || "?"}.jpg) — set Aspect Width & Aspect Height in Notion`
      )
    }

    if (process.env.BUILD_ENV === "production") {
      console.log(
        "\n❌ Build failed: fix the above Notion entries before deploying to production."
      )
      failed += missingDimensions.length
    } else {
      console.log(
        "\n(Preview/staging build continues — affected artworks will be hidden with a warning banner on the site.)"
      )
    }
  }

  console.log(
    `\nDone. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`
  )

  if (failed > 0) {
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}
