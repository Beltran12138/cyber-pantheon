import type { Figure, Poem } from '@/types'
import { getFigureBySlug, getAllFigures, getDefaultCouncil } from '@/lib/figures'

describe('Figure type', () => {
  it('accepts a valid figure object', () => {
    const fig: Figure = {
      slug: 'xin-qiji',
      name: '辛弃疾',
      era: '南宋',
      tags: ['詞人', '武將'],
      bio: '南宋豪放派詞人，武將出身，一生力主北伐。',
      poems: [{ title: '永遇樂·京口北固亭懷古', content: '千古江山', source: '稼軒詞' }],
      systemPrompt: '你是辛弃疾。',
    }
    expect(fig.slug).toBe('xin-qiji')
  })
})

describe('getFigureBySlug', () => {
  it('returns figure for valid slug', () => {
    const fig = getFigureBySlug('xin-qiji')
    expect(fig).not.toBeNull()
    expect(fig?.name).toBe('辛棄疾')
  })

  it('returns null for unknown slug', () => {
    expect(getFigureBySlug('nobody')).toBeNull()
  })
})

describe('getAllFigures', () => {
  it('returns at least 15 figures', () => {
    expect(getAllFigures().length).toBeGreaterThanOrEqual(15)
  })
})

describe('getDefaultCouncil', () => {
  it('returns 5 slugs', () => {
    expect(getDefaultCouncil().length).toBe(5)
  })
})
