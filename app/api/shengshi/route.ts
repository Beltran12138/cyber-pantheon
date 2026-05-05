import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { getFiguresBySlug } from '@/lib/figures'

export async function POST(req: NextRequest) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: 'server misconfigured' }, { status: 500 })
  }
  const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
  })

  const body = await req.json().catch(() => ({}))
  const { situation, figures: figureSlugs = [], councilContext = '' } = body as {
    situation?: string
    figures?: string[]
    councilContext?: string
  }

  if (!situation && !councilContext) {
    return Response.json({ error: 'situation or councilContext required' }, { status: 400 })
  }

  const figureNames = getFiguresBySlug(figureSlugs).map(f => f.name).join('、')

  const contextPart = councilContext
    ? `\n\n議事廳對話摘要：\n${councilContext.slice(0, 800)}`
    : ''

  const prompt = `用戶困境：${situation || '未知'}${contextPart}

請以${figureNames || '先賢'}之志，創作一首七言絕句或五言絕句的壯志詩。
要求：
1. 意境壯烈，有具體歷史或自然意象
2. 符合格律（平仄、押韻）
3. 不寫套話廢話
4. 輸出格式（嚴格遵守）：
詩題：[題目]
[第一句]，[第二句]。
[第三句]，[第四句]。`

  let completion
  try {
    completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 200,
      messages: [
        { role: 'system', content: '你是一位精通古詩格律的詩人，只輸出詩作，無任何解釋。' },
        { role: 'user', content: prompt },
      ],
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[shengshi] DeepSeek error:', msg)
    return Response.json({ error: 'upstream failure', detail: msg }, { status: 502 })
  }

  const raw = completion.choices[0]?.message?.content ?? ''
  const titleMatch = raw.match(/詩題[：:]\s*(.+)/)
  const title = titleMatch?.[1]?.trim() ?? '壯志詩'
  const content = raw.replace(/詩題[：:].+\n?/, '').trim()

  return Response.json({ title, content, figures: figureSlugs })
}
