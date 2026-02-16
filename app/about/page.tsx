import Image from "next/image"
import { Navigation } from "@/components/navigation"

export const metadata = {
  title: "About | Elena Vasquez",
  description: "Learn about Elena Vasquez, contemporary artist working across painting and drawing.",
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
                alt="Elena Vasquez in her studio"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>

          {/* Bio text */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">
              About
            </h1>

            <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground max-w-lg">
              <p>
                Elena Vasquez is a contemporary artist based in Barcelona, working
                primarily in oil painting and drawing. Her practice explores the
                tension between abstraction and figuration, seeking to capture fleeting
                emotional states through color, gesture, and form.
              </p>
              <p>
                After studying Fine Arts at the Universitat de Barcelona and
                completing a residency at the Cit{'e\u0301'} Internationale des Arts in Paris,
                Elena has exhibited widely across Europe and North America. Her work
                is held in private collections in Madrid, London, New York, and
                Tokyo.
              </p>
              <p>
                Her recent paintings draw from landscape memory and interior
                spaces, layering translucent washes with bold gestural marks.
                The drawings function as both independent works and studies for
                larger compositions, rooted in direct observation.
              </p>
              <p>
                Elena currently lives and works in the El Born neighborhood of
                Barcelona.
              </p>
            </div>

            {/* Contact / links */}
            <div className="mt-10 flex flex-col gap-2 text-xs tracking-widest uppercase text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-border" />
                <span>studio@elenavasquez.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-border" />
                <span>Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
