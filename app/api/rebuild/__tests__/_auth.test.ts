import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { validateSecret } from '../_auth'

function makeRequest(url: string, headers?: Record<string, string>) {
  return new NextRequest(url, { headers })
}

describe('validateSecret', () => {
  beforeEach(() => {
    vi.stubEnv('REBUILD_SECRET', 'correct-secret')
  })

  it('accepts correct secret via query param', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging?secret=correct-secret')
    expect(validateSecret(req)).toBe(true)
  })

  it('accepts correct secret via Authorization Bearer header', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging', {
      Authorization: 'Bearer correct-secret',
    })
    expect(validateSecret(req)).toBe(true)
  })

  it('rejects wrong secret in query param', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging?secret=wrong')
    expect(validateSecret(req)).toBe(false)
  })

  it('rejects wrong secret in Authorization header', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging', {
      Authorization: 'Bearer wrong',
    })
    expect(validateSecret(req)).toBe(false)
  })

  it('rejects request with no secret', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging')
    expect(validateSecret(req)).toBe(false)
  })

  it('rejects malformed Authorization header without Bearer prefix', () => {
    const req = makeRequest('http://localhost/api/rebuild/staging', {
      Authorization: 'correct-secret',
    })
    expect(validateSecret(req)).toBe(false)
  })

  it('rejects when REBUILD_SECRET is not set', () => {
    vi.stubEnv('REBUILD_SECRET', '')
    const req = makeRequest('http://localhost/api/rebuild/staging?secret=anything')
    expect(validateSecret(req)).toBe(false)
  })

  it('rejects when REBUILD_SECRET is whitespace only', () => {
    vi.stubEnv('REBUILD_SECRET', '   ')
    const req = makeRequest('http://localhost/api/rebuild/staging?secret=   ')
    expect(validateSecret(req)).toBe(false)
  })

  it('query param secret takes precedence over Authorization header', () => {
    const req = makeRequest(
      'http://localhost/api/rebuild/staging?secret=correct-secret',
      { Authorization: 'Bearer wrong-secret' }
    )
    expect(validateSecret(req)).toBe(true)
  })

  it('rejects when ?secret= is blank even if Authorization header is valid', () => {
    const req = makeRequest(
      'http://localhost/api/rebuild/staging?secret=',
      { Authorization: 'Bearer correct-secret' }
    )
    // empty string is not nullish so ?? falls through; '' !== 'correct-secret'
    expect(validateSecret(req)).toBe(false)
  })
})
