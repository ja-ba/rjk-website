import { render, screen } from "@testing-library/react"
import { MissingDimensionsBanner } from "@/components/missing-dimensions-banner"
import { createMockArtwork } from "@/__tests__/helpers/mock-artwork"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("MissingDimensionsBanner", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe("missing dimensions", () => {
    it("renders banner when artworks have missing dimensions in preview", () => {
      vi.stubEnv("BUILD_ENV", "preview")
      const artworks = [
        createMockArtwork({ title: "Missing Art", width: 0, height: 0 }),
        createMockArtwork({ title: "Good Art", width: 4, height: 3 }),
      ]
      render(<MissingDimensionsBanner artworks={artworks} />)
      expect(screen.getByText(/Incomplete artwork entries/)).toBeInTheDocument()
      expect(screen.getByText(/Missing Art/)).toBeInTheDocument()
      expect(screen.queryByText(/Good Art/)).not.toBeInTheDocument()
    })

    it("renders banner when BUILD_ENV is unset (local dev)", () => {
      const artworks = [
        createMockArtwork({ title: "No Dims", width: 0, height: 0 }),
      ]
      render(<MissingDimensionsBanner artworks={artworks} />)
      expect(screen.getByText(/Incomplete artwork entries/)).toBeInTheDocument()
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

  describe("missing filenames", () => {
    it("renders banner when artworks are missing a filename", () => {
      vi.stubEnv("BUILD_ENV", "preview")
      const artworks = [
        createMockArtwork({
          title: "No File",
          src: "",
          width: 4,
          height: 3,
        }),
      ]
      render(<MissingDimensionsBanner artworks={artworks} />)
      expect(screen.getByText(/Incomplete artwork entries/)).toBeInTheDocument()
      expect(screen.getByText(/No File/)).toBeInTheDocument()
      expect(screen.getByText(/missing a/)).toBeInTheDocument()
      // Should NOT mention Aspect Width/Height for a filename-only issue
      expect(screen.queryByText(/Aspect Width/)).not.toBeInTheDocument()
    })

    it("shows both filename and dimension sections when both issues exist", () => {
      vi.stubEnv("BUILD_ENV", "preview")
      const artworks = [
        createMockArtwork({ title: "No File", src: "", width: 4, height: 3 }),
        createMockArtwork({ title: "No Dims", src: "/images/paintings/x.jpg", width: 0, height: 0 }),
      ]
      render(<MissingDimensionsBanner artworks={artworks} />)
      expect(screen.getByText(/No File/)).toBeInTheDocument()
      expect(screen.getByText(/No Dims/)).toBeInTheDocument()
      // Both the filename and dimension sections render when both issues exist
      const paragraphs = screen.getAllByText(/The following artworks are missing/)
      expect(paragraphs.length).toBe(2)
    })

    it("does not double-count artwork missing both filename and dimensions", () => {
      vi.stubEnv("BUILD_ENV", "preview")
      const artworks = [
        createMockArtwork({ title: "Both Broken", src: "", width: 0, height: 0 }),
      ]
      render(<MissingDimensionsBanner artworks={artworks} />)
      // Should appear only once — in the filename section, not dimensions
      const items = screen.getAllByText(/Both Broken/)
      expect(items).toHaveLength(1)
      expect(screen.getByText(/The following artworks are missing/)).toBeInTheDocument()
      expect(screen.queryByText(/Aspect Width/)).not.toBeInTheDocument()
    })
  })

  describe("visibility", () => {
    it("returns null when no artworks have missing metadata", () => {
      vi.stubEnv("BUILD_ENV", "preview")
      const artworks = [createMockArtwork({ width: 4, height: 3 })]
      const { container } = render(
        <MissingDimensionsBanner artworks={artworks} />
      )
      expect(container.firstChild).toBeNull()
    })

    it("returns null in production even with missing entries", () => {
      vi.stubEnv("BUILD_ENV", "production")
      const artworks = [createMockArtwork({ width: 0, height: 0 })]
      const { container } = render(
        <MissingDimensionsBanner artworks={artworks} />
      )
      expect(container.firstChild).toBeNull()
    })
  })
})
