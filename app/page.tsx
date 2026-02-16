import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section - Full viewport image */}
        <section className="relative h-screen w-full">
          <Image
            src="/images/hero.jpg"
            alt="Featured artwork by Elena Vasquez"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-foreground/20" />

          {/* Hero text overlay */}
          <div className="absolute bottom-12 left-6 md:bottom-20 md:left-16 z-10">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-background leading-tight">
              Elena Vasquez
            </h1>
            <p className="mt-3 text-sm md:text-base text-background/80 tracking-wide max-w-md">
              Contemporary painter exploring the boundaries between
              abstraction and figuration.
            </p>
            <Link
              href="/work/paintings"
              className="mt-6 inline-block border border-background/60 px-6 py-2.5 text-xs tracking-widest uppercase text-background/90 transition-all hover:bg-background hover:text-foreground"
            >
              View Work
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
