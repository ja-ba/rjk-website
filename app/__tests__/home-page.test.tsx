import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('HomePage', () => {
  it('renders the hero heading "Rebecca Kleinberg"', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Rebecca Kleinberg' })).toBeInTheDocument()
  })

  it('renders a "View Work" link', () => {
    render(<HomePage />)
    expect(screen.getByText('View Work')).toBeInTheDocument()
  })

  it('renders a "View Work" link pointing to "/work/paintings"', () => {
    render(<HomePage />)
    const link = screen.getByText('View Work')
    expect(link).toHaveAttribute('href', '/work/paintings')
  })

  it('renders a hero image with alt text', () => {
    render(<HomePage />)
    expect(screen.getByAltText('Featured artwork by Rebecca Kleinberg')).toBeInTheDocument()
  })
})
