'use client'

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'

const PUBLIC_HOSTNAMES = new Set([
  'rebecca-kleinberg.com',
  'www.rebecca-kleinberg.com',
])

export function restrictAnalyticsToPublicHosts(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  try {
    const hostname = new URL(event.url).hostname
    return PUBLIC_HOSTNAMES.has(hostname) ? event : null
  } catch {
    return null
  }
}

export function PublicAnalytics() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
    return null
  }

  return <Analytics beforeSend={restrictAnalyticsToPublicHosts} />
}
