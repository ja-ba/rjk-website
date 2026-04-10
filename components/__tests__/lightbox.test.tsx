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

    it('keeps the image slot layout stable when switching between different aspect ratios', () => {
      const wide = {
        ...createMockArtwork({ title: 'Wide', width: 1600, height: 900 }),
        id: 'wide',
      }
      const tall = {
        ...createMockArtwork({ title: 'Tall', width: 900, height: 1600 }),
        id: 'tall',
      }
      const props = {
        artworks: [wide, tall],
        onClose: vi.fn(),
        onNavigate: vi.fn(),
      }
      const { rerender } = render(<Lightbox {...props} currentIndex={0} />)
      const slot = screen.getByTestId('lightbox-image-slot')
      const classesAtWide = slot.className
      expect(slot).not.toHaveAttribute('style')
      rerender(<Lightbox {...props} currentIndex={1} />)
      expect(screen.getByTestId('lightbox-image-slot').className).toBe(classesAtWide)
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

  describe('touch/swipe navigation', () => {
    function swipe(element: HTMLElement, startX: number, endX: number, startY = 0, endY = 0) {
      fireEvent.touchStart(element, { touches: [{ clientX: startX, clientY: startY }] })
      fireEvent.touchEnd(element, { changedTouches: [{ clientX: endX, clientY: endY }] })
    }

    it('swipe left calls onNavigate with next index', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 200, 50)
      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('swipe right calls onNavigate with previous index', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 50, 200)
      expect(onNavigate).toHaveBeenCalledWith(0)
    })

    it('small horizontal swipe (<50px) does not navigate', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 200, 160)
      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('predominantly vertical movement does not navigate', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 200, 50, 0, 200)
      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('prevents default on a valid swipe to suppress synthetic click (touch-enabled desktops)', () => {
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      const dialog = screen.getByRole('dialog')
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [{ clientX: 50, clientY: 0 } as Touch],
      })
      fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 0 }] })
      dialog.dispatchEvent(touchEndEvent)
      expect(touchEndEvent.defaultPrevented).toBe(true)
    })

    it('swipe left at last index does not navigate', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={2} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 200, 50)
      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('swipe right at first index does not navigate', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={0} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      swipe(screen.getByRole('dialog'), 50, 200)
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
