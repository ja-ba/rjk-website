import type { NotionBlock, NotionRichText } from "./types"
import { BLOG_IMAGE_MAX_WIDTHS } from "./notion-image-sizing"

function renderRichText(richTexts: NotionRichText[]): React.ReactNode[] {
  return richTexts.map((text, i) => {
    let content: React.ReactNode = text.plain_text

    if (text.annotations.bold) {
      content = <strong key={`b-${i}`}>{content}</strong>
    }
    if (text.annotations.italic) {
      content = <em key={`i-${i}`}>{content}</em>
    }
    if (text.annotations.strikethrough) {
      content = <s key={`s-${i}`}>{content}</s>
    }
    if (text.annotations.code) {
      content = (
        <code key={`c-${i}`} className="bg-muted px-1 py-0.5 rounded text-xs">
          {content}
        </code>
      )
    }
    if (text.href) {
      content = (
        <a
          key={`a-${i}`}
          href={text.href}
          className="underline transition-opacity hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      )
    }

    return <span key={i}>{content}</span>
  })
}

function renderListItem(block: NotionBlock): React.ReactNode {
  const richText =
    block.type === "bulleted_list_item"
      ? block.bulleted_list_item?.rich_text
      : block.numbered_list_item?.rich_text

  return (
    <li
      key={block.id}
      className="text-sm leading-relaxed text-muted-foreground"
    >
      {richText ? renderRichText(richText) : null}
      {block.children?.length ? renderNotionBlocks(block.children, true) : null}
    </li>
  )
}

function renderBlock(block: NotionBlock): React.ReactNode {
  switch (block.type) {
    case "paragraph":
      if (!block.paragraph?.rich_text.length) {
        return <div key={block.id} className="h-4" />
      }
      return (
        <p
          key={block.id}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {renderRichText(block.paragraph.rich_text)}
        </p>
      )

    case "heading_1":
      return (
        <h2
          key={block.id}
          className="font-serif text-xl md:text-2xl text-foreground"
        >
          {block.heading_1 ? renderRichText(block.heading_1.rich_text) : null}
        </h2>
      )

    case "heading_2":
      return (
        <h3
          key={block.id}
          className="font-serif text-lg md:text-xl text-foreground"
        >
          {block.heading_2 ? renderRichText(block.heading_2.rich_text) : null}
        </h3>
      )

    case "heading_3":
      return (
        <h4
          key={block.id}
          className="font-serif text-base md:text-lg text-foreground"
        >
          {block.heading_3 ? renderRichText(block.heading_3.rich_text) : null}
        </h4>
      )

    case "heading_4":
      return (
        <h5
          key={block.id}
          className="font-serif text-sm md:text-base text-foreground"
        >
          {block.heading_4 ? renderRichText(block.heading_4.rich_text) : null}
        </h5>
      )

    case "image": {
      if (!block.image) return null
      const src =
        block.image.type === "external"
          ? block.image.external?.url
          : block.image.localUrl
      if (!src) return null
      const captionText =
        block.image.caption?.map((t) => t.plain_text).join("") ?? ""
      const maxWidth = block.image.displaySize
        ? BLOG_IMAGE_MAX_WIDTHS[block.image.displaySize]
        : undefined
      return (
        <figure
          key={block.id}
          data-image-size={block.image.displaySize}
          style={
            maxWidth
              ? {
                  maxWidth: `${maxWidth}px`,
                  marginInline: "auto",
                }
              : undefined
          }
        >
          <img
            src={src}
            alt={captionText || ""}
            style={{
              width: maxWidth ? "100%" : undefined,
              maxWidth: "100%",
              height: "auto",
              display: "block",
              marginInline: "auto",
            }}
          />
          {captionText && (
            <figcaption className="mt-2 text-xs text-muted-foreground text-center">
              {captionText}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      return null
  }
}

function renderBlockWithChildren(block: NotionBlock): React.ReactNode {
  const content = renderBlock(block)
  if (!block.children?.length) return content

  return (
    <div key={block.id}>
      {content}
      <div className="ml-4">{renderNotionBlocks(block.children, true)}</div>
    </div>
  )
}

export function renderNotionBlocks(
  blocks: NotionBlock[],
  isNested = false
): React.ReactNode[] {
  const nodes: React.ReactNode[] = []

  for (let index = 0; index < blocks.length; ) {
    const block = blocks[index]
    const isBulletedList = block.type === "bulleted_list_item"
    const isNumberedList = block.type === "numbered_list_item"

    if (!isBulletedList && !isNumberedList) {
      nodes.push(renderBlockWithChildren(block))
      index++
      continue
    }

    const listBlocks: NotionBlock[] = []
    while (index < blocks.length && blocks[index].type === block.type) {
      listBlocks.push(blocks[index])
      index++
    }

    const List = isBulletedList ? "ul" : "ol"
    const listClassName = isBulletedList ? "list-disc" : "list-decimal"
    const indentationClassName = isNested ? "ml-4" : "ml-6"
    nodes.push(
      <List key={`list-${listBlocks[0].id}`} className={`${indentationClassName} ${listClassName}`}>
        {listBlocks.map(renderListItem)}
      </List>
    )
  }

  return nodes
}
