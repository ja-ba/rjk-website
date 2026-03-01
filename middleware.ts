import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')
  if (!host) {
    console.warn('[middleware] /rebuild request received with no Host header')
    return new NextResponse(null, { status: 404 })
  }
  if (!host.endsWith('.vercel.app')) {
    console.warn(`[middleware] /rebuild blocked for non-vercel.app host: ${host}`)
    return new NextResponse(null, { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/rebuild',
}
