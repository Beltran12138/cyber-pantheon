'use client'
import { useState, useEffect } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { Figure } from '@/types'

export default function FigureDetailClient({ figure }: { figure: Figure }) {
  const [enshrined, setEnshrined] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase.auth.getUser().then((res: Awaited<ReturnType<typeof supabase.auth.getUser>>) => {
      const u = res.data.user
      setUser(u)
      if (u) {
        supabase
          .from('enshrines')
          .select('id')
          .eq('user_id', u.id)
          .eq('figure_slug', figure.slug)
          .maybeSingle()
          .then((r: { data: unknown }) => setEnshrined(!!r.data))
          .catch(() => setEnshrined(false))
      }
    })
  }, [figure.slug, supabase])

  async function toggleEnshrine() {
    if (!user) { window.location.href = '/login'; return }
    setIsLoading(true)
    try {
      if (enshrined) {
        await supabase.from('enshrines')
          .delete()
          .eq('user_id', user.id)
          .eq('figure_slug', figure.slug)
        setEnshrined(false)
      } else {
        await supabase.from('enshrines')
          .insert({ user_id: user.id, figure_slug: figure.slug })
        setEnshrined(true)
      }
    } catch (err) {
      console.error('供奉操作失敗:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{figure.name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{figure.era}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {figure.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
        <button
          onClick={toggleEnshrine}
          disabled={isLoading}
          className={enshrined ? 'btn-gold' : 'btn-ghost'}
        >
          {isLoading ? '...' : enshrined ? '✦ 已供奉' : '✦ 供奉'}
        </button>
      </div>

      <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
        {figure.bio}
      </p>

      {figure.poems.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
            — 壯志詩 —
          </h2>
          {figure.poems.map((poem, i) => (
            <div key={i} className="card mb-4">
              <p className="text-xs mb-2" style={{ color: 'var(--gold)' }}>{poem.title}</p>
              <p className="text-sm leading-loose whitespace-pre-line">{poem.content}</p>
              {poem.source && (
                <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{poem.source}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <a href={`/yishi?figures=${figure.slug}`} className="btn-gold">邀入議事廳</a>
        <a href="/" className="btn-ghost">← 返回祠堂</a>
      </div>
    </div>
  )
}
