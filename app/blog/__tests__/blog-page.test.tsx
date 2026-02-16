import { render, screen } from '@testing-library/react'
import BlogPage, { metadata } from '@/app/blog/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog',
}))

describe('BlogPage', () => {
  it('renders heading "Blog"', () => {
    render(<BlogPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Blog' })).toBeInTheDocument()
  })

  it('renders all 5 blog post titles', () => {
    render(<BlogPage />)
    expect(screen.getByText('Studio Reflections: Winter Light')).toBeInTheDocument()
    expect(screen.getByText('New Series: Tidal Memory')).toBeInTheDocument()
    expect(screen.getByText('Exhibition at Galeria Nova, Barcelona')).toBeInTheDocument()
    expect(screen.getByText('On Drawing as Thinking')).toBeInTheDocument()
    expect(screen.getByText('Paris Residency: Looking Back')).toBeInTheDocument()
  })

  it('renders dates for each post', () => {
    render(<BlogPage />)
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('November 3, 2024')).toBeInTheDocument()
    expect(screen.getByText('September 12, 2024')).toBeInTheDocument()
    expect(screen.getByText('June 28, 2024')).toBeInTheDocument()
    expect(screen.getByText('March 5, 2024')).toBeInTheDocument()
  })

  it('renders "Read More" links for each post', () => {
    render(<BlogPage />)
    const readMoreLinks = screen.getAllByText('Read More')
    expect(readMoreLinks).toHaveLength(5)
  })

  it('each post title links to /blog/{slug}', () => {
    render(<BlogPage />)
    const titleLink = screen.getByText('Studio Reflections: Winter Light')
    expect(titleLink).toHaveAttribute('href', '/blog/studio-reflections-winter')
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Blog | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
