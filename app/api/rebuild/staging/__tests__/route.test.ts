import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Must mock before importing route
vi.mock('../../_auth', () => ({
  validateSecret: vi.fn(),
}))

import { GET, POST } from '../route'
import { validateSecret } from '../../_auth'

const mockValidateSecret = vi.mocked(validateSecret)

function makeRequest(url = 'http://localhost/api/rebuild/staging') {
  return new NextRequest(url)
}

describe('/api/rebuild/staging', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('GITHUB_REPO_OWNER', 'test-owner')
    vi.stubEnv('GITHUB_REPO_NAME', 'test-repo')
    vi.stubEnv('GITHUB_PAT', 'test-pat')
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

  it('returns 200 and triggered:true on success', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ triggered: true })
  })

  it('calls GitHub dispatches endpoint with correct payload', async () => {
    mockValidateSecret.mockReturnValue(true)
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response)
    global.fetch = fetchMock

    await POST(makeRequest())

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/test-owner/test-repo/dispatches',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ event_type: 'notion-content-staging' }),
      })
    )
  })

  it('returns 502 when GitHub API call fails', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Bad credentials'),
    } as unknown as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('GitHub dispatch failed')
    expect(body.detail).toBe('Bad credentials')
  })

  it('returns 502 when fetch throws a network error', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'))

    const res = await GET(makeRequest())
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Failed to reach GitHub API')
  })

  it('sends Authorization Bearer header with GITHUB_PAT to GitHub API', async () => {
    mockValidateSecret.mockReturnValue(true)
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response)
    global.fetch = fetchMock

    await GET(makeRequest())

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-pat',
        }),
      })
    )
  })

  it('returns 500 when GITHUB_REPO_OWNER is missing', async () => {
    mockValidateSecret.mockReturnValue(true)
    vi.stubEnv('GITHUB_REPO_OWNER', '')
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Missing GitHub configuration')
  })

  it('returns 500 when GITHUB_REPO_NAME is missing', async () => {
    mockValidateSecret.mockReturnValue(true)
    vi.stubEnv('GITHUB_REPO_NAME', '')
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
  })
})
