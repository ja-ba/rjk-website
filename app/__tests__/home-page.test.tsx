import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('HomePage', () => {
  it('renders an h1 heading', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders a "View Work" link pointing to "/work/paintings"', () => {
    render(<HomePage />)
    const link = screen.getByText('View Work')
    expect(link).toHaveAttribute('href', '/work/paintings')
  })

})
