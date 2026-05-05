'use client'
import { useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

interface Props {
  title: string
  content: string
  figures: string[]
  onClose: () => void
  onRegenerate?: () => void
}

export default function PoemOverlay({ title, content, figures, onClose, onRegenerate }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function savePoem() {
    const supabase = getSupabaseBrowser()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('請先登錄'); return }
    await supabase.from('saved_poems').insert({
      user_id: user.id,
      title,
      content,
      figures,
    })
    alert('已收藏至吾祠')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30, 20, 10, 0.85)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card max-w-md w-full text-center py-8 px-6 shadow-2xl">
        <p className="text-xs tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
          — 壯志詩 · 應景而生 —
        </p>
        <h2 className="text-lg font-semibold mb-6">{title}</h2>
        <p className="text-sm leading-loose whitespace-pre-line tracking-wide mb-6">
          {content}
        </p>
        {figures.length > 0 && (
          <p className="text-xs mb-6" style={{ color: 'var(--muted)' }}>
            以先賢之志化詩
          </p>
        )}
        <div className="flex justify-center gap-3">
          <button onClick={savePoem} className="btn-gold">收藏至吾祠</button>
          {onRegenerate && (
            <button onClick={onRegenerate} className="btn-ghost">再生一首</button>
          )}
          <button onClick={onClose} className="btn-ghost">關閉</button>
        </div>
      </div>
    </div>
  )
}
