import '@testing-library/jest-dom/vitest'

// Mock next/image globally -- replaces with a plain <img> tag
vi.mock('next/image', () => ({
  default: ({ fill, priority, ...rest }: Record<string, unknown>) => {
    const imgProps: Record<string, unknown> = { ...rest }
    if (fill) imgProps['data-fill'] = 'true'
    if (priority) imgProps['data-priority'] = 'true'
    return <img {...imgProps} />
  },
}))

// Mock next/font/google -- fonts are not needed in tests
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter', className: 'mock-inter' }),
  Playfair_Display: () => ({ variable: '--font-playfair', className: 'mock-playfair' }),
}))

// Mock next/link globally -- renders a plain <a> tag
vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}))

// Provide a ResizeObserver stub
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    private callback: ResizeObserverCallback
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }
    observe(target: Element) {
      this.callback(
        [
          {
            target,
            contentRect: { width: 1200, height: 800 } as DOMRectReadOnly,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          } as unknown as ResizeObserverEntry,
        ],
        this
      )
    }
    unobserve() {}
    disconnect() {}
  }
}

// Provide matchMedia stub
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
