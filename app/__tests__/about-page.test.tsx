import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from '@/app/about/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/about',
}))

describe('AboutPage', () => {
  it('renders the heading "About"', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
  })

  it('renders biography text mentioning "Seattle"', () => {
    render(<AboutPage />)
    expect(screen.getByText(/Seattle/)).toBeInTheDocument()
  })

  it('renders the Instagram link', () => {
    render(<AboutPage />)
    expect(screen.getByText('Instagram')).toBeInTheDocument()
  })

  it('renders the portrait image', () => {
    render(<AboutPage />)
    expect(screen.getByAltText('Rebecca Kleinberg plein air painting at Smith Rock')).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('About | Rebecca Kleinberg')
    expect(metadata.description).toBeTruthy()
  })
})
