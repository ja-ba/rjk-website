import { describe, it, expect } from "vitest"
import { resolveImageBlocks } from "../lib/notion"
import type { NotionBlock } from "../lib/types"

function makeFileImageBlock(id: string, fileUrl: string): NotionBlock {
  return {
    id,
    type: "image",
    image: {
      type: "file",
      file: { url: fileUrl },
      caption: [],
    },
  } as NotionBlock
}

function makeExternalImageBlock(id: string, url: string): NotionBlock {
  return {
    id,
    type: "image",
    image: {
      type: "external",
      external: { url },
      caption: [],
    },
  } as NotionBlock
}

function makeParagraphBlock(id: string): NotionBlock {
  return {
    id,
    type: "paragraph",
    paragraph: { rich_text: [] },
  } as NotionBlock
}

describe("resolveImageBlocks", () => {
  it("rewrites file-type image block URL to local path", () => {
    const block = makeFileImageBlock(
      "abc123",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/some/path/photo.jpg?AWSAccessKeyId=x"
    )
    const [result] = resolveImageBlocks([block], "my-post")
    expect(result.image?.localUrl).toBe("/images/blog/my-post/abc123.jpg")
  })

  it("preserves the correct extension from the URL pathname", () => {
    const cases = [
      ["photo.png", ".png"],
      ["image.gif", ".gif"],
      ["banner.webp", ".webp"],
      ["picture.jpeg", ".jpeg"],
    ] as const

    for (const [filename, expectedExt] of cases) {
      const block = makeFileImageBlock(
        "block-1",
        `https://s3.example.com/files/${filename}?token=abc`
      )
      const [result] = resolveImageBlocks([block], "slug")
      expect(result.image?.localUrl).toBe(`/images/blog/slug/block-1${expectedExt}`)
    }
  })

  it("defaults to .jpg when URL has no extension", () => {
    const block = makeFileImageBlock("block-2", "https://s3.example.com/files/noextension")
    const [result] = resolveImageBlocks([block], "slug")
    expect(result.image?.localUrl).toBe("/images/blog/slug/block-2.jpg")
  })

  it("leaves external-type image blocks unchanged", () => {
    const block = makeExternalImageBlock("ext-1", "https://example.com/photo.jpg")
    const [result] = resolveImageBlocks([block], "my-post")
    expect(result.image?.localUrl).toBeUndefined()
    expect(result.image?.external?.url).toBe("https://example.com/photo.jpg")
  })

  it("leaves non-image blocks unchanged", () => {
    const block = makeParagraphBlock("para-1")
    const [result] = resolveImageBlocks([block], "my-post")
    expect(result).toEqual(block)
  })

  it("processes multiple blocks, only transforming file images", () => {
    const blocks = [
      makeParagraphBlock("para-1"),
      makeFileImageBlock("img-1", "https://s3.example.com/files/a.jpg"),
      makeExternalImageBlock("img-2", "https://example.com/b.png"),
      makeFileImageBlock("img-3", "https://s3.example.com/files/c.png"),
    ]
    const results = resolveImageBlocks(blocks, "test-post")

    expect(results[0]).toEqual(blocks[0])
    expect(results[1].image?.localUrl).toBe("/images/blog/test-post/img-1.jpg")
    expect(results[2].image?.localUrl).toBeUndefined()
    expect(results[3].image?.localUrl).toBe("/images/blog/test-post/img-3.png")
  })

  it("uses the slug in the local path", () => {
    const block = makeFileImageBlock("blk", "https://s3.example.com/img.jpg")
    const [result] = resolveImageBlocks([block], "another-slug")
    expect(result.image?.localUrl).toBe("/images/blog/another-slug/blk.jpg")
  })
})
