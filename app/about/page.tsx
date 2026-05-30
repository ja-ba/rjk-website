import Image from "next/image"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "About | Rebecca Kleinberg",
  description: "Learn about Rebecca Kleinberg, artist",
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="flex flex-col gap-12 md:flex-row md:gap-20 lg:gap-28 max-w-6xl">
          {/* Portrait */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src="/images/about-portrait.jpg"
                alt="Rebecca Kleinberg plein air painting at Smith Rock"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-xl md:text-2xl text-foreground mb-3">
              About
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-lg mb-6">
              Rebecca Kleinberg is an artist based in Seattle, Washington. She is currently a first-year student in the Classical Atelier at Gage Academy of Art. She is interested in still life, landscape, figure, and op-art.
            </p>

            {/* Contact / links */}
            <div className="mt-10 flex flex-col gap-2 text-xs tracking-widest uppercase text-muted-foreground">
              <div className="flex items-center gap-2">
                
                
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-border" />
                <a href="https://instagram.com/bek.art" className="hover:text-foreground transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
