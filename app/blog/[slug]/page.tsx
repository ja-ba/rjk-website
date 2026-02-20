import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ArrowLeft } from "lucide-react"
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/notion"
import { renderNotionBlocks } from "@/lib/notion-renderer"

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

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
            {renderNotionBlocks(post.blocks)}
          </div>
        </article>
      </main>
    </>
  )
}
