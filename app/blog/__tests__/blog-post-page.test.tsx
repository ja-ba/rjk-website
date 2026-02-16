import { render, screen } from '@testing-library/react'
import BlogPostPage, { generateStaticParams } from '@/app/blog/[slug]/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/studio-reflections-winter',
}))

describe('BlogPostPage', () => {
  describe('valid slug', () => {
    it('renders the post title', async () => {
      const params = Promise.resolve({ slug: 'studio-reflections-winter' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      expect(screen.getByText('Studio Reflections: Winter Light')).toBeInTheDocument()
    })

    it('renders the post date', async () => {
      const params = Promise.resolve({ slug: 'studio-reflections-winter' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
    })

    it('renders content paragraphs', async () => {
      const params = Promise.resolve({ slug: 'studio-reflections-winter' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      expect(screen.getByText(/winter months bring a particular quality/)).toBeInTheDocument()
    })

    it('renders a "Back to Blog" link', async () => {
      const params = Promise.resolve({ slug: 'studio-reflections-winter' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      const backLink = screen.getByText('Back to Blog')
      expect(backLink).toHaveAttribute('href', '/blog')
    })
  })

  describe('invalid slug', () => {
    it('renders "Post not found." for an unknown slug', async () => {
      const params = Promise.resolve({ slug: 'nonexistent-post' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      expect(screen.getByText('Post not found.')).toBeInTheDocument()
    })

    it('renders a link back to /blog', async () => {
      const params = Promise.resolve({ slug: 'nonexistent-post' })
      const jsx = await BlogPostPage({ params })
      render(jsx)
      const backLink = screen.getByText('Back to Blog')
      expect(backLink).toHaveAttribute('href', '/blog')
    })
  })

  describe('generateStaticParams', () => {
    it('returns all 5 slugs', async () => {
      const params = await generateStaticParams()
      expect(params).toHaveLength(5)
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
