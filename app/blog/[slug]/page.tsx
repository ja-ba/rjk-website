import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ArrowLeft } from "lucide-react"

const postsContent: Record<string, { title: string; date: string; content: string[] }> = {
  "studio-reflections-winter": {
    title: "Studio Reflections: Winter Light",
    date: "January 15, 2025",
    content: [
      "The winter months bring a particular quality of light to the studio that transforms how I see color. The low sun casts long shadows across the canvases, revealing textures I hadn't noticed before.",
      "I've been working on a series of smaller paintings that respond to this seasonal shift. Where the summer work was bold and saturated, these new pieces are quieter, more atmospheric. The palette has narrowed to grays, soft blues, and the palest yellows.",
      "There's something about the short days that creates urgency. The window of good painting light is brief, and that constraint forces decisions. I find myself being bolder, more intuitive, trusting the first mark rather than deliberating.",
      "I've also returned to drawing more intensely. The charcoal studies I've been making in the early morning, before the light is strong enough for color work, have taken on a life of their own. Several may become independent pieces.",
    ],
  },
  "new-series-tidal-memory": {
    title: "New Series: Tidal Memory",
    date: "November 3, 2024",
    content: [
      "I've been spending time along the coast this autumn, collecting visual impressions of the sea at different hours. This new body of work began as quick studies but evolved into something larger.",
      "The sea doesn't stay still long enough to paint from observation in any traditional sense. Instead, I'm working from memory and sensation. The rhythm of waves, the weight of salt air, the way light fractures across moving water.",
      "These paintings are my largest to date. The scale feels necessary. I want the viewer to feel surrounded by the work, the way one feels surrounded by the ocean.",
      "The material process has shifted too. I'm layering thin glazes over thick impasto, letting the paint itself create the push and pull between depth and surface that I experience standing at the shoreline.",
    ],
  },
  "exhibition-at-galeria-nova": {
    title: "Exhibition at Galeria Nova, Barcelona",
    date: "September 12, 2024",
    content: [
      "Thrilled to announce my upcoming solo exhibition at Galeria Nova in the Gothic Quarter. The show will feature twelve new paintings alongside a selection of preparatory drawings.",
      "Working with the gallery team has been a wonderful experience. The space itself has influenced the work. The high ceilings and raw stone walls create a dialogue between contemporary painting and historical architecture.",
      "The exhibition opens on October 15th and will run through December. There will be an opening reception and I'll be giving a talk about the work on November 2nd.",
      "This body of work represents two years of sustained exploration into landscape memory. I'm looking forward to seeing how the pieces speak to each other when installed together in the gallery.",
    ],
  },
  "on-drawing-as-thinking": {
    title: "On Drawing as Thinking",
    date: "June 28, 2024",
    content: [
      "Drawing has always been where my ideas take shape. Not as a preliminary step, but as a form of thinking itself. The direct contact between hand, material, and paper creates a different kind of knowledge.",
      "When I draw, decisions happen faster than thought. The charcoal moves before I've consciously decided where it should go. This pre-verbal intelligence is something I'm trying to bring into the paintings as well.",
      "I've been revisiting life drawing this year, working with a model in the studio one morning a week. After years focused on landscape and abstraction, returning to the figure feels like coming home to a language I'd almost forgotten.",
      "The figure drawings feed the abstract work in unexpected ways. The gesture of a shoulder becomes the curve of a hillside. The weight of a seated body informs how I think about compositional gravity.",
    ],
  },
  "paris-residency-reflections": {
    title: "Paris Residency: Looking Back",
    date: "March 5, 2024",
    content: [
      "It's been a year since I returned from the Cite Internationale des Arts. The experience reshaped my approach to scale and color in ways I'm still discovering.",
      "Living in Paris, surrounded by centuries of painting tradition, was both inspiring and humbling. I spent hours in the Musee d'Orsay, studying how the Impressionists handled light. Not to imitate, but to understand.",
      "The studio I was given was small by my usual standards, which forced me to work on an intimate scale. Paradoxically, this constraint led to some of my most ambitious compositions. Thinking large on a small surface taught me about density and compression.",
      "The connections I made with other artists in residence continue to nourish my practice. We're planning a group exhibition for next year that will bring together work made during our overlapping residencies.",
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(postsContent).map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = postsContent[slug]

  if (!post) {
    return (
      <>
        <Navigation />
        <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16 max-w-3xl">
          <p className="text-muted-foreground">Post not found.</p>
          <Link href="/blog" className="mt-4 inline-block text-sm text-foreground underline">
            Back to Blog
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground transition-opacity hover:opacity-60 mb-8"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <article>
          <time className="text-xs tracking-widest uppercase text-muted-foreground">
            {post.date}
          </time>
          <h1 className="mt-2 font-serif text-2xl md:text-3xl text-foreground">
            {post.title}
          </h1>

          <div className="mt-8 flex flex-col gap-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
    </>
  )
}
