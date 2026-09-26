import { beforeEach, describe, expect, it, vi } from "vitest"

const { databasesQuery, childrenList, commentsList } = vi.hoisted(() => ({
  databasesQuery: vi.fn(),
  childrenList: vi.fn(),
  commentsList: vi.fn(),
}))

vi.mock("@notionhq/client", () => ({
  Client: vi.fn(function Client() {
    return {
      databases: { query: databasesQuery },
      blocks: { children: { list: childrenList } },
      comments: { list: commentsList },
    }
  }),
}))

import { getBlogPostBySlug } from "../lib/notion"

const text = (plain_text: string) => ({
  plain_text,
  href: null,
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
  },
})

const paragraph = (id: string, content: string, has_children = false) => ({
  object: "block",
  id,
  type: "paragraph",
  has_children,
  paragraph: { rich_text: [text(content)] },
})

describe("getBlogPostBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches nested block children recursively", async () => {
    databasesQuery.mockResolvedValue({
      results: [
        {
          id: "page-1",
          properties: {
            Slug: { type: "rich_text", rich_text: [text("nested-post")] },
            Title: { type: "title", title: [text("Nested Post")] },
            Category: { type: "select", select: { name: "Studio" } },
            Date: { type: "date", date: { start: "2025-01-15" } },
          },
        },
      ],
      has_more: false,
      next_cursor: null,
    })

    childrenList.mockImplementation(async ({ block_id }: { block_id: string }) => {
      const children = {
        "page-1": [paragraph("parent", "Parent", true)],
        parent: [paragraph("child", "Child", true)],
        child: [paragraph("grandchild", "Grandchild")],
      }[block_id]

      return { results: children ?? [], has_more: false, next_cursor: null }
    })

    const post = await getBlogPostBySlug("nested-post")

    expect(childrenList.mock.calls.map(([params]) => params.block_id)).toEqual([
      "page-1",
      "parent",
      "child",
    ])
    expect(post?.blocks[0].children?.[0].children?.[0]).toMatchObject({
      id: "grandchild",
      type: "paragraph",
    })
  })
})
