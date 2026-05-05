'use client'
interface Props {
  title: string
  content: string
  figures: string[]
  onClose: () => void
}
export default function PoemOverlay({ title, content, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center" onClick={e => e.stopPropagation()}>
        <div className="text-xs tracking-widest mb-3" style={{ color: 'var(--gold)' }}>— 壯志詩 · 應景而生 —</div>
        <div className="text-lg font-bold mb-4">{title}</div>
        <pre className="text-sm leading-loose whitespace-pre-wrap">{content}</pre>
        <button className="mt-4 btn-gold px-6 py-2" onClick={onClose}>關閉</button>
      </div>
    </div>
  )
}
