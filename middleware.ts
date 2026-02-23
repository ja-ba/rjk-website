import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  if (!host.endsWith('.vercel.app')) {
    return new NextResponse(null, { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/rebuild',
}
