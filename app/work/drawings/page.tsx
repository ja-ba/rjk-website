import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { MissingDimensionsBanner } from "@/components/missing-dimensions-banner"
import { getArtworksByCategory } from "@/lib/notion"
import { hasDimensions } from "@/lib/types"

export const metadata = {
  title: "Drawings | Rebecca Kleinberg",
  description: "Drawing works by Rebecca Kleinberg. Charcoal, graphite, and ink on paper.",
}

export default async function DrawingsPage() {
  const drawings = await getArtworksByCategory("drawings")
  const valid = drawings.filter(hasDimensions)

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Drawings
          </h1>
        </div>
        <MissingDimensionsBanner artworks={drawings} />
        <GalleryGrid artworks={valid} />
      </main>
    </>
  )
}
