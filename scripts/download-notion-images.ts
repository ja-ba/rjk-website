import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import sharp from "sharp"
import {
  queryAllPages,
  getTitle,
  getRichText,
  getSelect,
  getFileUrl,
} from "../lib/notion"

const PUBLIC_DIR = join(process.cwd(), "public", "images")

// Detects HEIC/HEIF by the ISO Base Media 'ftyp' box at offset 4 and the brand at offset 8.
export function isHeic(buf: Buffer): boolean {
  if (buf.length < 12) return false
  const ftyp = buf.toString("ascii", 4, 8)
  const brand = buf.toString("ascii", 8, 12)
  return ftyp === "ftyp" && ["heic", "heix", "mif1", "msf1"].includes(brand)
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
      let buffer = Buffer.from(await response.arrayBuffer())
      if (isHeic(buffer)) {
        console.log(`  Converting HEIC → JPEG: ${filepath}`)
        buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer()
      }
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
  for (const dir of ["paintings", "drawings", "plein_air"]) {
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}
