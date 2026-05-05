import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getFigureBySlug } from '@/lib/figures'

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com',
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { question, figureSlug } = body as { question?: string; figureSlug?: string }

  if (!question) {
    return Response.json({ error: 'question is required' }, { status: 400 })
  }

  const figure = getFigureBySlug(figureSlug ?? '')
  if (!figure) {
    return Response.json({ error: 'figure not found' }, { status: 404 })
  }

  const stream = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    stream: true,
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content: figure.systemPrompt,
      },
      {
        role: 'user',
        content: `用戶困境：${question}\n\n請以你（${figure.name}）的身份和語氣，給出100-150字的回應。有具體歷史細節，不說廢話。`,
      },
    ],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ''
        if (delta) controller.enqueue(encoder.encode(delta))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Figure-Slug': figure.slug,
      'X-Figure-Name': figure.name,
      'X-Figure-Era': figure.era,
    },
  })
}
