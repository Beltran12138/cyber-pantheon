'use client'
import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = getSupabaseBrowser()

  async function signInWithEmail() {
    if (!email) return
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (!error) setSent(true)
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="max-w-sm mx-auto mt-16 card text-center py-8 px-6">
      <h1 className="text-lg font-semibold mb-2">入祠</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>登錄以供奉先賢、收藏詩作</p>

      {sent ? (
        <p className="text-sm" style={{ color: 'var(--gold)' }}>
          魔法鏈接已發至 {email}，請查收
        </p>
      ) : (
        <>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-sm mb-3 bg-white"
            style={{ borderColor: 'var(--border)' }}
            placeholder="電子郵件"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && signInWithEmail()}
          />
          <button onClick={signInWithEmail} className="btn-gold w-full mb-3">
            發送魔法鏈接
          </button>
          <button onClick={signInWithGoogle} className="btn-ghost w-full">
            Google 登錄
          </button>
        </>
      )}
    </div>
  )
}
