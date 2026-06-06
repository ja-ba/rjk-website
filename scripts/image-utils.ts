import convert from "heic-convert"

// Detects HEIC/HEIF by the ISO Base Media 'ftyp' box at offset 4 and the brand at offset 8.
export function isHeic(buf: Buffer): boolean {
  if (buf.length < 12) return false
  const ftyp = buf.toString("ascii", 4, 8)
  const brand = buf.toString("ascii", 8, 12)
  return ftyp === "ftyp" && ["heic", "heix", "mif1", "msf1"].includes(brand)
}

export async function toJpeg(buf: Buffer): Promise<Buffer> {
  return Buffer.from(await convert({ buffer: buf, format: "JPEG", quality: 0.9 }))
}
