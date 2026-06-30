import { describe, it, expect } from "vitest"
import { ARTWORK_CATEGORIES, isArtworkCategory } from "../types"

describe("isArtworkCategory", () => {
  it.each(ARTWORK_CATEGORIES)("returns true for %s", (category) => {
    expect(isArtworkCategory(category)).toBe(true)
  })

  it("returns false for print", () => {
    expect(isArtworkCategory("print")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isArtworkCategory("")).toBe(false)
  })
})
