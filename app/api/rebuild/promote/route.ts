import { NextRequest, NextResponse } from 'next/server'
import { validateSecret } from '../_auth'

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}

async function handler(req: NextRequest) {
  if (!validateSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const vercelToken = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  if (!vercelToken || !projectId) {
    return NextResponse.json(
      { error: 'Missing Vercel configuration' },
      { status: 500 }
    )
  }

  // Find the most recent ready preview deployment
  const listRes = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&target=preview&state=READY&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    }
  )

  if (!listRes.ok) {
    const text = await listRes.text()
    return NextResponse.json(
      { error: 'Failed to list deployments', detail: text },
      { status: 502 }
    )
  }

  const { deployments } = await listRes.json()
  if (!deployments || deployments.length === 0) {
    return NextResponse.json(
      { error: 'No ready preview deployment found' },
      { status: 404 }
    )
  }

  const deployment = deployments[0]

  // Promote to production
  const promoteRes = await fetch(
    `https://api.vercel.com/v10/deployments/${deployment.uid}/promote`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!promoteRes.ok) {
    const text = await promoteRes.text()
    return NextResponse.json(
      { error: 'Promote failed', detail: text },
      { status: 502 }
    )
  }

  return NextResponse.json({ promoted: true, url: deployment.url })
}
