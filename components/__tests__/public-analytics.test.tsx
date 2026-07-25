import { render } from '@testing-library/react'
import type { BeforeSendEvent } from '@vercel/analytics/next'

import { PublicAnalytics, restrictAnalyticsToPublicHosts } from '@/components/public-analytics'

type AnalyticsProps = {
  beforeSend?: (event: BeforeSendEvent) => BeforeSendEvent | null
}

const analyticsMock = vi.hoisted(() =>
  vi.fn((_props: AnalyticsProps) => null),
)

vi.mock('@vercel/analytics/next', () => ({
  Analytics: analyticsMock,
}))

describe('PublicAnalytics', () => {
  afterEach(() => {
    analyticsMock.mockClear()
    vi.unstubAllEnvs()
  })

  it('does not load analytics when NEXT_PUBLIC_ANALYTICS_ENABLED is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', undefined)

    render(<PublicAnalytics />)

    expect(analyticsMock).not.toHaveBeenCalled()
  })

  it('does not load analytics when NEXT_PUBLIC_ANALYTICS_ENABLED is false', () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'false')

    render(<PublicAnalytics />)

    expect(analyticsMock).not.toHaveBeenCalled()
  })

  it('loads analytics with the public-host filter when explicitly enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'true')

    render(<PublicAnalytics />)

    expect(analyticsMock).toHaveBeenCalledOnce()
    expect(analyticsMock.mock.calls[0][0]).toEqual({
      beforeSend: restrictAnalyticsToPublicHosts,
    })
  })
})

describe('restrictAnalyticsToPublicHosts', () => {
  it.each([
    'https://rebecca-kleinberg.com/',
    'https://rebecca-kleinberg.com/work/paintings?utm_source=newsletter',
    'https://www.rebecca-kleinberg.com/about',
  ])('allows analytics from the public hostname in %s', (url) => {
    const event: BeforeSendEvent = { type: 'pageview', url }

    expect(restrictAnalyticsToPublicHosts(event)).toBe(event)
  })

  it.each([
    'https://rjk-jvb-website.vercel.app/',
    'https://staging-rjk-jvb-website.vercel.app/',
    'https://pr-21-rjk-jvb-website.vercel.app/work/drawings',
    'https://rjk-jvb-website-git-main-jvb.vercel.app/',
    'http://localhost:3000/',
    'https://preview.rebecca-kleinberg.com/',
  ])('blocks analytics from the non-public hostname in %s', (url) => {
    const event: BeforeSendEvent = { type: 'event', url }

    expect(restrictAnalyticsToPublicHosts(event)).toBeNull()
  })

  it('blocks analytics when the event URL is malformed', () => {
    const event: BeforeSendEvent = { type: 'pageview', url: 'not a URL' }

    expect(restrictAnalyticsToPublicHosts(event)).toBeNull()
  })
})
