import { NextRequest } from 'next/server'

export function validateSecret(req: NextRequest): boolean {
  const envSecret = process.env.REBUILD_SECRET?.trim()
  if (!envSecret) {
    console.warn('[rebuild] REBUILD_SECRET is not configured — all requests will be rejected')
    return false
  }

  const authHeader = req.headers.get('authorization')
  const secret =
    req.nextUrl.searchParams.get('secret') ??
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined)
  return !!secret && secret === envSecret
}
