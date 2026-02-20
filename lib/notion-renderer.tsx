import type { NotionBlock, NotionRichText } from "./types"

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

export function renderNotionBlocks(blocks: NotionBlock[]): React.ReactNode[] {
  return blocks.map((block) => {
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
            {block.heading_1
              ? renderRichText(block.heading_1.rich_text)
              : null}
          </h2>
        )

      case "heading_2":
        return (
          <h3
            key={block.id}
            className="font-serif text-lg md:text-xl text-foreground"
          >
            {block.heading_2
              ? renderRichText(block.heading_2.rich_text)
              : null}
          </h3>
        )

      case "heading_3":
        return (
          <h4
            key={block.id}
            className="font-serif text-base md:text-lg text-foreground"
          >
            {block.heading_3
              ? renderRichText(block.heading_3.rich_text)
              : null}
          </h4>
        )

      case "bulleted_list_item":
        return (
          <li
            key={block.id}
            className="text-sm leading-relaxed text-muted-foreground ml-4 list-disc"
          >
            {block.bulleted_list_item
              ? renderRichText(block.bulleted_list_item.rich_text)
              : null}
          </li>
        )

      case "numbered_list_item":
        return (
          <li
            key={block.id}
            className="text-sm leading-relaxed text-muted-foreground ml-4 list-decimal"
          >
            {block.numbered_list_item
              ? renderRichText(block.numbered_list_item.rich_text)
              : null}
          </li>
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
        return (
          <figure key={block.id}>
            <img
              src={src}
              alt={captionText || ""}
              style={{ maxWidth: "100%", height: "auto", display: "block" }}
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
  })
}
