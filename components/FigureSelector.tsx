'use client'
import { useState } from 'react'
import { getAllFigures } from '@/lib/figures'

interface Props {
  selected: string[]
  onChange: (slugs: string[]) => void
  max?: number
}

export default function FigureSelector({ selected, onChange, max = 5 }: Props) {
  const [search, setSearch] = useState('')
  const figures = getAllFigures()
  const filtered = figures.filter(f =>
    f.name.includes(search) || f.era.includes(search) || f.tags.some(t => t.includes(search))
  )

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      onChange(selected.filter(s => s !== slug))
    } else if (selected.length < max) {
      onChange([...selected, slug])
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          className="flex-1 border rounded px-3 py-1.5 text-sm bg-white"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="搜尋先賢…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {selected.length}/{max}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {filtered.map(f => {
          const active = selected.includes(f.slug)
          const disabled = !active && selected.length >= max
          return (
            <button
              key={f.slug}
              onClick={() => !disabled && toggle(f.slug)}
              disabled={disabled}
              className={`text-left rounded border px-2 py-1.5 text-xs transition-colors ${
                active ? 'bg-[#fdf8ee]' : 'hover:border-[var(--gold)]'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{ borderColor: active ? 'var(--gold)' : 'var(--border)' }}
            >
              <div className="font-medium">{f.name}</div>
              <div style={{ color: 'var(--muted)' }}>{f.era}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
