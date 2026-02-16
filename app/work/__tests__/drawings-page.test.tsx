import { render, screen } from '@testing-library/react'
import DrawingsPage, { metadata } from '@/app/work/drawings/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/work/drawings',
}))

describe('DrawingsPage', () => {
  it('renders heading "Drawings"', () => {
    render(<DrawingsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Drawings' })).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<DrawingsPage />)
    expect(screen.getByText(/Works on paper in charcoal, graphite, and ink/)).toBeInTheDocument()
  })

  it('renders artwork buttons from drawings data', () => {
    render(<DrawingsPage />)
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(9)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Drawings | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
