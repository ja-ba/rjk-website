import { NextRequest } from 'next/server'

export function validateSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const secret =
    req.nextUrl.searchParams.get('secret') ??
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined)
  return !!secret && secret === process.env.REBUILD_SECRET
}
