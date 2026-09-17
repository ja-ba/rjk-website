import { describe, expect, it, vi } from "vitest"
import type { NotionBlock } from "../lib/types"
import {
  listAllBlockComments,
  parseBlogImageSize,
  resolveBlogImageSizes,
  type NotionComment,
  type NotionCommentsPage,
} from "../lib/notion-image-sizing"

function comment(plainText: string, created_time: string): NotionComment {
  return {
    created_time,
    rich_text: [{ plain_text: plainText }],
  }
}

function imageBlock(id: string, type: "file" | "external" = "file"): NotionBlock {
  return {
    id,
    type: "image",
    image:
      type === "file"
        ? { type, file: { url: "https://notion.so/image.jpg" }, caption: [] }
        : { type, external: { url: "https://example.com/image.jpg" }, caption: [] },
  }
}

function paragraphBlock(id: string): NotionBlock {
  return {
    id,
    type: "paragraph",
    paragraph: { rich_text: [] },
  }
}

describe("parseBlogImageSize", () => {
  it.each([
    ["Small", "small"],
    [" medium ", "medium"],
    ["LARGE", "large"],
  ] as const)("recognizes %j as %j", (text, expected) => {
    expect(parseBlogImageSize([comment(text, "2026-01-01T00:00:00.000Z")])).toBe(expected)
  })

  it("ignores non-size comments, including Full", () => {
    expect(
      parseBlogImageSize([
        comment("Please crop this image", "2026-01-01T00:00:00.000Z"),
        comment("Full", "2026-01-02T00:00:00.000Z"),
      ])
    ).toBeUndefined()
  })

  it("uses the newest valid size comment", () => {
    expect(
      parseBlogImageSize([
        comment("Large", "2026-01-03T00:00:00.000Z"),
        comment("Editorial note", "2026-01-04T00:00:00.000Z"),
        comment("Small", "2026-01-05T00:00:00.000Z"),
      ])
    ).toBe("small")
  })

  it("returns no size when there are no valid comments", () => {
    expect(parseBlogImageSize([])).toBeUndefined()
  })
})

describe("listAllBlockComments", () => {
  it("fetches every comments page using the returned cursor", async () => {
    const calls: Array<{ block_id: string; start_cursor?: string; page_size: number }> = []
    const pages: NotionCommentsPage[] = [
      {
        results: [comment("Large", "2026-01-01T00:00:00.000Z")],
        has_more: true,
        next_cursor: "cursor-2",
      },
      {
        results: [comment("Small", "2026-01-02T00:00:00.000Z")],
        has_more: false,
        next_cursor: null,
      },
    ]

    const results = await listAllBlockComments("image-1", async (params) => {
      calls.push(params)
      return pages[calls.length - 1]
    })

    expect(results).toHaveLength(2)
    expect(calls).toEqual([
      { block_id: "image-1", page_size: 100 },
      { block_id: "image-1", start_cursor: "cursor-2", page_size: 100 },
    ])
  })
})

describe("resolveBlogImageSizes", () => {
  it("requests comments only for image blocks and preserves other blocks", async () => {
    const blocks = [imageBlock("image-1"), paragraphBlock("paragraph-1"), imageBlock("image-2", "external")]
    const requested: string[] = []
    const result = await resolveBlogImageSizes(blocks, async (blockId) => {
      requested.push(blockId)
      return blockId === "image-1"
        ? [comment("Medium", "2026-01-01T00:00:00.000Z")]
        : []
    })

    expect(requested).toEqual(["image-1", "image-2"])
    expect(result[0].image?.displaySize).toBe("medium")
    expect(result[1]).toEqual(blocks[1])
    expect(result[2].image?.displaySize).toBeUndefined()
  })

  it("surfaces comment API failures with the affected block ID", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("permission denied"))

    await expect(resolveBlogImageSizes([imageBlock("image-failed")], loader)).rejects.toThrow(
      "Failed to read comments for image block image-failed: permission denied"
    )
  })

  it("clears a previous display size when no valid comment remains", async () => {
    const block = imageBlock("image-reset")
    block.image!.displaySize = "small"

    const [result] = await resolveBlogImageSizes([block], async () => [])

    expect(result.image?.displaySize).toBeUndefined()
  })
})
