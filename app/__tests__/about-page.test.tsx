import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from '@/app/about/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}))

describe('AboutPage', () => {
  it('renders the heading "About"', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })

  it('renders biography text mentioning "Barcelona"', () => {
    render(<AboutPage />)
    const matches = screen.getAllByText(/Barcelona/)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders contact email', () => {
    render(<AboutPage />)
    expect(screen.getByText('studio@Rebeccavasquez.com')).toBeInTheDocument()
  })

  it('renders the portrait image', () => {
    render(<AboutPage />)
    expect(screen.getByAltText('Rebecca Kleinberg in her studio')).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('About | Rebecca Kleinberg')
    expect(metadata.description).toBeTruthy()
  })
})
