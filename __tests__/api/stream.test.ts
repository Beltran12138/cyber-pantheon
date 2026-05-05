jest.mock('openai')
import OpenAI from 'openai'

describe('POST /api/yishi/stream validation', () => {
  beforeAll(() => {
    process.env.DEEPSEEK_API_KEY = 'test'
  })

  afterEach(() => jest.resetAllMocks())

  it('rejects missing question', async () => {
    const req = new Request('http://localhost/api/yishi/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ figureSlug: 'xin-qiji' }),
    })
    const { POST } = await import('@/app/api/yishi/stream/route')
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/question/)
  })

  it('rejects unknown figure slug', async () => {
    const req = new Request('http://localhost/api/yishi/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '如何面對困境', figureSlug: 'nobody' }),
    })
    const { POST } = await import('@/app/api/yishi/stream/route')
    const res = await POST(req as any)
    expect(res.status).toBe(404)
  })

  it('streams response for valid request', async () => {
    const mockStream = (async function* () {
      yield { choices: [{ delta: { content: '艱難' } }] }
      yield { choices: [{ delta: { content: '困苦' } }] }
    })()

    jest.resetModules()

    // Re-mock openai after resetModules so the fresh import picks up the mock
    jest.mock('openai')
    const { default: MockOpenAI } = await import('openai')
    ;(MockOpenAI as any).prototype.chat = {
      completions: { create: jest.fn().mockResolvedValue(mockStream) },
    }

    const { POST } = await import('@/app/api/yishi/stream/route')
    const req = new Request('http://localhost/api/yishi/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '如何面對困境', figureSlug: 'xin-qiji' }),
    })
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/plain')
    const text = await res.text()
    expect(text).toBe('艱難困苦')
  })
})
