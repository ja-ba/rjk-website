import { render, screen } from '@testing-library/react'
import PaintingsPage, { metadata } from '@/app/work/paintings/page'
import { getArtworksByCategory } from '@/lib/notion'

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

  it('renders artwork buttons from paintings data', async () => {
    render(await PaintingsPage())
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(3)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
  })
})

describe('PaintingsPage with missing dimensions', () => {
  it('filters out artworks with 0 dimensions and shows warning banner', async () => {
    vi.mocked(getArtworksByCategory).mockResolvedValueOnce([
      { id: 'p1', title: 'Broken Art', year: 2024, material: 'Oil', src: '/images/paintings/p1.jpg', width: 0, height: 0, category: 'paintings' },
      { id: 'p2', title: 'Good Art', year: 2023, material: 'Acrylic', src: '/images/paintings/p2.jpg', width: 4, height: 3, category: 'paintings' },
    ])

    render(await PaintingsPage())

    // Banner shows the broken artwork
    expect(screen.getByText(/Missing artwork dimensions/)).toBeInTheDocument()
    expect(screen.getByText(/Broken Art/)).toBeInTheDocument()

    // Only the valid artwork renders in the gallery
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons).toHaveLength(1)
    expect(screen.getByLabelText('View Good Art')).toBeInTheDocument()
    expect(screen.queryByLabelText('View Broken Art')).not.toBeInTheDocument()
  })
})
