import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { computeRows, GAP, GalleryGrid } from '@/components/gallery-grid'
import { createMockArtwork, createMockArtworks, resetMockId } from '@/__tests__/helpers/mock-artwork'

beforeEach(() => {
  resetMockId()
})

describe('computeRows', () => {
  it('returns empty array for empty artworks', () => {
    const rows = computeRows([], 1200, 260)
    expect(rows).toEqual([])
  })

  it('packs a single artwork into one row', () => {
    const artworks = [createMockArtwork({ width: 4, height: 3 })]
    const rows = computeRows(artworks, 1200, 260)
    expect(rows).toHaveLength(1)
    expect(rows[0].items).toHaveLength(1)
  })

  it('distributes items across multiple rows', () => {
    const artworks = createMockArtworks(6, { width: 4, height: 3 })
    const rows = computeRows(artworks, 800, 200)
    expect(rows.length).toBeGreaterThan(1)
  })

  it('every artwork from input appears exactly once in output', () => {
    const artworks = createMockArtworks(10)
    const rows = computeRows(artworks, 1200, 260)
    const allItems = rows.flatMap((row) => row.items)
    expect(allItems).toHaveLength(10)

    const indices = allItems.map((item) => item.index)
    expect([...indices].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 10 }, (_, i) => i)
    )
  })

  it('all items in a row have the same height', () => {
    const artworks = createMockArtworks(8)
    const rows = computeRows(artworks, 1200, 260)
    rows.forEach((row) => {
      const height = row.height
      row.items.forEach((item) => {
        expect(item.height).toBeCloseTo(height, 5)
      })
    })
  })

  it('full rows approximately fill the container width', () => {
    const artworks = createMockArtworks(10)
    const containerWidth = 1200
    const rows = computeRows(artworks, containerWidth, 260)

    // All rows except the last should fill the container width
    rows.slice(0, -1).forEach((row) => {
      const totalGaps = (row.items.length - 1) * GAP
      const totalItemWidth = row.items.reduce((sum, item) => sum + item.width, 0)
      expect(totalItemWidth + totalGaps).toBeCloseTo(containerWidth, 0)
    })
  })

  it('handles square artworks', () => {
    const artworks = createMockArtworks(3, { width: 1, height: 1 })
    const rows = computeRows(artworks, 1200, 260)
    expect(rows.length).toBeGreaterThan(0)
  })

  it('handles very wide panoramic artworks', () => {
    const artworks = [createMockArtwork({ width: 10, height: 1 })]
    const rows = computeRows(artworks, 1200, 260)
    expect(rows).toHaveLength(1)
  })

  it('handles very tall portrait artworks', () => {
    const artworks = [createMockArtwork({ width: 1, height: 10 })]
    const rows = computeRows(artworks, 1200, 260)
    expect(rows).toHaveLength(1)
  })

  it('caps last row height at targetRowHeight', () => {
    // Single artwork that would stretch taller than target
    const artworks = [createMockArtwork({ width: 1, height: 10 })]
    const targetRowHeight = 260
    const rows = computeRows(artworks, 1200, targetRowHeight)
    expect(rows[0].height).toBeLessThanOrEqual(targetRowHeight)
  })

  it('GAP constant is 8', () => {
    expect(GAP).toBe(8)
  })
})

describe('GalleryGrid component', () => {
  // Mock next/navigation for the Navigation component used inside pages
  vi.mock('next/navigation', () => ({
    usePathname: () => '/',
    useRouter: () => ({ push: vi.fn() }),
  }))

  it('renders correct number of artwork buttons', () => {
    const artworks = createMockArtworks(3)
    render(<GalleryGrid artworks={artworks} />)
    const buttons = screen.getAllByRole('button', { name: /^View / })
    expect(buttons).toHaveLength(3)
  })

  it('each button has aria-label "View {title}"', () => {
    const artworks = [
      createMockArtwork({ title: 'Test Painting' }),
    ]
    render(<GalleryGrid artworks={artworks} />)
    expect(screen.getByLabelText('View Test Painting')).toBeInTheDocument()
  })

  it('clicking an artwork button opens the Lightbox', async () => {
    const user = userEvent.setup()
    const artworks = [createMockArtwork({ title: 'Clickable Art' })]
    render(<GalleryGrid artworks={artworks} />)

    await user.click(screen.getByLabelText('View Clickable Art'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render lightbox initially', () => {
    const artworks = createMockArtworks(2)
    render(<GalleryGrid artworks={artworks} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
