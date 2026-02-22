import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('../../_auth', () => ({
  validateSecret: vi.fn(),
}))

import { GET, POST } from '../route'
import { validateSecret } from '../../_auth'

const mockValidateSecret = vi.mocked(validateSecret)

function makeRequest(url = 'http://localhost/api/rebuild/promote') {
  return new NextRequest(url)
}

describe('/api/rebuild/promote', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('GITHUB_PAT', 'test-token')
    vi.stubEnv('GITHUB_REPO_OWNER', 'test-owner')
    vi.stubEnv('GITHUB_REPO_NAME', 'test-repo')
  })

  it('returns 401 when secret is invalid', async () => {
    mockValidateSecret.mockReturnValue(false)
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 500 when GitHub env vars are missing', async () => {
    mockValidateSecret.mockReturnValue(true)
    vi.stubEnv('GITHUB_PAT', '')
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
  })

  it('returns 502 when GitHub dispatch fails', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('error'),
    } as unknown as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('GitHub dispatch failed')
  })

  it('returns 200 and triggered:true on success', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response)

    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ triggered: true })
  })

  it('dispatches notion-content-promote event type', async () => {
    mockValidateSecret.mockReturnValue(true)
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response)
    global.fetch = fetchMock

    await GET(makeRequest())

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/dispatches',
      expect.objectContaining({
        body: JSON.stringify({ event_type: 'notion-content-promote' }),
      })
    )
  })
})
