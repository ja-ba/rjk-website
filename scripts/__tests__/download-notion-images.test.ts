import { findMissingDimensions } from "@/scripts/download-notion-images"
import type { DimensionEntry } from "@/scripts/download-notion-images"

describe("findMissingDimensions", () => {
  it("returns empty array when all entries have valid dimensions", () => {
    const entries: DimensionEntry[] = [
      {
        title: "Art A",
        filename: "art_a",
        category: "paintings",
        width: 4,
        height: 3,
      },
      {
        title: "Art B",
        filename: "art_b",
        category: "drawings",
        width: 1,
        height: 1,
      },
    ]
    expect(findMissingDimensions(entries)).toEqual([])
  })

  it("returns entries with width 0", () => {
    const entries: DimensionEntry[] = [
      {
        title: "Broken",
        filename: "broken",
        category: "paintings",
        width: 0,
        height: 3,
      },
      {
        title: "Good",
        filename: "good",
        category: "paintings",
        width: 4,
        height: 3,
      },
    ]
    const result = findMissingDimensions(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Broken")
  })

  it("returns entries with height 0", () => {
    const entries: DimensionEntry[] = [
      {
        title: "Broken",
        filename: "broken",
        category: "drawings",
        width: 4,
        height: 0,
      },
    ]
    const result = findMissingDimensions(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Broken")
  })

  it("returns entries with both width and height 0", () => {
    const entries: DimensionEntry[] = [
      {
        title: "Both Zero",
        filename: "both_zero",
        category: "plein_air",
        width: 0,
        height: 0,
      },
    ]
    expect(findMissingDimensions(entries)).toHaveLength(1)
  })

  it("returns empty array for empty input", () => {
    expect(findMissingDimensions([])).toEqual([])
  })

  it("returns multiple broken entries", () => {
    const entries: DimensionEntry[] = [
      {
        title: "A",
        filename: "a",
        category: "paintings",
        width: 0,
        height: 0,
      },
      {
        title: "B",
        filename: "b",
        category: "paintings",
        width: 4,
        height: 3,
      },
      {
        title: "C",
        filename: "c",
        category: "drawings",
        width: 0,
        height: 2,
      },
    ]
    const result = findMissingDimensions(entries)
    expect(result).toHaveLength(2)
    expect(result.map((e) => e.title)).toEqual(["A", "C"])
  })
})
