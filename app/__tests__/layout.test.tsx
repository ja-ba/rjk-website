import { ReactNode } from 'react'

import RootLayout from '@/app/layout'

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  Playfair_Display: () => ({ variable: '--font-playfair' }),
}))

vi.mock('@vercel/analytics/next', () => ({
  Analytics: () => null,
}))

function countElementsOfType(node: ReactNode, type: unknown): number {
  if (Array.isArray(node)) {
    return node.reduce((count, child) => count + countElementsOfType(child, type), 0)
  }

  if (!node || typeof node !== 'object' || !('type' in node) || !('props' in node)) {
    return 0
  }

  const element = node as { type: unknown; props: { children?: ReactNode } }
  return Number(element.type === type) + countElementsOfType(element.props.children, type)
}

describe('RootLayout', () => {
  it('renders Vercel Analytics once for the application', async () => {
    const { Analytics } = await import('@vercel/analytics/next')
    const layout = RootLayout({ children: <main>Content</main> })

    expect(countElementsOfType(layout, Analytics)).toBe(1)
  })
})
