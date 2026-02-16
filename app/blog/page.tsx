import Link from "next/link"
import { Navigation } from "@/components/navigation"

interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
}

const posts: BlogPost[] = [
  {
    slug: "studio-reflections-winter",
    title: "Studio Reflections: Winter Light",
    date: "January 15, 2025",
    excerpt:
      "The winter months bring a particular quality of light to the studio that transforms how I see color. The low sun casts long shadows across the canvases, revealing textures I hadn't noticed before.",
  },
  {
    slug: "new-series-tidal-memory",
    title: "New Series: Tidal Memory",
    date: "November 3, 2024",
    excerpt:
      "I've been spending time along the coast this autumn, collecting visual impressions of the sea at different hours. This new body of work began as quick studies but evolved into something larger.",
  },
  {
    slug: "exhibition-at-galeria-nova",
    title: "Exhibition at Galeria Nova, Barcelona",
    date: "September 12, 2024",
    excerpt:
      "Thrilled to announce my upcoming solo exhibition at Galeria Nova in the Gothic Quarter. The show will feature twelve new paintings alongside a selection of preparatory drawings.",
  },
  {
    slug: "on-drawing-as-thinking",
    title: "On Drawing as Thinking",
    date: "June 28, 2024",
    excerpt:
      "Drawing has always been where my ideas take shape. Not as a preliminary step, but as a form of thinking itself. The direct contact between hand, material, and paper creates a different kind of knowledge.",
  },
  {
    slug: "paris-residency-reflections",
    title: "Paris Residency: Looking Back",
    date: "March 5, 2024",
    excerpt:
      "It's been a year since I returned from the Cite Internationale des Arts. The experience reshaped my approach to scale and color in ways I'm still discovering.",
  },
]

export const metadata = {
  title: "Blog | Elena Vasquez",
  description: "Writings and updates from the studio of Elena Vasquez.",
}

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16 max-w-3xl">
        <div className="mb-10 md:mb-14">
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">
            Blog
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Notes, reflections, and updates from the studio.
          </p>
        </div>

        <div className="flex flex-col">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`py-8 ${index !== posts.length - 1 ? "border-b border-border" : ""}`}
            >
              <time className="text-xs tracking-widest uppercase text-muted-foreground">
                {post.date}
              </time>
              <h2 className="mt-2 font-serif text-lg md:text-xl text-foreground">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-opacity hover:opacity-60"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-xs tracking-widest uppercase text-foreground transition-opacity hover:opacity-60"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
