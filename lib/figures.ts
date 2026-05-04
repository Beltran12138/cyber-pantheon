import figuresData from '@/data/figures.json'
import type { Figure } from '@/types'

const figures = figuresData as Figure[]

export function getAllFigures(): Figure[] {
  return figures
}

export function getFigureBySlug(slug: string): Figure | null {
  return figures.find(f => f.slug === slug) ?? null
}

export function getDefaultCouncil(): string[] {
  return ['xin-qiji', 'yu-qian', 'li-guang-yao', 'ma-si-ke', 'tu-ling']
}

export function getFiguresBySlug(slugs: string[]): Figure[] {
  return slugs.map(s => getFigureBySlug(s)).filter((f): f is Figure => f !== null)
}
