import { describe, it, expect } from "vitest"
import { isHeic } from "../image-utils"

function makeBuffer(hex: string): Buffer {
  return Buffer.from(hex.replace(/\s/g, ""), "hex")
}

// Builds a minimal ISO Base Media ftyp box: 4-byte box size + "ftyp" + 4-byte brand
function heicBuffer(brand: string): Buffer {
  const buf = Buffer.alloc(24)
  buf.writeUInt32BE(24, 0)           // box size
  buf.write("ftyp", 4, "ascii")     // box type
  buf.write(brand.padEnd(4), 8, "ascii") // major brand
  return buf
}

describe("isHeic", () => {
  it("returns true for heic brand", () => {
    expect(isHeic(heicBuffer("heic"))).toBe(true)
  })

  it("returns true for heix brand", () => {
    expect(isHeic(heicBuffer("heix"))).toBe(true)
  })

  it("returns true for mif1 brand", () => {
    expect(isHeic(heicBuffer("mif1"))).toBe(true)
  })

  it("returns true for msf1 brand", () => {
    expect(isHeic(heicBuffer("msf1"))).toBe(true)
  })

  it("returns false for a JPEG (FF D8 FF header)", () => {
    const buf = makeBuffer("FFD8FFE000104A464946000101000001000100")
    expect(isHeic(buf)).toBe(false)
  })

  it("returns false for a buffer shorter than 12 bytes", () => {
    expect(isHeic(Buffer.alloc(11))).toBe(false)
  })

  it("returns false for an all-zero buffer", () => {
    expect(isHeic(Buffer.alloc(24))).toBe(false)
  })

  it("returns false for an unrecognised ftyp brand (e.g. mp42)", () => {
    expect(isHeic(heicBuffer("mp42"))).toBe(false)
  })
})
