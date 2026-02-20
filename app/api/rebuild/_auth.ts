import { NextRequest } from 'next/server'

export function validateSecret(req: NextRequest): boolean {
  const secret =
    req.nextUrl.searchParams.get('secret') ??
    req.headers.get('authorization')?.replace('Bearer ', '')
  return !!secret && secret === process.env.REBUILD_SECRET
}
