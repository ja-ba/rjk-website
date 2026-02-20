import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { renderNotionBlocks } from "../lib/notion-renderer"
import type { NotionBlock, NotionRichText } from "../lib/types"

function makeRichText(plain_text: string, overrides: Partial<NotionRichText> = {}): NotionRichText {
  return {
    plain_text,
    href: null,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      code: false,
      ...overrides.annotations,
    },
    ...overrides,
  }
}

function makeBlock(type: NotionBlock["type"], extra: Partial<NotionBlock> = {}): NotionBlock {
  return { id: "block-1", type, ...extra } as NotionBlock
}

function renderBlocks(blocks: NotionBlock[]) {
  const nodes = renderNotionBlocks(blocks)
  const { container } = render(<>{nodes}</>)
  return container
}

describe("renderNotionBlocks", () => {
  describe("paragraph", () => {
    it("renders a paragraph with text", () => {
      const block = makeBlock("paragraph", {
        paragraph: { rich_text: [makeRichText("Hello world")] },
      })
      const container = renderBlocks([block])
      const p = container.querySelector("p")
      expect(p).toBeInTheDocument()
      expect(p).toHaveTextContent("Hello world")
    })

    it("renders an empty paragraph as a spacer div", () => {
      const block = makeBlock("paragraph", {
        paragraph: { rich_text: [] },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("p")).not.toBeInTheDocument()
      const spacer = container.querySelector("div.h-4")
      expect(spacer).toBeInTheDocument()
    })
  })

  describe("headings", () => {
    it("renders heading_1 as h2", () => {
      const block = makeBlock("heading_1", {
        heading_1: { rich_text: [makeRichText("Title One")] },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("h2")).toHaveTextContent("Title One")
    })

    it("renders heading_2 as h3", () => {
      const block = makeBlock("heading_2", {
        heading_2: { rich_text: [makeRichText("Title Two")] },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("h3")).toHaveTextContent("Title Two")
    })

    it("renders heading_3 as h4", () => {
      const block = makeBlock("heading_3", {
        heading_3: { rich_text: [makeRichText("Title Three")] },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("h4")).toHaveTextContent("Title Three")
    })
  })

  describe("list items", () => {
    it("renders bulleted_list_item as li with list-disc", () => {
      const block = makeBlock("bulleted_list_item", {
        bulleted_list_item: { rich_text: [makeRichText("Bullet point")] },
      })
      const container = renderBlocks([block])
      const li = container.querySelector("li")
      expect(li).toHaveTextContent("Bullet point")
      expect(li).toHaveClass("list-disc")
    })

    it("renders numbered_list_item as li with list-decimal", () => {
      const block = makeBlock("numbered_list_item", {
        numbered_list_item: { rich_text: [makeRichText("Numbered point")] },
      })
      const container = renderBlocks([block])
      const li = container.querySelector("li")
      expect(li).toHaveTextContent("Numbered point")
      expect(li).toHaveClass("list-decimal")
    })
  })

  describe("image", () => {
    it("renders a file-hosted image using localUrl", () => {
      const block = makeBlock("image", {
        image: {
          type: "file",
          localUrl: "/images/blog/my-post/block-abc.jpg",
          file: { url: "https://notion.so/image.jpg" },
          caption: [],
        },
      })
      const container = renderBlocks([block])
      const img = container.querySelector("img")
      expect(img).toHaveAttribute("src", "/images/blog/my-post/block-abc.jpg")
    })

    it("renders an external image using the external URL", () => {
      const block = makeBlock("image", {
        image: {
          type: "external",
          external: { url: "https://example.com/photo.png" },
          caption: [],
        },
      })
      const container = renderBlocks([block])
      const img = container.querySelector("img")
      expect(img).toHaveAttribute("src", "https://example.com/photo.png")
    })

    it("renders a figcaption when caption is present", () => {
      const block = makeBlock("image", {
        image: {
          type: "external",
          external: { url: "https://example.com/photo.png" },
          caption: [makeRichText("A lovely photo")],
        },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("figcaption")).toHaveTextContent("A lovely photo")
    })

    it("does not render a figcaption when caption is empty", () => {
      const block = makeBlock("image", {
        image: {
          type: "external",
          external: { url: "https://example.com/photo.png" },
          caption: [],
        },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("figcaption")).not.toBeInTheDocument()
    })

    it("returns null if image has no usable src", () => {
      const block = makeBlock("image", {
        image: { type: "file", file: { url: "https://notion.so/image.jpg" }, caption: [] },
      })
      const container = renderBlocks([block])
      expect(container.querySelector("img")).not.toBeInTheDocument()
    })
  })

  describe("unknown block type", () => {
    it("returns null for unrecognized types", () => {
      const block = { id: "block-x", type: "unsupported_type" } as unknown as NotionBlock
      const nodes = renderNotionBlocks([block])
      expect(nodes[0]).toBeNull()
    })
  })
})

describe("renderRichText (via paragraph)", () => {
  function renderParagraph(richTexts: NotionRichText[]) {
    const block = makeBlock("paragraph", { paragraph: { rich_text: richTexts } })
    return renderBlocks([block])
  }

  it("renders bold text as strong", () => {
    const container = renderParagraph([
      makeRichText("bold", { annotations: { bold: true, italic: false, strikethrough: false, code: false } }),
    ])
    expect(container.querySelector("strong")).toHaveTextContent("bold")
  })

  it("renders italic text as em", () => {
    const container = renderParagraph([
      makeRichText("italic", { annotations: { bold: false, italic: true, strikethrough: false, code: false } }),
    ])
    expect(container.querySelector("em")).toHaveTextContent("italic")
  })

  it("renders strikethrough text as s", () => {
    const container = renderParagraph([
      makeRichText("struck", { annotations: { bold: false, italic: false, strikethrough: true, code: false } }),
    ])
    expect(container.querySelector("s")).toHaveTextContent("struck")
  })

  it("renders code text as code", () => {
    const container = renderParagraph([
      makeRichText("myFunc()", { annotations: { bold: false, italic: false, strikethrough: false, code: true } }),
    ])
    expect(container.querySelector("code")).toHaveTextContent("myFunc()")
  })

  it("renders link text as anchor with correct href", () => {
    const container = renderParagraph([
      makeRichText("click here", { href: "https://example.com" }),
    ])
    const a = container.querySelector("a")
    expect(a).toHaveTextContent("click here")
    expect(a).toHaveAttribute("href", "https://example.com")
    expect(a).toHaveAttribute("target", "_blank")
  })
})
