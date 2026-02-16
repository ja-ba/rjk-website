"use client"

import Image from "next/image"
import { useState, useMemo, useRef, useEffect } from "react"
import type { Artwork } from "@/lib/artwork-data"
import { Lightbox } from "./lightbox"

interface GalleryGridProps {
  artworks: Artwork[]
}

const GAP = 8

/**
 * Row-based masonry: packs images into justified rows of a target height.
 * Each image is scaled so that the row fills the container width exactly,
 * producing varying image widths but a consistent row height.
 */
function computeRows(
  artworks: Artwork[],
  containerWidth: number,
  targetRowHeight: number
) {
  const rows: { items: { artwork: Artwork; index: number; width: number; height: number }[]; height: number }[] = []
  let currentRow: { artwork: Artwork; index: number; aspectRatio: number }[] = []
  let currentRowAspectSum = 0

  for (let i = 0; i < artworks.length; i++) {
    const artwork = artworks[i]
    const ar = artwork.width / artwork.height
    currentRow.push({ artwork, index: i, aspectRatio: ar })
    currentRowAspectSum += ar

    // Check if this row has enough content to fill the container width
    const rowWidthAtTarget = currentRowAspectSum * targetRowHeight + (currentRow.length - 1) * GAP
    if (rowWidthAtTarget >= containerWidth || i === artworks.length - 1) {
      // Calculate the actual row height to perfectly fill the container width
      const availableWidth = containerWidth - (currentRow.length - 1) * GAP
      const rowHeight = availableWidth / currentRowAspectSum

      // For the last row, cap the height at the target so it doesn't stretch too tall
      const finalHeight = i === artworks.length - 1 ? Math.min(rowHeight, targetRowHeight) : rowHeight

      rows.push({
        height: finalHeight,
        items: currentRow.map((item) => ({
          artwork: item.artwork,
          index: item.index,
          width: item.aspectRatio * finalHeight,
          height: finalHeight,
        })),
      })

      currentRow = []
      currentRowAspectSum = 0
    }
  }

  return rows
}

export function GalleryGrid({ artworks }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Responsive target row height
  const targetRowHeight = containerWidth < 640 ? 180 : containerWidth < 1024 ? 220 : 260

  const rows = useMemo(() => {
    if (containerWidth === 0) return []
    return computeRows(artworks, containerWidth, targetRowHeight)
  }, [artworks, containerWidth, targetRowHeight])

  return (
    <>
      <div ref={containerRef} className="w-full">
        {containerWidth > 0 &&
          rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              style={{ gap: GAP, marginBottom: GAP }}
            >
              {row.items.map((item) => (
                <button
                  key={item.artwork.id}
                  onClick={() => setSelectedIndex(item.index)}
                  className="relative overflow-hidden group cursor-pointer bg-muted flex-shrink-0"
                  style={{
                    width: item.width,
                    height: item.height,
                    aspectRatio: `${item.artwork.width} / ${item.artwork.height}`,
                  }}
                  aria-label={`View ${item.artwork.title}`}
                >
                  <Image
                    src={item.artwork.src}
                    alt={item.artwork.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10" />
                  <div className="absolute inset-0 flex items-end p-3 md:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-serif text-background">
                        {item.artwork.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-background/80">
                        {item.artwork.year}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          artworks={artworks}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  )
}
