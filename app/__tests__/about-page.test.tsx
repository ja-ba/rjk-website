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
    expect(screen.getByText('studio@elenavasquez.com')).toBeInTheDocument()
  })

  it('renders the portrait image', () => {
    render(<AboutPage />)
    expect(screen.getByAltText('Elena Vasquez in her studio')).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('About | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
