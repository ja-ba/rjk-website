export interface Artwork {
  id: string
  title: string
  year: number
  material: string
  src: string
  width: number
  height: number
  category: "paintings" | "drawings"
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
}

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
