import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '@/components/navigation'

const mockPathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
  })

  describe('rendering', () => {
    it('renders the artist name link pointing to "/"', () => {
      render(<Navigation />)
      const link = screen.getByText('Elena Vasquez')
      expect(link).toHaveAttribute('href', '/')
    })

    it('renders About, Work, and Blog links', () => {
      render(<Navigation />)
      const aboutLinks = screen.getAllByText('About')
      expect(aboutLinks[0]).toHaveAttribute('href', '/about')
      // "Work" appears as a link and as a mobile label — the first is the desktop link
      const workLinks = screen.getAllByText('Work')
      expect(workLinks[0]).toHaveAttribute('href', '/work/paintings')
      const blogLinks = screen.getAllByText('Blog')
      expect(blogLinks[0]).toHaveAttribute('href', '/blog')
    })

    it('renders a mobile menu toggle button', () => {
      render(<Navigation />)
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
    })
  })

  describe('active route highlighting', () => {
    it('About link has foreground class when pathname is "/about"', () => {
      mockPathname.mockReturnValue('/about')
      render(<Navigation />)
      const aboutLinks = screen.getAllByText('About')
      // Desktop About link
      expect(aboutLinks[0].className).toContain('text-foreground')
    })

    it('About link has muted class when pathname is not "/about"', () => {
      mockPathname.mockReturnValue('/')
      render(<Navigation />)
      const aboutLinks = screen.getAllByText('About')
      expect(aboutLinks[0].className).toContain('text-muted-foreground')
    })

    it('Work link has foreground class when pathname starts with "/work"', () => {
      mockPathname.mockReturnValue('/work/paintings')
      render(<Navigation />)
      // First "Work" is the desktop nav link
      const workLinks = screen.getAllByText('Work')
      expect(workLinks[0].className).toContain('text-foreground')
    })

    it('Blog link has foreground class when pathname is "/blog"', () => {
      mockPathname.mockReturnValue('/blog')
      render(<Navigation />)
      const blogLinks = screen.getAllByText('Blog')
      expect(blogLinks[0].className).toContain('text-foreground')
    })
  })

  describe('dropdown links', () => {
    it('contains Paintings and Drawings links', () => {
      render(<Navigation />)
      const paintingsLinks = screen.getAllByText('Paintings')
      const drawingsLinks = screen.getAllByText('Drawings')
      // Desktop dropdown Paintings link
      expect(paintingsLinks[0]).toHaveAttribute('href', '/work/paintings')
      expect(drawingsLinks[0]).toHaveAttribute('href', '/work/drawings')
    })
  })

  describe('mobile menu', () => {
    it('clicking hamburger toggles mobile menu aria-label', () => {
      render(<Navigation />)
      const button = screen.getByLabelText('Open menu')
      fireEvent.click(button)
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
    })

    it('mobile menu contains About, Paintings, Drawings, Blog links', () => {
      render(<Navigation />)
      // Mobile links exist in the DOM (they're hidden via CSS)
      const aboutLinks = screen.getAllByText('About')
      const paintingsLinks = screen.getAllByText('Paintings')
      const drawingsLinks = screen.getAllByText('Drawings')
      const blogLinks = screen.getAllByText('Blog')
      // Desktop + mobile = at least 2 of each
      expect(aboutLinks.length).toBeGreaterThanOrEqual(2)
      expect(paintingsLinks.length).toBeGreaterThanOrEqual(2)
      expect(drawingsLinks.length).toBeGreaterThanOrEqual(2)
      expect(blogLinks.length).toBeGreaterThanOrEqual(2)
    })
  })
})
