import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { getBlogPosts } from "@/lib/notion"

export const metadata = {
  title: "Blog | Elena Vasquez",
  description: "Writings and updates from the studio of Elena Vasquez.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

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
