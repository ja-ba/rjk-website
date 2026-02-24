import { middleware } from '@/middleware'
import { NextRequest, NextResponse } from 'next/server'

function makeRequest(host: string) {
  const req = new NextRequest('http://localhost/rebuild')
  req.headers.set('host', host)
  return req
}

describe('middleware', () => {
  it('allows requests from a .vercel.app host', () => {
    const res = middleware(makeRequest('rjk-website.vercel.app'))
    expect(res.status).toBe(200)
  })

  it('blocks requests from a custom domain', () => {
    const res = middleware(makeRequest('elenavasquez.com'))
    expect(res.status).toBe(404)
  })

  it('blocks requests from a www custom domain', () => {
    const res = middleware(makeRequest('www.elenavasquez.com'))
    expect(res.status).toBe(404)
  })

  it('blocks requests with no host header', () => {
    const req = new NextRequest('http://localhost/rebuild')
    req.headers.delete('host')
    const res = middleware(req)
    expect(res.status).toBe(404)
  })

  it('allows any subdomain of .vercel.app', () => {
    const res = middleware(makeRequest('rjk-website-git-feat-abc.vercel.app'))
    expect(res.status).toBe(200)
  })

  it('blocks bare vercel.app with no subdomain', () => {
    const res = middleware(makeRequest('vercel.app'))
    expect(res.status).toBe(404)
  })

  it('blocks a host that contains .vercel.app as a substring but not suffix', () => {
    const res = middleware(makeRequest('evil.vercel.app.attacker.com'))
    expect(res.status).toBe(404)
  })
})
