'use client'
import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

const supabase = getSupabaseBrowser()

export default function AuthButton() {
  const [user, setUser] = useState<{ email?: string | null } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string | null } | null } }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!user) return (
    <a href="/login" className="text-sm hover:text-[var(--gold)]" style={{ color: 'var(--muted)' }}>
      登錄
    </a>
  )

  return (
    <button
      onClick={() => supabase.auth.signOut().then(() => setUser(null))}
      className="text-sm hover:text-[var(--gold)]"
      style={{ color: 'var(--muted)' }}
    >
      退出
    </button>
  )
}
