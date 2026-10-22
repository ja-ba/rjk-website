import { ReactNode } from 'react'

import RootLayout from '@/app/layout'
import { PublicAnalytics } from '@/components/public-analytics'
import { SiteFooter } from '@/components/site-footer'

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter' }),
  Playfair_Display: () => ({ variable: '--font-playfair' }),
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
  it('renders public analytics once for the application', () => {
    const layout = RootLayout({ children: <main>Content</main> })

    expect(countElementsOfType(layout, PublicAnalytics)).toBe(1)
  })

  it('renders the site footer once for the application', () => {
    const layout = RootLayout({ children: <main>Content</main> })

    expect(countElementsOfType(layout, SiteFooter)).toBe(1)
  })
})
