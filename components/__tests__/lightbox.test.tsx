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

let visualViewportScale = 1
let visualViewportMock: EventTarget & { scale: number }

beforeEach(() => {
  visualViewportScale = 1
  visualViewportMock = new EventTarget() as EventTarget & { scale: number }
  Object.defineProperty(visualViewportMock, 'scale', {
    configurable: true,
    get: () => visualViewportScale,
  })
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: visualViewportMock,
  })
})

function setVisualViewportScale(scale: number) {
  visualViewportScale = scale
  visualViewportMock.dispatchEvent(new Event('resize'))
}

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

    it('displays the dimension when set', () => {
      const artwork = { ...createMockArtwork({ title: 'Sized', dimension: '120 x 80 cm' }), id: 'sized' }
      render(
        <Lightbox artworks={[artwork]} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      expect(screen.getByText('120 x 80 cm')).toBeInTheDocument()
    })

    it('does not render a dimension line when dimension is empty', () => {
      const artwork = { ...createMockArtwork({ title: 'NoDim', material: 'Charcoal', dimension: '' }), id: 'nodim' }
      render(
        <Lightbox artworks={[artwork]} currentIndex={0} onClose={vi.fn()} onNavigate={vi.fn()} />
      )
      const material = screen.getByText('Charcoal')
      const overlay = material.parentElement!
      expect(overlay.querySelectorAll('p')).toHaveLength(2)
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

    it('does not navigate on a swipe that starts while zoomed', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      setVisualViewportScale(2)

      swipe(screen.getByRole('dialog'), 200, 50)

      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('does not navigate when an image-area control is clicked while zoomed', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      setVisualViewportScale(2)

      fireEvent.click(screen.getByLabelText('Next artwork'))

      expect(onNavigate).not.toHaveBeenCalled()
    })

    it('keeps close and keyboard navigation available while zoomed', () => {
      const onClose = vi.fn()
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={onClose} onNavigate={onNavigate} />
      )
      setVisualViewportScale(2)

      fireEvent.click(screen.getByLabelText('Close lightbox'))
      fireEvent.keyDown(window, { key: 'ArrowRight' })

      expect(onClose).toHaveBeenCalledTimes(1)
      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('blocks the end of a zoom gesture after zoom returns to normal and resumes on a fresh swipe', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 0 }] })
      setVisualViewportScale(1.5)
      setVisualViewportScale(1)
      fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 50, clientY: 0 }], touches: [] })
      fireEvent.click(screen.getByLabelText('Next artwork'))
      expect(onNavigate).not.toHaveBeenCalled()

      swipe(dialog, 200, 50)

      expect(onNavigate).toHaveBeenCalledTimes(1)
      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('blocks image-area clicks while a zoomed gesture is still active', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 0 }] })
      setVisualViewportScale(1.5)
      setVisualViewportScale(1)
      fireEvent.click(screen.getByLabelText('Next artwork'))

      expect(onNavigate).not.toHaveBeenCalled()

      fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 50, clientY: 0 }], touches: [] })
    })

    it('allows a fresh image-area tap after a zoom gesture ends', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')

      setVisualViewportScale(2)
      fireEvent.touchStart(dialog, { touches: [{ clientX: 100, clientY: 0 }] })
      fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 100, clientY: 0 }], touches: [] })
      setVisualViewportScale(1)
      fireEvent.touchStart(dialog, { touches: [{ clientX: 100, clientY: 0 }] })
      fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 100, clientY: 0 }], touches: [] })
      fireEvent.click(screen.getByLabelText('Next artwork'))

      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('suppresses navigation after a zoomed gesture is cancelled and accepts a fresh swipe', () => {
      const onNavigate = vi.fn()
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')

      setVisualViewportScale(2)
      fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 0 }] })
      setVisualViewportScale(1)
      fireEvent.touchCancel(dialog, { touches: [] })
      fireEvent.click(screen.getByLabelText('Next artwork'))
      expect(onNavigate).not.toHaveBeenCalled()

      swipe(dialog, 200, 50)

      expect(onNavigate).toHaveBeenCalledWith(2)
    })

    it('expires click suppression after 350ms even if the lightbox rerenders', () => {
      vi.useFakeTimers()
      try {
        const onNavigate = vi.fn()
        const props = { artworks: mockArtworks, onClose: vi.fn(), onNavigate }
        const { rerender } = render(<Lightbox {...props} currentIndex={1} />)
        const dialog = screen.getByRole('dialog')

        fireEvent.touchStart(dialog, {
          touches: [
            { clientX: 200, clientY: 0 },
            { clientX: 220, clientY: 0 },
          ],
        })
        fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 50, clientY: 0 }], touches: [] })
        rerender(<Lightbox {...props} currentIndex={0} />)
        vi.advanceTimersByTime(351)

        fireEvent.click(screen.getByLabelText('Next artwork'))

        expect(onNavigate).toHaveBeenCalledWith(1)
      } finally {
        vi.useRealTimers()
      }
    })

    it('blocks multi-finger gestures without visual viewport and resumes ordinary swipes', () => {
      const onNavigate = vi.fn()
      Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined })
      render(
        <Lightbox artworks={mockArtworks} currentIndex={1} onClose={vi.fn()} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')

      fireEvent.touchStart(dialog, { touches: [{ clientX: 200, clientY: 0 }] })
      fireEvent.touchStart(dialog, {
        touches: [
          { clientX: 200, clientY: 0 },
          { clientX: 220, clientY: 0 },
        ],
      })
      fireEvent.touchEnd(dialog, {
        changedTouches: [{ clientX: 150, clientY: 0 }],
        touches: [{ clientX: 220, clientY: 0 }],
      })
      fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 50, clientY: 0 }], touches: [] })
      expect(onNavigate).not.toHaveBeenCalled()

      swipe(dialog, 200, 50)

      expect(onNavigate).toHaveBeenCalledTimes(1)
      expect(onNavigate).toHaveBeenCalledWith(2)
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
