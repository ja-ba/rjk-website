import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('HomePage', () => {
  it('renders the hero heading "Elena Vasquez"', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Elena Vasquez' })).toBeInTheDocument()
  })

  it('renders the hero description text', () => {
    render(<HomePage />)
    expect(screen.getByText(/Contemporary painter exploring/)).toBeInTheDocument()
  })

  it('renders a "View Work" link pointing to "/work/paintings"', () => {
    render(<HomePage />)
    const link = screen.getByText('View Work')
    expect(link).toHaveAttribute('href', '/work/paintings')
  })

  it('renders a hero image with alt text', () => {
    render(<HomePage />)
    expect(screen.getByAltText('Featured artwork by Elena Vasquez')).toBeInTheDocument()
  })
})
