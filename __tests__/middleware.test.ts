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

  it('blocks localhost (page is only accessible on .vercel.app preview URLs)', () => {
    const res = middleware(makeRequest('localhost'))
    expect(res.status).toBe(404)
  })

  it('blocks localhost with port number', () => {
    const res = middleware(makeRequest('localhost:3000'))
    expect(res.status).toBe(404)
  })

  it('blocks IPv4 loopback address', () => {
    const res = middleware(makeRequest('127.0.0.1:3000'))
    expect(res.status).toBe(404)
  })
})
