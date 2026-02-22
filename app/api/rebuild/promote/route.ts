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

  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  const token = process.env.GITHUB_PAT

  if (!owner || !repo || !token) {
    return NextResponse.json(
      { error: 'Missing GitHub configuration' },
      { status: 500 }
    )
  }

  let res: Response
  try {
    res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_type: 'notion-content-promote' }),
      }
    )
  } catch (err) {
    console.error('[rebuild/promote] fetch to GitHub failed:', err)
    return NextResponse.json(
      { error: 'Failed to reach GitHub API', detail: String(err) },
      { status: 502 }
    )
  }

  if (!res.ok) {
    let detail = '(could not read response body)'
    try {
      detail = await res.text()
    } catch {}
    console.error(`[rebuild/promote] GitHub API returned ${res.status}: ${detail}`)
    return NextResponse.json(
      { error: 'GitHub dispatch failed', detail },
      { status: 502 }
    )
  }

  return NextResponse.json({ triggered: true })
}
