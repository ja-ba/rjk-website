/**
 * One-time script to populate Notion databases with existing hardcoded data.
 *
 * Usage:
 *   NOTION_API_KEY=... NOTION_BLOG_DATABASE_ID=... NOTION_ARTWORK_DATABASE_ID=... pnpm tsx scripts/seed-notion.ts
 *
 * This script creates entries in both the Blog Posts and Artwork databases.
 * For artwork, images must be uploaded manually to each Notion entry after seeding
 * (the Notion API does not support file uploads to database entries).
 */

import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const BLOG_DB_ID = process.env.NOTION_BLOG_DATABASE_ID!
const ARTWORK_DB_ID = process.env.NOTION_ARTWORK_DATABASE_ID!

// --- Existing hardcoded data ---

const blogPosts = [
  {
    title: "Studio Reflections: Winter Light",
    slug: "studio-reflections-winter",
    date: "2025-01-15",
    excerpt:
      "The winter months bring a particular quality of light to the studio that transforms how I see color. The low sun casts long shadows across the canvases, revealing textures I hadn't noticed before.",
    content: [
      "The winter months bring a particular quality of light to the studio that transforms how I see color. The low sun casts long shadows across the canvases, revealing textures I hadn't noticed before.",
      "I've been working on a series of smaller paintings that respond to this seasonal shift. Where the summer work was bold and saturated, these new pieces are quieter, more atmospheric. The palette has narrowed to grays, soft blues, and the palest yellows.",
      "There's something about the short days that creates urgency. The window of good painting light is brief, and that constraint forces decisions. I find myself being bolder, more intuitive, trusting the first mark rather than deliberating.",
      "I've also returned to drawing more intensely. The charcoal studies I've been making in the early morning, before the light is strong enough for color work, have taken on a life of their own. Several may become independent pieces.",
    ],
  },
  {
    title: "New Series: Tidal Memory",
    slug: "new-series-tidal-memory",
    date: "2024-11-03",
    excerpt:
      "I've been spending time along the coast this autumn, collecting visual impressions of the sea at different hours. This new body of work began as quick studies but evolved into something larger.",
    content: [
      "I've been spending time along the coast this autumn, collecting visual impressions of the sea at different hours. This new body of work began as quick studies but evolved into something larger.",
      "The sea doesn't stay still long enough to paint from observation in any traditional sense. Instead, I'm working from memory and sensation. The rhythm of waves, the weight of salt air, the way light fractures across moving water.",
      "These paintings are my largest to date. The scale feels necessary. I want the viewer to feel surrounded by the work, the way one feels surrounded by the ocean.",
      "The material process has shifted too. I'm layering thin glazes over thick impasto, letting the paint itself create the push and pull between depth and surface that I experience standing at the shoreline.",
    ],
  },
  {
    title: "Exhibition at Galeria Nova, Barcelona",
    slug: "exhibition-at-galeria-nova",
    date: "2024-09-12",
    excerpt:
      "Thrilled to announce my upcoming solo exhibition at Galeria Nova in the Gothic Quarter. The show will feature twelve new paintings alongside a selection of preparatory drawings.",
    content: [
      "Thrilled to announce my upcoming solo exhibition at Galeria Nova in the Gothic Quarter. The show will feature twelve new paintings alongside a selection of preparatory drawings.",
      "Working with the gallery team has been a wonderful experience. The space itself has influenced the work. The high ceilings and raw stone walls create a dialogue between contemporary painting and historical architecture.",
      "The exhibition opens on October 15th and will run through December. There will be an opening reception and I'll be giving a talk about the work on November 2nd.",
      "This body of work represents two years of sustained exploration into landscape memory. I'm looking forward to seeing how the pieces speak to each other when installed together in the gallery.",
    ],
  },
  {
    title: "On Drawing as Thinking",
    slug: "on-drawing-as-thinking",
    date: "2024-06-28",
    excerpt:
      "Drawing has always been where my ideas take shape. Not as a preliminary step, but as a form of thinking itself. The direct contact between hand, material, and paper creates a different kind of knowledge.",
    content: [
      "Drawing has always been where my ideas take shape. Not as a preliminary step, but as a form of thinking itself. The direct contact between hand, material, and paper creates a different kind of knowledge.",
      "When I draw, decisions happen faster than thought. The charcoal moves before I've consciously decided where it should go. This pre-verbal intelligence is something I'm trying to bring into the paintings as well.",
      "I've been revisiting life drawing this year, working with a model in the studio one morning a week. After years focused on landscape and abstraction, returning to the figure feels like coming home to a language I'd almost forgotten.",
      "The figure drawings feed the abstract work in unexpected ways. The gesture of a shoulder becomes the curve of a hillside. The weight of a seated body informs how I think about compositional gravity.",
    ],
  },
  {
    title: "Paris Residency: Looking Back",
    slug: "paris-residency-reflections",
    date: "2024-03-05",
    excerpt:
      "It's been a year since I returned from the Cite Internationale des Arts. The experience reshaped my approach to scale and color in ways I'm still discovering.",
    content: [
      "It's been a year since I returned from the Cite Internationale des Arts. The experience reshaped my approach to scale and color in ways I'm still discovering.",
      "Living in Paris, surrounded by centuries of painting tradition, was both inspiring and humbling. I spent hours in the Musee d'Orsay, studying how the Impressionists handled light. Not to imitate, but to understand.",
      "The studio I was given was small by my usual standards, which forced me to work on an intimate scale. Paradoxically, this constraint led to some of my most ambitious compositions. Thinking large on a small surface taught me about density and compression.",
      "The connections I made with other artists in residence continue to nourish my practice. We're planning a group exhibition for next year that will bring together work made during our overlapping residencies.",
    ],
  },
]

