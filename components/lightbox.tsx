"use client"

import Image from "next/image"
import { useEffect, useCallback, useRef } from "react"
import { X } from "lucide-react"
import type { Artwork } from "@/lib/artwork-data"

interface LightboxProps {
  artworks: Artwork[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ artworks, currentIndex, onClose, onNavigate }: LightboxProps) {
  const artwork = artworks[currentIndex]
  const hasNext = currentIndex < artworks.length - 1
  const hasPrev = currentIndex > 0

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1)
  }, [hasNext, currentIndex, onNavigate])

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1)
  }, [hasPrev, currentIndex, onNavigate])

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const t = e.changedTouches[0]
    const deltaX = t.clientX - touchStartRef.current.x
    const deltaY = t.clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return
    e.preventDefault()
    if (deltaX < 0) goNext()
    else goPrev()
  }, [goNext, goPrev])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, goNext, goPrev])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${artwork.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button - z-30 to stay above click zones */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 p-2 text-background/70 transition-colors hover:text-background"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Image area with click navigation */}
      <div className="relative flex h-full w-full items-center justify-center px-4 py-16 md:px-16 md:py-20">
        {/* Left/right halves: use inset edges (not two w-1/2) so odd widths cannot leave a 1px center gap */}
        <button
          type="button"
          onClick={hasPrev ? goPrev : undefined}
          className={`absolute inset-y-0 left-0 right-1/2 z-10 border-0 bg-transparent p-0 ${hasPrev ? "cursor-w-resize" : "cursor-default"}`}
          aria-label="Previous artwork"
          aria-disabled={!hasPrev}
        >
          <span className="sr-only">Previous</span>
        </button>

        <button
          type="button"
          onClick={hasNext ? goNext : undefined}
          className={`absolute inset-y-0 left-1/2 right-0 z-10 border-0 bg-transparent p-0 ${hasNext ? "cursor-e-resize" : "cursor-default"}`}
          aria-label="Next artwork"
          aria-disabled={!hasNext}
        >
          <span className="sr-only">Next</span>
        </button>

        {/* Fixed slot so layout does not jump when src updates before the next image paints */}
        <div
          data-testid="lightbox-image-slot"
          className="relative mx-auto h-[75vh] w-full max-w-[80vw] shrink-0"
        >
          <Image
            src={artwork.src}
            alt={artwork.title}
            fill
            sizes="80vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Info overlay bottom-left */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-16 z-20">
          <h2 className="font-serif text-lg md:text-xl text-background">
            {artwork.title}
          </h2>
          <p className="mt-1 text-xs md:text-sm text-background/60">
            {artwork.year}
          </p>
          <p className="text-xs md:text-sm text-background/60">
            {artwork.material}
          </p>
        </div>

        {/* Navigation indicator bottom-right */}
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-16 z-20">
          <p className="text-xs text-background/40 tracking-widest">
            {currentIndex + 1} / {artworks.length}
          </p>
        </div>
      </div>
    </div>
  )
}
