'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function RebuildPage() {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function triggerRebuild(endpoint: '/api/rebuild/staging' | '/api/rebuild/promote') {
    setStatus('loading')
    setMessage('')

    let res: Response
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
      })
    } catch (err) {
      console.error('[rebuild] fetch failed:', err)
      setStatus('error')
      setMessage('Could not reach the server. Check your connection and try again.')
      return
    }

    let data: { triggered?: boolean; error?: string }
    try {
      data = await res.json()
    } catch (err) {
      console.error('[rebuild] failed to parse response:', err)
      setStatus('error')
      setMessage(`Server responded with status ${res.status} but returned an unexpected format. Check server logs.`)
      return
    }

    if (res.ok && data.triggered) {
      setStatus('success')
      setMessage(
        endpoint === '/api/rebuild/staging'
          ? 'Staging rebuild triggered.'
          : 'Production promote triggered.'
      )
    } else if (!res.ok) {
      setStatus('error')
      setMessage(data.error ?? `Request failed (HTTP ${res.status}). Try again or check server logs.`)
    } else {
      console.error('[rebuild] unexpected response shape:', data)
      setStatus('error')
      setMessage('The server responded successfully but the rebuild status is unknown. Check server logs.')
    }
  }

  const busy = status === 'loading'

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="font-serif text-2xl text-foreground">Rebuild</h1>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs tracking-widest uppercase text-foreground/60">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground/60"
            placeholder="Enter rebuild secret"
            autoComplete="current-password"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => triggerRebuild('/api/rebuild/staging')}
            disabled={busy || !password}
            className="flex-1 border border-foreground/30 px-4 py-2 text-xs tracking-widest uppercase text-foreground/80 transition-colors hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? '…' : 'Staging'}
          </button>
          <button
            onClick={() => triggerRebuild('/api/rebuild/promote')}
            disabled={busy || !password}
            className="flex-1 border border-foreground/30 px-4 py-2 text-xs tracking-widest uppercase text-foreground/80 transition-colors hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? '…' : 'Promote'}
          </button>
        </div>

        {status === 'success' && (
          <p className="text-xs text-green-700">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-600">{message}</p>
        )}
      </div>
    </main>
  )
}
