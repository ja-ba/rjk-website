import { render, screen } from "@testing-library/react"
import { MissingDimensionsBanner } from "@/components/missing-dimensions-banner"
import { createMockArtwork } from "@/__tests__/helpers/mock-artwork"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("MissingDimensionsBanner", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("renders banner when artworks have missing dimensions in preview", () => {
    vi.stubEnv("BUILD_ENV", "preview")
    const artworks = [
      createMockArtwork({ title: "Missing Art", width: 0, height: 0 }),
      createMockArtwork({ title: "Good Art", width: 4, height: 3 }),
    ]
    render(<MissingDimensionsBanner artworks={artworks} />)
    expect(screen.getByText(/Missing artwork dimensions/)).toBeInTheDocument()
    expect(screen.getByText(/Missing Art/)).toBeInTheDocument()
    expect(screen.queryByText(/Good Art/)).not.toBeInTheDocument()
  })

  it("renders banner when BUILD_ENV is unset (local dev)", () => {
    const artworks = [
      createMockArtwork({ title: "No Dims", width: 0, height: 0 }),
    ]
    render(<MissingDimensionsBanner artworks={artworks} />)
    expect(screen.getByText(/Missing artwork dimensions/)).toBeInTheDocument()
  })

  it("returns null when no artworks have missing dimensions", () => {
    vi.stubEnv("BUILD_ENV", "preview")
    const artworks = [createMockArtwork({ width: 4, height: 3 })]
    const { container } = render(
      <MissingDimensionsBanner artworks={artworks} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("returns null in production even with missing dimensions", () => {
    vi.stubEnv("BUILD_ENV", "production")
    const artworks = [createMockArtwork({ width: 0, height: 0 })]
    const { container } = render(
      <MissingDimensionsBanner artworks={artworks} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("lists all missing artworks", () => {
    vi.stubEnv("BUILD_ENV", "preview")
    const artworks = [
      createMockArtwork({ title: "First Bad", width: 0, height: 3 }),
      createMockArtwork({ title: "Second Bad", width: 4, height: 0 }),
      createMockArtwork({ title: "Valid", width: 4, height: 3 }),
    ]
    render(<MissingDimensionsBanner artworks={artworks} />)
    expect(screen.getByText(/First Bad/)).toBeInTheDocument()
    expect(screen.getByText(/Second Bad/)).toBeInTheDocument()
    expect(screen.queryByText(/Valid/)).not.toBeInTheDocument()
  })

  it("falls back to filename and Notion id when title is empty", () => {
    vi.stubEnv("BUILD_ENV", "preview")
    const artworks = [
      createMockArtwork({
        title: "",
        src: "/images/paintings/sunset.jpg",
        width: 0,
        height: 0,
      }),
    ]
    render(<MissingDimensionsBanner artworks={artworks} />)
    // Filename derived from src is shown so the row can be located in Notion
    expect(screen.getByText(/sunset\.jpg/)).toBeInTheDocument()
    // Notion page id is also surfaced as a stable identifier
    expect(screen.getByText(/Notion id:/)).toBeInTheDocument()
  })

  it("mentions Notion fields in the message", () => {
    vi.stubEnv("BUILD_ENV", "preview")
    const artworks = [createMockArtwork({ width: 0, height: 0 })]
    render(<MissingDimensionsBanner artworks={artworks} />)
    const aspectWidthEls = screen.getAllByText(/Aspect Width/)
    const aspectHeightEls = screen.getAllByText(/Aspect Height/)
    expect(aspectWidthEls.length).toBeGreaterThan(0)
    expect(aspectHeightEls.length).toBeGreaterThan(0)
  })
})
