import { render, screen } from '@testing-library/react'
import PleinAirPage, { metadata } from '@/app/work/plein-air/page'

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
