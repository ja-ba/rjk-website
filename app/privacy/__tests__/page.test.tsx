import { render, screen } from '@testing-library/react'

import PrivacyPage, { metadata } from '@/app/privacy/page'

vi.mock('next/navigation', () => ({
  usePathname: () => '/privacy',
}))

describe('PrivacyPage', () => {
  it('publishes the privacy contact address', () => {
    render(<PrivacyPage />)

    expect(
      screen.getByRole('link', { name: 'privacy@rebecca-kleinberg.com' }),
    ).toHaveAttribute('href', 'mailto:privacy@rebecca-kleinberg.com')
  })

  it('explains the limited Vercel Analytics implementation', () => {
    render(<PrivacyPage />)

    expect(screen.getByText(/does not use analytics cookies/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /vercel's privacy notice/i }),
    ).toHaveAttribute('href', 'https://vercel.com/legal/privacy-notice')
  })

  it('explains the mobile menu session-storage marker', () => {
    render(<PrivacyPage />)

    expect(screen.getByText(/sessionstorage/i)).toBeInTheDocument()
  })

  it('exports privacy-page metadata', () => {
    expect(metadata.title).toBe('Privacy | Rebecca Kleinberg')
    expect(metadata.description).toBe('Privacy information for Rebecca Kleinberg’s portfolio website.')
  })
})
