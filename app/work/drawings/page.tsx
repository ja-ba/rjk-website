import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { drawings } from "@/lib/artwork-data"

export const metadata = {
  title: "Drawings | Elena Vasquez",
  description: "Drawing works by Elena Vasquez. Charcoal, graphite, and ink on paper.",
}

export default function DrawingsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Drawings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Works on paper in charcoal, graphite, and ink. Studies in line, shadow, and observation.
          </p>
        </div>
        <GalleryGrid artworks={drawings} />
      </main>
    </>
  )
}
