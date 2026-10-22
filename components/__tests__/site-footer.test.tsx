import { render, screen } from '@testing-library/react'

import { SiteFooter } from '@/components/site-footer'

describe('SiteFooter', () => {
  it('links visitors to the privacy page', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy',
    )
  })
})
