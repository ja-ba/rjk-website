import { render, screen } from '@testing-library/react'
import BlogPostPage, { generateStaticParams } from '@/app/blog/[slug]/page'
import type { BlogPostFull } from '@/lib/types'

const mockPost: BlogPostFull = {
  slug: 'test-post',
  title: 'Test Post Title',
  date: 'January 15, 2025',
  category: 'Studio',
  blocks: [
    {
      id: 'block-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          { plain_text: 'Test content paragraph.', href: null, annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } },
        ],
      },
    },
  ],
}

vi.mock('@/lib/notion', () => ({
  getBlogPostBySlug: vi.fn().mockImplementation((slug: string) =>
    slug === 'test-post' ? Promise.resolve(mockPost) : Promise.resolve(null)
  ),
  getAllBlogSlugs: vi.fn().mockResolvedValue(['test-post', 'another-post']),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/test-post',
}))

describe('BlogPostPage', () => {
  describe('valid slug', () => {
    it('renders the post title', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
      render(jsx)
      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    })

    it('renders the post date', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
      render(jsx)
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
    })

    it('renders content paragraphs', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
      render(jsx)
      expect(screen.getByText('Test content paragraph.')).toBeInTheDocument()
    })

    it('renders a "Back to Blog" link', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'test-post' }) })
      render(jsx)
      const backLink = screen.getByText('Back to Blog')
      expect(backLink).toHaveAttribute('href', '/blog')
    })
  })

  describe('invalid slug', () => {
    it('renders "Post not found." for an unknown slug', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'nonexistent-post' }) })
      render(jsx)
      expect(screen.getByText('Post not found.')).toBeInTheDocument()
    })

    it('renders a link back to /blog', async () => {
      const jsx = await BlogPostPage({ params: Promise.resolve({ slug: 'nonexistent-post' }) })
      render(jsx)
      const backLink = screen.getByText('Back to Blog')
      expect(backLink).toHaveAttribute('href', '/blog')
    })
  })

  describe('generateStaticParams', () => {
    it('returns slugs from Notion', async () => {
      const params = await generateStaticParams()
      expect(params).toHaveLength(2)
    })

    it('each result has a slug property', async () => {
      const params = await generateStaticParams()
      params.forEach((param) => {
        expect(param).toHaveProperty('slug')
        expect(typeof param.slug).toBe('string')
        expect(param.slug.length).toBeGreaterThan(0)
      })
    })
  })
})
