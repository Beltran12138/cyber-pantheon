'use client'
import type { CouncilMessage } from '@/types'

interface Props { messages: CouncilMessage[] }

export default function CouncilFeed({ messages }: Props) {
  if (messages.length === 0) return null

  return (
    <div className="flex flex-col gap-4 mt-6">
      {messages.map((msg, i) => (
        <div key={`${msg.figureSlug}-${i}`} className="flex gap-3">
          <div
            className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold"
            style={{ background: 'var(--gold-light)', color: 'var(--text)' }}
          >
            {msg.figureName.slice(0, 1)}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold">{msg.figureName}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{msg.figureEra}</span>
            </div>
            <div
              className="card text-sm leading-relaxed"
              style={{ color: msg.streaming ? 'var(--muted)' : 'var(--text)' }}
            >
              {msg.content}
              {msg.streaming && (
                <span
                  className="inline-block w-1.5 h-4 ml-0.5 align-text-bottom animate-[blink_1s_step-end_infinite]"
                  style={{ background: 'var(--gold)' }}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
