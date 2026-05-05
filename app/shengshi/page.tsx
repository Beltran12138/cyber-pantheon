'use client'
import { useState } from 'react'
import { getDefaultCouncil } from '@/lib/figures'
import FigureSelector from '@/components/FigureSelector'
import PoemOverlay from '@/components/PoemOverlay'

export default function ShengshiPage() {
  const [situation, setSituation] = useState('')
  const [selected, setSelected] = useState<string[]>(getDefaultCouncil())
  const [loading, setLoading] = useState(false)
  const [poem, setPoem] = useState<{ title: string; content: string } | null>(null)

  async function generate() {
    if (!situation.trim() || loading) return
    setLoading(true)
    setPoem(null)
    try {
      const res = await fetch('/api/shengshi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, figures: selected }),
      })
      if (res.ok) {
        const data = await res.json()
        setPoem({ title: data.title, content: data.content })
      } else {
        alert('生詩失敗，請稍後再試')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-semibold tracking-widest text-center mb-6">召喚壯志詩</h1>

      <div className="card mb-4">
        <label className="text-xs tracking-widest block mb-2" style={{ color: 'var(--gold)' }}>
          述汝處境
        </label>
        <textarea
          className="w-full bg-transparent resize-none text-sm outline-none"
          style={{ color: 'var(--text)' }}
          rows={4}
          placeholder="我正面對……"
          value={situation}
          onChange={e => setSituation(e.target.value)}
        />
      </div>

      <div className="card mb-4">
        <label className="text-xs tracking-widest block mb-3" style={{ color: 'var(--gold)' }}>
          以誰之志化詩
        </label>
        <FigureSelector selected={selected} onChange={setSelected} />
      </div>

      <button
        onClick={generate}
        disabled={loading || !situation.trim()}
        className="btn-gold w-full py-2 disabled:opacity-50"
      >
        {loading ? '詩成中…' : '生壯志詩'}
      </button>

      {poem && (
        <PoemOverlay
          title={poem.title}
          content={poem.content}
          figures={selected}
          onClose={() => setPoem(null)}
          onRegenerate={generate}
        />
      )}
    </div>
  )
}
