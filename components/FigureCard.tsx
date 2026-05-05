'use client'
import type { Figure } from '@/types'

interface Props {
  figure: Figure
  enshrined?: boolean
  onEnshrine?: (slug: string) => void
}

export default function FigureCard({ figure, enshrined = false, onEnshrine }: Props) {
  return (
    <div className={`card flex flex-col gap-2 cursor-pointer hover:shadow-sm transition-shadow ${enshrined ? 'gold-border' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <a href={`/xian/${figure.slug}`} className="text-base font-semibold hover:text-[var(--gold)]">
            {figure.name}
          </a>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{figure.era}</p>
        </div>
        {onEnshrine && (
          <button
            onClick={(e) => { e.preventDefault(); onEnshrine(figure.slug) }}
            className="text-lg leading-none"
            title={enshrined ? '已供奉' : '供奉'}
            style={{ color: enshrined ? 'var(--gold)' : 'var(--border)' }}
          >
            ✦
          </button>
        )}
      </div>
      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {figure.bio}
      </p>
      <div className="flex flex-wrap gap-1 mt-auto pt-1">
        {figure.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  )
}
