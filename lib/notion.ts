import { extname } from "path"
import { Client } from "@notionhq/client"
import type { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import type { Artwork, BlogPost, BlogPostFull, NotionBlock } from "./types"

type PageObjectResponse = Extract<
  QueryDatabaseResponse["results"][number],
  { properties: Record<string, unknown> }
>

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const BLOG_DB_ID = process.env.NOTION_BLOG_DATABASE_ID!
const ARTWORK_DB_ID = process.env.NOTION_ARTWORK_DATABASE_ID!

// --- Helper to extract Notion property values ---

function getTitle(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop]
  if (p?.type === "title" && p.title.length > 0) {
    return p.title.map((t) => t.plain_text).join("")
  }
  return ""
}

function getRichText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop]
  if (p?.type === "rich_text" && p.rich_text.length > 0) {
    return p.rich_text.map((t) => t.plain_text).join("")
  }
  return ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Notion v2 types use broad unions; runtime values are narrower
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

function getDate(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop] as any
  if (p?.type === "date" && p.date) {
    return p.date.start
  }
  return ""
}

function getCheckbox(page: PageObjectResponse, prop: string): boolean {
  const p = page.properties[prop] as any
  if (p?.type === "checkbox") {
    return p.checkbox
  }
  return false
}

function getFileUrl(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop] as any
  if (p?.type === "files" && Array.isArray(p.files) && p.files.length > 0) {
    const file = p.files[0]
    if (file.type === "file") {
      return file.file.url
    }
    if (file.type === "external") {
      return file.external.url
    }
  }
  return null
}

// --- Blog Functions ---

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: BLOG_DB_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => {
      const dateRaw = getDate(page, "Date")
      const date = dateRaw
        ? new Date(dateRaw).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : ""

      return {
        slug: getRichText(page, "Slug"),
        title: getTitle(page, "Title"),
        date,
        excerpt: getRichText(page, "Excerpt"),
      }
    })
}

// Rewrites hosted Notion image block URLs to local static paths.
// Must use the same extension derivation logic as scripts/download-blog-images.ts.
export function resolveImageBlocks(blocks: NotionBlock[], slug: string): NotionBlock[] {
  return blocks.map((block) => {
    if (block.type !== "image" || !block.image) return block
    if (block.image.type === "external") return block

    const fileUrl = block.image.file?.url
    if (!fileUrl) return block

    let ext: string
    try {
      ext = extname(new URL(fileUrl).pathname) || ".jpg"
    } catch {
      ext = ".jpg"
    }

    return {
      ...block,
      image: { ...block.image, localUrl: `/images/blog/${slug}/${block.id}${ext}` },
    }
  })
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostFull | null> {
  const response = await notion.databases.query({
    database_id: BLOG_DB_ID,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
  })

  const page = response.results[0]
  if (!page || !("properties" in page)) return null

  const blocks = resolveImageBlocks(await getPageBlocks(page.id), slug)

  const dateRaw = getDate(page as PageObjectResponse, "Date")
  const date = dateRaw
    ? new Date(dateRaw).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return {
    slug,
    title: getTitle(page as PageObjectResponse, "Title"),
    date,
    category: getSelect(page as PageObjectResponse, "Category"),
    blocks,
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: BLOG_DB_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
  })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => getRichText(page, "Slug"))
    .filter(Boolean)
}

// --- Artwork Functions ---

export async function getArtworksByCategory(
  category: "paintings" | "drawings"
): Promise<Artwork[]> {
  const response = await notion.databases.query({
    database_id: ARTWORK_DB_ID,
    filter: {
      and: [
        { property: "Category", select: { equals: category } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
    sorts: [{ property: "Sort Order", direction: "ascending" }],
  })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => {
      const title = getTitle(page, "Title")
      const sortOrder = getNumber(page, "Sort Order")
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")

      return {
        id: page.id,
        title,
        year: getNumber(page, "Year"),
        material: getRichText(page, "Material"),
        src: `/images/${category}/${category.slice(0, -1)}-${sortOrder}.jpg`,
        width: getNumber(page, "Aspect Width"),
        height: getNumber(page, "Aspect Height"),
        category,
      }
    })
}

export async function getAllArtworks(): Promise<Artwork[]> {
  const [paintings, drawings] = await Promise.all([
    getArtworksByCategory("paintings"),
    getArtworksByCategory("drawings"),
  ])
  return [...paintings, ...drawings]
}

// --- Artwork Image URLs (for build-time download) ---

export interface ArtworkImageEntry {
  category: "paintings" | "drawings"
  sortOrder: number
  title: string
  imageUrl: string | null
}

export async function getArtworkImageUrls(): Promise<ArtworkImageEntry[]> {
  const response = await notion.databases.query({
    database_id: ARTWORK_DB_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [
      { property: "Category", direction: "ascending" },
      { property: "Sort Order", direction: "ascending" },
    ],
  })

  return response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((page) => ({
      category: getSelect(page, "Category") as "paintings" | "drawings",
      sortOrder: getNumber(page, "Sort Order"),
      title: getTitle(page, "Title"),
      imageUrl: getFileUrl(page, "Image"),
    }))
}

// --- Block Fetching ---

async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results) {
      if ("type" in block) {
        blocks.push(block as unknown as NotionBlock)
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return blocks
}
