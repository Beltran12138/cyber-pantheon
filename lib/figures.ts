import figuresData from '@/data/figures.json'
import type { Figure } from '@/types'

const figures = figuresData as Figure[]

export function getAllFigures(): Figure[] {
  return figures
}

export function getFigureBySlug(slug: string): Figure | null {
  return figures.find(f => f.slug === slug) ?? null
}

const DEFAULT_COUNCIL = ['xin-qiji', 'yu-qian', 'li-guang-yao', 'ma-si-ke', 'tu-ling']

export function getDefaultCouncil(): string[] {
  return DEFAULT_COUNCIL.filter(slug => getFigureBySlug(slug) !== null)
}

export function getFiguresBySlug(slugs: string[]): Figure[] {
  const seen = new Set<string>()
  return slugs
    .filter(s => { if (seen.has(s)) return false; seen.add(s); return true })
    .map(s => getFigureBySlug(s))
    .filter((f): f is Figure => f !== null)
}
