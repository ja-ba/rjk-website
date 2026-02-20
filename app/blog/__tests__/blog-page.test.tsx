import { render, screen } from '@testing-library/react'
import BlogPage, { metadata } from '@/app/blog/page'

vi.mock('@/lib/notion', () => ({
  getBlogPosts: vi.fn().mockResolvedValue([
    { slug: 'first-post', title: 'First Post', date: 'January 1, 2025', excerpt: 'First excerpt.' },
    { slug: 'second-post', title: 'Second Post', date: 'February 1, 2025', excerpt: 'Second excerpt.' },
  ]),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog',
}))

describe('BlogPage', () => {
  it('renders heading "Blog"', async () => {
    render(await BlogPage())
    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument()
  })

  it('renders all blog post titles', async () => {
    render(await BlogPage())
    expect(screen.getByText('First Post')).toBeInTheDocument()
    expect(screen.getByText('Second Post')).toBeInTheDocument()
  })

  it('renders dates for each post', async () => {
    render(await BlogPage())
    expect(screen.getByText('January 1, 2025')).toBeInTheDocument()
    expect(screen.getByText('February 1, 2025')).toBeInTheDocument()
  })

  it('renders "Read More" links for each post', async () => {
    render(await BlogPage())
    const readMoreLinks = screen.getAllByText('Read More')
    expect(readMoreLinks).toHaveLength(2)
  })

  it('each post title links to /blog/{slug}', async () => {
    render(await BlogPage())
    const titleLink = screen.getByText('First Post')
    expect(titleLink).toHaveAttribute('href', '/blog/first-post')
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Blog | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
