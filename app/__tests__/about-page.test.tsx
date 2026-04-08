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

  it('renders the Instagram link', () => {
    render(<AboutPage />)
    expect(screen.getByText('Instagram')).toBeInTheDocument()
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
  })
})
