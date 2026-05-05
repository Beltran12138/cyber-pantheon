import { notFound } from 'next/navigation'
import { getFigureBySlug, getAllFigures } from '@/lib/figures'
import FigureDetailClient from './FigureDetailClient'

export function generateStaticParams() {
  return getAllFigures().map(f => ({ slug: f.slug }))
}

export default async function FigurePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const figure = getFigureBySlug(slug)
  if (!figure) notFound()
  return <FigureDetailClient figure={figure} />
}
