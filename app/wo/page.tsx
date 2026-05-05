import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase-server'
import { getFigureBySlug } from '@/lib/figures'
import FigureCard from '@/components/FigureCard'
import type { SavedPoem } from '@/types'

export default async function WoPage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: enshrines }, { data: poems }] = await Promise.all([
    supabase.from('enshrines').select('figure_slug').eq('user_id', user.id),
    supabase.from('saved_poems').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  const enshrined = (enshrines ?? [])
    .map(e => getFigureBySlug(e.figure_slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getFigureBySlug>>[]

  const savedPoems = (poems ?? []) as SavedPoem[]

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-widest text-center mb-8">吾之祠堂</h1>

      <section className="mb-10">
        <h2 className="text-sm tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
          — 供奉先賢 ({enshrined.length}) —
        </h2>
        {enshrined.length === 0 ? (
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            尚未供奉先賢。<a href="/" style={{ color: 'var(--gold)' }}>前往祠堂</a>供奉。
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {enshrined.map(f => (
              <FigureCard key={f.slug} figure={f} enshrined />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm tracking-widest mb-4" style={{ color: 'var(--gold)' }}>
          — 收藏詩作 ({savedPoems.length}) —
        </h2>
        {savedPoems.length === 0 ? (
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            尚無收藏詩作。<a href="/shengshi" style={{ color: 'var(--gold)' }}>召喚壯志詩</a>。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPoems.map(poem => (
              <div key={poem.id} className="card">
                <p className="text-sm font-semibold mb-2">{poem.title}</p>
                <p className="text-xs leading-loose whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                  {poem.content}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--border)' }}>
                  {new Date(poem.created_at).toLocaleDateString('zh-TW')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
