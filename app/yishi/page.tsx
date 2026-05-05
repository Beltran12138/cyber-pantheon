'use client'
import { useState, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import FigureSelector from '@/components/FigureSelector'
import CouncilFeed from '@/components/CouncilFeed'
import PoemOverlay from '@/components/PoemOverlay'
import { getFiguresBySlug, getDefaultCouncil } from '@/lib/figures'
import type { CouncilMessage } from '@/types'

function YishiInner() {
  const params = useSearchParams()
  const initialFigure = params.get('figures')
  const [question, setQuestion] = useState('')
  const [selected, setSelected] = useState<string[]>(
    initialFigure ? [initialFigure] : getDefaultCouncil()
  )
  const [messages, setMessages] = useState<CouncilMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [poem, setPoem] = useState<{ title: string; content: string; figures: string[] } | null>(null)
  const [generatingPoem, setGeneratingPoem] = useState(false)
  const submittingRef = useRef(false)

  const submitCouncil = useCallback(async () => {
    if (!question.trim() || selected.length === 0 || submittingRef.current) return
    submittingRef.current = true
    setLoading(true)
    setMessages([])
    setPoem(null)

    const figures = getFiguresBySlug(selected)
    setMessages(figures.map(f => ({
      figureSlug: f.slug,
      figureName: f.name,
      figureEra: f.era,
      content: '',
      streaming: true,
    })))

    await Promise.all(
      figures.map(async (fig) => {
        const res = await fetch('/api/yishi/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, figureSlug: fig.slug }),
        })
        if (!res.ok || !res.body) return
        const reader = res.body.getReader()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dec = new TextDecoder('utf-8', { stream: true } as any)
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const delta = dec.decode(value)
            setMessages(prev => prev.map(m =>
              m.figureSlug === fig.slug
                ? { ...m, content: m.content + delta }
                : m
            ))
          }
        } catch {
          reader.cancel()
        }
        setMessages(prev => prev.map(m =>
          m.figureSlug === fig.slug ? { ...m, streaming: false } : m
        ))
      })
    )

    setLoading(false)
    setGeneratingPoem(true)
    try {
      const poemRes = await fetch('/api/shengshi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: question, figures: selected }),
      })
      if (poemRes.ok) {
        const data = await poemRes.json()
        setPoem({ title: data.title, content: data.content, figures: selected })
      }
    } finally {
      setGeneratingPoem(false)
      submittingRef.current = false
    }
  }, [question, selected])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold tracking-widest text-center mb-6">先賢議事廳</h1>

      <div className="card mb-4">
        <label className="text-xs tracking-widest block mb-2" style={{ color: 'var(--gold)' }}>
          汝之困境
        </label>
        <textarea
          className="w-full bg-transparent resize-none text-sm outline-none"
          style={{ color: 'var(--text)' }}
          rows={3}
          placeholder="述汝困惑，先賢議之…"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
      </div>

      <div className="card mb-4">
        <label className="text-xs tracking-widest block mb-3" style={{ color: 'var(--gold)' }}>
          召喚先賢（最多5位）
        </label>
        <FigureSelector selected={selected} onChange={setSelected} />
      </div>

      <button
        onClick={submitCouncil}
        disabled={loading || generatingPoem || !question.trim() || selected.length === 0}
        className="btn-gold w-full py-2 disabled:opacity-50"
      >
        {loading ? '先賢議中…' : generatingPoem ? '詩成中…' : '召喚議事廳'}
      </button>

      <CouncilFeed messages={messages} />

      {poem && (
        <PoemOverlay
          title={poem.title}
          content={poem.content}
          figures={poem.figures}
          onClose={() => setPoem(null)}
        />
      )}
    </div>
  )
}

export default function YishiPage() {
  return (
    <Suspense fallback={null}>
      <YishiInner />
    </Suspense>
  )
}
