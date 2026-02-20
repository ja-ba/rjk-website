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

const mockDeployment = { uid: 'dep-123', url: 'preview.vercel.app' }

describe('/api/rebuild/promote', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('VERCEL_API_TOKEN', 'test-vercel-token')
    vi.stubEnv('VERCEL_PROJECT_ID', 'test-project-id')
  })

  it('returns 401 when secret is invalid', async () => {
    mockValidateSecret.mockReturnValue(false)
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Unauthorized')
  })

  it('returns 500 when Vercel env vars are missing', async () => {
    mockValidateSecret.mockReturnValue(true)
    vi.stubEnv('VERCEL_API_TOKEN', '')
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
  })

  it('returns 404 when no preview deployment found', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ deployments: [] }),
    } as unknown as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(404)
  })

  it('returns 200 and promoted:true on success', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ deployments: [mockDeployment] }),
      } as unknown as Response)
      .mockResolvedValueOnce({ ok: true } as Response)

    const res = await POST(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ promoted: true, url: mockDeployment.url })
  })

  it('calls promote endpoint with correct deployment id', async () => {
    mockValidateSecret.mockReturnValue(true)
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ deployments: [mockDeployment] }),
      } as unknown as Response)
      .mockResolvedValueOnce({ ok: true } as Response)
    global.fetch = fetchMock

    await GET(makeRequest())

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `https://api.vercel.com/v10/deployments/${mockDeployment.uid}/promote`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns 502 when list deployments fails', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('error'),
    } as unknown as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(502)
  })

  it('returns 502 when promote call fails', async () => {
    mockValidateSecret.mockReturnValue(true)
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ deployments: [mockDeployment] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('error'),
      } as unknown as Response)

    const res = await GET(makeRequest())
    expect(res.status).toBe(502)
  })
})
