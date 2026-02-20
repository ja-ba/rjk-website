import { render, screen } from '@testing-library/react'
import PaintingsPage, { metadata } from '@/app/work/paintings/page'

vi.mock('@/lib/notion', () => ({
  getArtworksByCategory: vi.fn().mockResolvedValue([
    { id: 'p1', title: 'Painting One', year: 2024, material: 'Oil', src: '/images/paintings/p1.jpg', width: 4, height: 3, category: 'paintings' },
    { id: 'p2', title: 'Painting Two', year: 2023, material: 'Acrylic', src: '/images/paintings/p2.jpg', width: 4, height: 3, category: 'paintings' },
    { id: 'p3', title: 'Painting Three', year: 2022, material: 'Mixed', src: '/images/paintings/p3.jpg', width: 4, height: 3, category: 'paintings' },
  ]),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/work/paintings',
}))

describe('PaintingsPage', () => {
  it('renders heading "Paintings"', async () => {
    render(await PaintingsPage())
    expect(screen.getByRole('heading', { level: 1, name: 'Paintings' })).toBeInTheDocument()
  })

  it('renders the description text', async () => {
    render(await PaintingsPage())
    expect(screen.getByText(/Oil, acrylic, and mixed media works/)).toBeInTheDocument()
  })

  it('renders artwork buttons from paintings data', async () => {
    render(await PaintingsPage())
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(3)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBe('Paintings | Elena Vasquez')
    expect(metadata.description).toBeTruthy()
  })
})