const paintings = [
  { title: "Ember and Ash", year: 2024, material: "Oil on canvas, 120 x 150 cm", aspectWidth: 4, aspectHeight: 3, sortOrder: 1 },
  { title: "Morning Veil", year: 2024, material: "Oil on linen, 90 x 120 cm", aspectWidth: 4, aspectHeight: 3, sortOrder: 2 },
  { title: "Geometry of Silence", year: 2023, material: "Acrylic on canvas, 100 x 100 cm", aspectWidth: 1, aspectHeight: 1, sortOrder: 3 },
  { title: "The Wanderer", year: 2023, material: "Oil on canvas, 130 x 90 cm", aspectWidth: 3, aspectHeight: 5, sortOrder: 4 },
  { title: "Wildflowers in October", year: 2022, material: "Oil on panel, 60 x 50 cm", aspectWidth: 3, aspectHeight: 4, sortOrder: 5 },
  { title: "Tidal Memory", year: 2022, material: "Mixed media on canvas, 150 x 200 cm", aspectWidth: 4, aspectHeight: 3, sortOrder: 6 },
  { title: "Dusk Over the Atlantic", year: 2024, material: "Oil on canvas, 60 x 180 cm", aspectWidth: 3, aspectHeight: 1, sortOrder: 7 },
  { title: "Figure in the Mist", year: 2023, material: "Oil on linen, 160 x 80 cm", aspectWidth: 2, aspectHeight: 3, sortOrder: 8 },
  { title: "Terracotta Fragment", year: 2024, material: "Acrylic on panel, 50 x 50 cm", aspectWidth: 1, aspectHeight: 1, sortOrder: 9 },
  { title: "Golden Fields, September", year: 2023, material: "Oil on canvas, 50 x 200 cm", aspectWidth: 5, aspectHeight: 2, sortOrder: 10 },
]

const drawings = [
  { title: "Reaching", year: 2024, material: "Charcoal on paper, 50 x 65 cm", aspectWidth: 3, aspectHeight: 4, sortOrder: 1 },
  { title: "Rue de la Paix", year: 2023, material: "Ink on paper, 40 x 30 cm", aspectWidth: 3, aspectHeight: 4, sortOrder: 2 },
  { title: "Portrait Study IV", year: 2023, material: "Graphite on paper, 45 x 35 cm", aspectWidth: 3, aspectHeight: 4, sortOrder: 3 },
  { title: "Autumn Branch", year: 2022, material: "Pencil and watercolor on paper, 30 x 40 cm", aspectWidth: 3, aspectHeight: 4, sortOrder: 4 },
  { title: "Sleeping Cat", year: 2022, material: "Charcoal on paper, 35 x 50 cm", aspectWidth: 4, aspectHeight: 3, sortOrder: 5 },
  { title: "Reclining Figure II", year: 2024, material: "Charcoal on paper, 40 x 80 cm", aspectWidth: 5, aspectHeight: 2, sortOrder: 6 },
  { title: "The Old Oak", year: 2023, material: "Ink on paper, 30 x 70 cm", aspectWidth: 2, aspectHeight: 5, sortOrder: 7 },
  { title: "Hands with Cup", year: 2024, material: "Graphite on toned paper, 25 x 25 cm", aspectWidth: 1, aspectHeight: 1, sortOrder: 8 },
  { title: "City Horizon", year: 2023, material: "Pencil on paper, 30 x 90 cm", aspectWidth: 3, aspectHeight: 1, sortOrder: 9 },
]

// --- Seeding functions ---

async function seedBlogPosts() {
  console.log("Seeding blog posts...")

  for (const post of blogPosts) {
    console.log(`  Creating: "${post.title}"`)

    const page = await notion.pages.create({
      parent: { database_id: BLOG_DB_ID },
      properties: {
        Title: { title: [{ text: { content: post.title } }] },
        Slug: { rich_text: [{ text: { content: post.slug } }] },
        Date: { date: { start: post.date } },
        Excerpt: { rich_text: [{ text: { content: post.excerpt } }] },
        Published: { checkbox: true },
      },
    })

    // Add body content as paragraph blocks
    await notion.blocks.children.append({
      block_id: page.id,
      children: post.content.map((paragraph) => ({
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [{ type: "text" as const, text: { content: paragraph } }],
        },
      })),
    })
  }

  console.log(`  Done. Created ${blogPosts.length} blog posts.`)
}

async function seedArtwork(
  items: typeof paintings,
  category: "paintings" | "drawings"
) {
  console.log(`Seeding ${category}...`)

  for (const item of items) {
    console.log(`  Creating: "${item.title}"`)

    await notion.pages.create({
      parent: { database_id: ARTWORK_DB_ID },
      properties: {
        Title: { title: [{ text: { content: item.title } }] },
        Year: { number: item.year },
        Material: { rich_text: [{ text: { content: item.material } }] },
        Category: { select: { name: category } },
        "Aspect Width": { number: item.aspectWidth },
        "Aspect Height": { number: item.aspectHeight },
        "Sort Order": { number: item.sortOrder },
        Published: { checkbox: true },
      },
    })
  }

  console.log(`  Done. Created ${items.length} ${category}.`)
  console.log(
    `  NOTE: You must manually upload images to each entry in Notion.`
  )
}

async function main() {
  console.log("Starting Notion database seeding...\n")

  await seedBlogPosts()
  console.log()
  await seedArtwork(paintings, "paintings")
  console.log()
  await seedArtwork(drawings, "drawings")

  console.log("\nSeeding complete!")
  console.log(
    "Remember to upload artwork images to each entry in the Notion Artwork database."
  )
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
