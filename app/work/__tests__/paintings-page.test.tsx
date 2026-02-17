import { render, screen } from '@testing-library/react'
import PaintingsPage, { metadata } from '@/app/work/paintings/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/work/paintings',
}))

describe('PaintingsPage', () => {
  it('renders heading "Paintings"', () => {
    render(<PaintingsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Paintings' })).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<PaintingsPage />)
    expect(screen.getByText(/Oil, acrylic, and mixed media works/)).toBeInTheDocument()
  })

  it('renders artwork buttons from paintings data', () => {
    render(<PaintingsPage />)
    // The gallery should render buttons for each painting
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(10)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Paintings | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
