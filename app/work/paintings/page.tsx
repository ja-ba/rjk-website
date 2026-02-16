import { Navigation } from "@/components/navigation"
import { GalleryGrid } from "@/components/gallery-grid"
import { paintings } from "@/lib/artwork-data"

export const metadata = {
  title: "Paintings | Elena Vasquez",
  description: "Painting works by Elena Vasquez. Oil, acrylic, and mixed media on canvas.",
}

export default function PaintingsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Paintings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Oil, acrylic, and mixed media works exploring color, form, and emotional depth.
          </p>
        </div>
        <GalleryGrid artworks={paintings} />
      </main>
    </>
  )
}
