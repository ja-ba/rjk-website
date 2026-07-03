import { render, screen } from '@testing-library/react'
import PleinAirPage, { metadata } from '@/app/work/plein-air/page'
import { getArtworksByCategory } from '@/lib/notion'

vi.mock('@/lib/notion', () => ({
  getArtworksByCategory: vi.fn().mockResolvedValue([
    { id: 'pa1', title: 'Plein Air One', year: 2024, material: 'Oil', src: '/images/plein_air/pa1.jpg', width: 4, height: 3, category: 'plein_air' },
    { id: 'pa2', title: 'Plein Air Two', year: 2023, material: 'Oil', src: '/images/plein_air/pa2.jpg', width: 4, height: 3, category: 'plein_air' },
    { id: 'pa3', title: 'Plein Air Three', year: 2022, material: 'Oil', src: '/images/plein_air/pa3.jpg', width: 4, height: 3, category: 'plein_air' },
  ]),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/work/plein-air',
}))

describe('PleinAirPage', () => {
  it('renders heading "Plein Air"', async () => {
    render(await PleinAirPage())
    expect(screen.getByRole('heading', { level: 1, name: 'Plein Air' })).toBeInTheDocument()
  })

  it('renders artwork buttons from plein air data', async () => {
    render(await PleinAirPage())
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons.length).toBe(3)
  })

  it('exports correct metadata', () => {
    expect(metadata.title).toBeTruthy()
    expect(metadata.description).toBeTruthy()
  })
})

describe('PleinAirPage with missing dimensions', () => {
  it('filters out artworks with 0 dimensions and shows warning banner', async () => {
    vi.mocked(getArtworksByCategory).mockResolvedValueOnce([
      { id: 'pa1', title: 'Broken Plein Air', year: 2024, material: 'Oil', src: '/images/plein_air/pa1.jpg', width: 0, height: 0, category: 'plein_air' },
      { id: 'pa2', title: 'Good Plein Air', year: 2023, material: 'Oil', src: '/images/plein_air/pa2.jpg', width: 4, height: 3, category: 'plein_air' },
    ])

    render(await PleinAirPage())

    expect(screen.getByText(/Incomplete artwork entries/)).toBeInTheDocument()
    expect(screen.getByText(/Broken Plein Air/)).toBeInTheDocument()

    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons).toHaveLength(1)
    expect(screen.getByLabelText('View Good Plein Air')).toBeInTheDocument()
    expect(screen.queryByLabelText('View Broken Plein Air')).not.toBeInTheDocument()
  })
})
