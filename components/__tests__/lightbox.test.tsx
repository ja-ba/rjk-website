import { render, screen, fireEvent } from '@testing-library/react'
import { Lightbox } from '@/components/lightbox'
import { createMockArtwork, resetMockId } from '@/__tests__/helpers/mock-artwork'

const mockArtworks = [
  { ...createMockArtwork({ title: 'First', year: 2022, material: 'Oil on canvas, 100 x 80 cm' }), id: 'a1' },
  { ...createMockArtwork({ title: 'Second', year: 2023, material: 'Acrylic on panel' }), id: 'a2' },
  { ...createMockArtwork({ title: 'Third', year: 2024, material: 'Mixed media' }), id: 'a3' },
]

beforeEach(() => {
  resetMockId()
  document.body.style.overflow = ''
})

describe('Lightbox', () => {
  describe('rendering', () => {
    it('renders with role="dialog" and aria-modal="true"', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('displays the current artwork title', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('displays the current artwork year and material', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByText('2023')).toBeInTheDocument()
      expect(screen.getByText('Acrylic on panel')).toBeInTheDocument()
    })

    it('shows navigation counter', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })

    it('renders an img with correct src and alt', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      const img = screen.getByAltText('First')
      expect(img).toHaveAttribute('src', mockArtworks[0].src)
    })
  })

  describe('navigation callbacks', () => {
    it('calls onNavigate with next index when clicking "Next artwork"', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.click(screen.getByLabelText('Next artwork'))
      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('calls onNavigate with previous index when clicking "Previous artwork"', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.click(screen.getByLabelText('Previous artwork'))
      expect(onNavigate).toHaveBeenCalledWith(0)
    })

    it('disables previous button when currentIndex is 0', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByLabelText('Previous artwork')).toHaveAttribute('aria-disabled', 'true')
    })

    it('disables next button when currentIndex is last', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={2} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByLabelText('Next artwork')).toHaveAttribute('aria-disabled', 'true')
    })

    it('calls onClose when clicking the close button', () => {
      const onClose = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={onClose} onNavigate={vi.fn()} />
      )
      fireEvent.click(screen.getByLabelText('Close lightbox'))
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('calls onClose when Escape key is pressed', () => {
      const onClose = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={onClose} onNavigate={vi.fn()} />
      )
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(onClose).toHaveBeenCalled()
    })

    it('calls onNavigate with next index on ArrowRight', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowRight' })
      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('calls onNavigate with previous index on ArrowLeft', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
      expect(onNavigate).toHaveBeenCalledWith(0)
    })

    it('does not navigate past first item on ArrowLeft', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('does not navigate past last item on ArrowRight', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={2} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowRight' })
      expect(onNavigate).not.toHaveBeenCalled()
    })
  })

  describe('body scroll prevention', () => {
    it('sets document.body.style.overflow to "hidden" on mount', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores document.body.style.overflow on unmount', () => {
      const { unmount } = render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })
})
