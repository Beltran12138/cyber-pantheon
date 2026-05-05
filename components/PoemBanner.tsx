'use client'
import { useState, useEffect } from 'react'
import type { Poem } from '@/types'

interface Props { poems: (Poem & { figureName: string })[] }

export default function PoemBanner({ poems }: Props) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (poems.length === 0) return
    const t = setInterval(() => setIdx(i => (i + 1) % poems.length), 6000)
    return () => clearInterval(t)
  }, [poems.length])

  const poem = poems[idx]
  if (!poem) return null

  return (
    <div className="card text-center py-6 mb-8" style={{ borderLeft: '4px solid var(--gold)' }}>
      <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
        — {poem.figureName} · {poem.title} —
      </p>
      <p className="text-sm leading-loose whitespace-pre-line" style={{ color: 'var(--text)' }}>
        {poem.content}
      </p>
      {poem.source && (
        <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>{poem.source}</p>
      )}
    </div>
  )
}
