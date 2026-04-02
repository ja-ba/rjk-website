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
              Rebecca Kleinberg is an artist based in Seattle, Washington. She is currently a first-year student in the Classical Atelier at Gage Academy of Art. Her recent work includes geometric designs, plein air landscapes, single-object still lifes in graphite, and academic figures and mastercopies.
            </p>

            <h1 className="font-serif text-xl md:text-2xl text-foreground">
              Artist statement
            </h1>

            <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground max-w-lg">
              <p>
                My goal is to make art that people want to look at because it makes them think or feel something. The art that has been most interesting and meaningful to me is art that evokes a feeling of recognition of our shared world - whether it’s the beauty or ugliness of that world - and recognition of some truth, however small or seemingly insignificant. I seek to find and portray small moments of truth in order to give the viewer this sense of recognition. I believe that any subject portrayed honestly and sympathetically, showing the inherent balance and harmony in our physical world, and striving for the essence of a thing, makes for successful artwork.


              </p>

              <p>
                
              </p>
              <p>
                
              </p>
              <p>
                
              </p>
            </div>

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
