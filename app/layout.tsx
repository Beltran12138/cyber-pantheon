import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '賽博先賢祠',
  description: '困頓時，聆先賢之訓，得壯志之詩',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen">
        <header className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          <a href="/" className="text-lg font-semibold tracking-widest" style={{ color: 'var(--text)' }}>
            賽博先賢祠
          </a>
          <nav className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
            <a href="/yishi" className="hover:text-[var(--gold)]">議事廳</a>
            <a href="/shengshi" className="hover:text-[var(--gold)]">生詩</a>
            <a href="/wo" className="hover:text-[var(--gold)]">吾祠</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
