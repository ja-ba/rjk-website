import { describe, it, expect } from "vitest"
import {
  findMissingFilenames,
  findMissingDimensions,
  shouldFailBuild,
  type ValidationEntry,
} from "../artwork-validation"

function entry(overrides: Partial<ValidationEntry> = {}): ValidationEntry {
  return {
    title: "Test Artwork",
    filename: "test-art",
    category: "paintings",
    width: 4,
    height: 3,
    ...overrides,
  }
}

describe("findMissingDimensions", () => {
  it("returns entries with width 0", () => {
    const entries = [entry({ width: 0, height: 3 })]
    expect(findMissingDimensions(entries)).toHaveLength(1)
  })

  it("returns entries with height 0", () => {
    const entries = [entry({ width: 4, height: 0 })]
    expect(findMissingDimensions(entries)).toHaveLength(1)
  })

  it("returns entries with both 0", () => {
    const entries = [entry({ width: 0, height: 0 })]
    expect(findMissingDimensions(entries)).toHaveLength(1)
  })

  it("returns empty when all dimensions are valid", () => {
    const entries = [entry({ width: 4, height: 3 }), entry({ width: 16, height: 9 })]
    expect(findMissingDimensions(entries)).toHaveLength(0)
  })

  it("returns only the invalid entries", () => {
    const entries = [
      entry({ width: 0, height: 0, title: "Broken" }),
      entry({ width: 4, height: 3, title: "Good" }),
    ]
    const result = findMissingDimensions(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Broken")
  })

  it("returns empty for empty input", () => {
    expect(findMissingDimensions([])).toHaveLength(0)
  })
})

describe("findMissingFilenames", () => {
  it("returns entries with empty filename", () => {
    const entries = [entry({ filename: "" })]
    expect(findMissingFilenames(entries)).toHaveLength(1)
  })

  it("returns empty when all have filenames", () => {
    const entries = [entry({ filename: "a" }), entry({ filename: "b" })]
    expect(findMissingFilenames(entries)).toHaveLength(0)
  })

  it("returns only entries without filenames", () => {
    const entries = [
      entry({ filename: "", title: "No File" }),
      entry({ filename: "has-file", title: "Has File" }),
    ]
    const result = findMissingFilenames(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("No File")
  })

  it("returns empty for empty input", () => {
    expect(findMissingFilenames([])).toHaveLength(0)
  })
})

describe("shouldFailBuild", () => {
  it("returns true in production with missing dimensions", () => {
    expect(shouldFailBuild(0, 3, "production")).toBe(true)
  })

  it("returns true in production with missing filenames", () => {
    expect(shouldFailBuild(2, 0, "production")).toBe(true)
  })

  it("returns true in production with both missing", () => {
    expect(shouldFailBuild(1, 2, "production")).toBe(true)
  })

  it("returns false in production with no missing entries", () => {
    expect(shouldFailBuild(0, 0, "production")).toBe(false)
  })

  it("returns false in preview even with missing entries", () => {
    expect(shouldFailBuild(5, 5, "preview")).toBe(false)
  })

  it("returns false when BUILD_ENV is unset (local dev)", () => {
    expect(shouldFailBuild(5, 5, undefined)).toBe(false)
  })
})
