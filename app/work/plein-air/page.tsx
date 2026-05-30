import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { getArtworksByCategory } from "@/lib/notion"

export const metadata = {
  title: "Plein Air | Rebecca Kleinberg",
  description: "Plein air works by Rebecca Kleinberg. Paintings created outdoors, on location.",
}

export default async function PleinAirPage() {
  const pleinAir = await getArtworksByCategory("plein_air")

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Plein Air
          </h1>
        </div>
        <GalleryGrid artworks={pleinAir} />
      </main>
    </>
  )
}
