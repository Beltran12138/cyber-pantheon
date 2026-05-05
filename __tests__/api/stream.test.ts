jest.mock('openai')

describe('POST /api/yishi/stream validation', () => {
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
})
