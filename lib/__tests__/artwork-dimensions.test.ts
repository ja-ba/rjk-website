import { describe, it, expect } from "vitest"
import { hasDimensions } from "../types"

describe("hasDimensions", () => {
  it("returns true when both width and height are positive", () => {
    expect(hasDimensions({ width: 4, height: 3 })).toBe(true)
  })

  it("returns false when width is 0 (Notion sentinel for missing)", () => {
    expect(hasDimensions({ width: 0, height: 3 })).toBe(false)
  })

  it("returns false when height is 0", () => {
    expect(hasDimensions({ width: 4, height: 0 })).toBe(false)
  })

  it("returns false when both are 0", () => {
    expect(hasDimensions({ width: 0, height: 0 })).toBe(false)
  })

  it("returns false for negative dimensions", () => {
    expect(hasDimensions({ width: -4, height: 3 })).toBe(false)
  })
})
