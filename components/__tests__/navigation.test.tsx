import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Navigation } from '@/components/navigation'

const mockPathname = vi.fn(() => '/')

function mockMobileViewport(matches: boolean) {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches: query === '(max-width: 767px)' && matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
    window.sessionStorage.clear()
    mockMobileViewport(false)
  })

  describe('rendering', () => {
    it('renders a home link pointing to "/about"', () => {
      render(<Navigation />)
      const links = screen.getAllByRole('link')
      const homeLink = links.find((l) => l.getAttribute('href') === '/about')
      expect(homeLink).toBeDefined()
    })

    it('renders About, Work, and Blog links', () => {
      render(<Navigation />)
      const aboutLinks = screen.getAllByText('About')
      expect(aboutLinks[0]).toHaveAttribute('href', '/about')
      // "Work" appears as a link and as a mobile label — the first is the desktop link
      const workLinks = screen.getAllByText('Work')
      expect(workLinks[0]).toHaveAttribute('href', '/work/plein-air')
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
    it('contains Plein Air, Paintings and Drawings links', () => {
      render(<Navigation />)
      const pleinAirLinks = screen.getAllByText('Plein Air')
      const paintingsLinks = screen.getAllByText('Paintings')
      const drawingsLinks = screen.getAllByText('Drawings')
      // Desktop dropdown links
      expect(pleinAirLinks[0]).toHaveAttribute('href', '/work/plein-air')
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

    it('mobile menu contains About, Plein Air, Paintings, Drawings, Blog links', () => {
      render(<Navigation />)
      // Mobile links exist in the DOM (they're hidden via CSS)
      const aboutLinks = screen.getAllByText('About')
      const pleinAirLinks = screen.getAllByText('Plein Air')
      const paintingsLinks = screen.getAllByText('Paintings')
      const drawingsLinks = screen.getAllByText('Drawings')
      const blogLinks = screen.getAllByText('Blog')
      // Desktop + mobile = at least 2 of each
      expect(aboutLinks.length).toBeGreaterThanOrEqual(2)
      expect(pleinAirLinks.length).toBeGreaterThanOrEqual(2)
      expect(paintingsLinks.length).toBeGreaterThanOrEqual(2)
      expect(drawingsLinks.length).toBeGreaterThanOrEqual(2)
      expect(blogLinks.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('session-based mobile introduction', () => {
    it('automatically opens once on the About page in a mobile viewport', async () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(true)

      render(<Navigation />)

      await waitFor(() => {
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
      })
      expect(
        window.sessionStorage.getItem('rjk-mobile-menu-intro-seen-v1')
      ).toBe('true')
    })

    it('exposes the automatic open state to assistive technology', async () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(true)

      render(<Navigation />)

      const toggle = await screen.findByLabelText('Close menu')
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAttribute('aria-controls', 'mobile-navigation-menu')
      expect(document.getElementById('mobile-navigation-menu')).toBeInTheDocument()
    })

    it('does not automatically reopen after it has been seen in the same session', () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(true)
      window.sessionStorage.setItem('rjk-mobile-menu-intro-seen-v1', 'true')

      render(<Navigation />)

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
    })

    it('opens again after the session marker is cleared', async () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(true)
      window.sessionStorage.setItem('rjk-mobile-menu-intro-seen-v1', 'true')
      window.sessionStorage.clear()

      render(<Navigation />)

      await waitFor(() => {
        expect(screen.getByLabelText('Close menu')).toBeInTheDocument()
      })
    })

    it('does not consume the introduction on desktop', () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(false)

      render(<Navigation />)

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
      expect(
        window.sessionStorage.getItem('rjk-mobile-menu-intro-seen-v1')
      ).toBeNull()
    })

    it('does not consume the introduction on another route', () => {
      mockPathname.mockReturnValue('/work/plein-air')
      mockMobileViewport(true)

      render(<Navigation />)

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
      expect(
        window.sessionStorage.getItem('rjk-mobile-menu-intro-seen-v1')
      ).toBeNull()
    })

    it('keeps the menu closed when session storage is unavailable', () => {
      mockPathname.mockReturnValue('/about')
      mockMobileViewport(true)
      const getItem = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('storage unavailable')
        })

      render(<Navigation />)

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
      getItem.mockRestore()
    })
  })
})
