export const ARTWORK_CATEGORIES = ["paintings", "drawings", "plein_air"] as const
export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number]

export function isArtworkCategory(value: string): value is ArtworkCategory {
  return (ARTWORK_CATEGORIES as readonly string[]).includes(value)
}

export interface Artwork {
  id: string
  title: string
  year: number
  material: string
  dimension: string
  src: string
  width: number
  height: number
  category: ArtworkCategory
}

/** An artwork has usable dimensions when both width and height are set (> 0).
 *  Notion stores missing Aspect Width/Height as 0, so a 0 means "missing". */
export function hasDimensions(a: { width: number; height: number }): boolean {
  return a.width > 0 && a.height > 0
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
}

export interface BlogPostFull {
  slug: string
  title: string
  date: string
  category: string
  blocks: NotionBlock[]
}

export interface NotionBlock {
  id: string
  type: string
  paragraph?: {
    rich_text: NotionRichText[]
  }
  heading_1?: {
    rich_text: NotionRichText[]
  }
  heading_2?: {
    rich_text: NotionRichText[]
  }
  heading_3?: {
    rich_text: NotionRichText[]
  }
  bulleted_list_item?: {
    rich_text: NotionRichText[]
  }
  numbered_list_item?: {
    rich_text: NotionRichText[]
  }
  image?: {
    type: "file" | "external"
    file?: { url: string }
    external?: { url: string }
    caption: NotionRichText[]
    localUrl?: string // injected at build time by resolveImageBlocks(), not from Notion
  }
}

export type RebuildApiResponse =
  | { triggered: true }
  | { error: string; detail?: string }

export interface NotionRichText {
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
  }
}
