import { render, screen } from '@testing-library/react'
import DrawingsPage, { metadata } from '@/app/work/drawings/page'
import { getArtworksByCategory } from '@/lib/notion'

vi.mock('@/lib/notion', () => ({
  getArtworksByCategory: vi.fn().mockResolvedValue([
    { id: 'd1', title: 'Drawing One', year: 2024, material: 'Charcoal', src: '/images/drawings/d1.jpg', width: 3, height: 4, category: 'drawings' },
    { id: 'd2', title: 'Drawing Two', year: 2023, material: 'Graphite', src: '/images/drawings/d2.jpg', width: 3, height: 4, category: 'drawings' },
    { id: 'd3', title: 'Drawing Three', year: 2022, material: 'Ink', src: '/images/drawings/d3.jpg', width: 3, height: 4, category: 'drawings' },
  ]),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/work/drawings',
}))

describe('DrawingsPage', () => {
  it('renders heading "Drawings"', async () => {
    render(await DrawingsPage())
    expect(screen.getByRole('heading', { level: 1, name: 'Drawings' })).toBeInTheDocument()
  })

  it('renders artwork buttons from drawings data', async () => {
    render(await DrawingsPage())
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(3)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
  })
})

describe('DrawingsPage with missing dimensions', () => {
  it('filters out artworks with 0 dimensions and shows warning banner', async () => {
    vi.mocked(getArtworksByCategory).mockResolvedValueOnce([
      { id: 'd1', title: 'Broken Drawing', year: 2024, material: 'Charcoal', src: '/images/drawings/d1.jpg', width: 0, height: 0, category: 'drawings' },
      { id: 'd2', title: 'Good Drawing', year: 2023, material: 'Graphite', src: '/images/drawings/d2.jpg', width: 3, height: 4, category: 'drawings' },
    ])

    render(await DrawingsPage())

    expect(screen.getByText(/Incomplete artwork entries/)).toBeInTheDocument()
    expect(screen.getByText(/Broken Drawing/)).toBeInTheDocument()

    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons).toHaveLength(1)
    expect(screen.getByLabelText('View Good Drawing')).toBeInTheDocument()
    expect(screen.queryByLabelText('View Broken Drawing')).not.toBeInTheDocument()
  })
})
