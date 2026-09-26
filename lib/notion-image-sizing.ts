import type { BlogImageSize, NotionBlock } from "./types"

export interface NotionComment {
  created_time: string
  rich_text: Array<{ plain_text: string }>
}

export interface NotionCommentsPage {
  results: NotionComment[]
  has_more: boolean
  next_cursor: string | null
}

export interface ListCommentsParams {
  block_id: string
  start_cursor?: string
  page_size: number
}

export type ListCommentsPage = (
  params: ListCommentsParams
) => Promise<NotionCommentsPage>

export type BlogImageCommentsLoader = (
  blockId: string
) => Promise<NotionComment[]>

const VALID_IMAGE_SIZES = new Set<BlogImageSize>(["x-small", "small", "medium", "large"])

export const BLOG_IMAGE_MAX_WIDTHS: Record<BlogImageSize, number> = {
  "x-small": 160,
  small: 290,
  medium: 430,
  large: 530,
}

/** Returns the newest valid display-size comment, if one exists. */
export function parseBlogImageSize(
  comments: readonly NotionComment[]
): BlogImageSize | undefined {
  const validComments = comments.filter((comment) => {
    const value = comment.rich_text.map((text) => text.plain_text).join("").trim().toLowerCase()
    return VALID_IMAGE_SIZES.has(value as BlogImageSize)
  })

  const newest = validComments.reduce<NotionComment | undefined>((latest, current) => {
    if (!latest) return current
    return new Date(current.created_time).getTime() > new Date(latest.created_time).getTime()
      ? current
      : latest
  }, undefined)

  if (!newest) return undefined

  const value = newest.rich_text.map((text) => text.plain_text).join("").trim().toLowerCase()
  return VALID_IMAGE_SIZES.has(value as BlogImageSize) ? (value as BlogImageSize) : undefined
}

export async function listAllBlockComments(
  blockId: string,
  listPage: ListCommentsPage
): Promise<NotionComment[]> {
  const comments: NotionComment[] = []
  let cursor: string | undefined

  do {
    const response = await listPage({
      block_id: blockId,
      ...(cursor ? { start_cursor: cursor } : {}),
      page_size: 100,
    })
    comments.push(...response.results)
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  return comments
}

export async function resolveBlogImageSizes(
  blocks: NotionBlock[],
  loadComments: BlogImageCommentsLoader
): Promise<NotionBlock[]> {
  const resolved: NotionBlock[] = []

  for (const block of blocks) {
    const blockWithChildren = block.children
      ? {
          ...block,
          children: await resolveBlogImageSizes(block.children, loadComments),
        }
      : block

    if (block.type !== "image" || !block.image) {
      resolved.push(blockWithChildren)
      continue
    }

    try {
      const displaySize = parseBlogImageSize(await loadComments(block.id))
      const image = { ...block.image }
      delete image.displaySize
      resolved.push({
        ...blockWithChildren,
        image: {
          ...image,
          ...(displaySize ? { displaySize } : {}),
        },
      })
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to read comments for image block ${block.id}: ${reason}`, {
        cause: error,
      })
    }
  }

  return resolved
}
