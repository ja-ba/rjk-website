import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { MissingDimensionsBanner } from "@/components/missing-dimensions-banner"
import { getArtworksByCategory } from "@/lib/notion"

export const metadata = {
  title: "Paintings | Rebecca Kleinberg",
  description: "Painting works by Rebecca Kleinberg. Oil, acrylic, and mixed media on canvas.",
}

export default async function PaintingsPage() {
  const paintings = await getArtworksByCategory("paintings")
  const valid = paintings.filter((a) => a.width > 0 && a.height > 0)

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Paintings
          </h1>
        </div>
        <MissingDimensionsBanner artworks={paintings} />
        <GalleryGrid artworks={valid} />
      </main>
    </>
  )
}
