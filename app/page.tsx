import { getAllFigures } from '@/lib/figures'
import FigureCard from '@/components/FigureCard'
import PoemBanner from '@/components/PoemBanner'

export default function HomePage() {
  const figures = getAllFigures()

  const bannerPoems = figures
    .flatMap(f => f.poems.map(p => ({ ...p, figureName: f.name })))
    .slice(0, 8)

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-widest mb-2">賽博先賢祠</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          困頓時，聆先賢之訓，得壯志之詩
        </p>
        <a href="/yishi" className="btn-gold inline-block mt-4">召喚議事廳</a>
      </div>

      {bannerPoems.length > 0 && <PoemBanner poems={bannerPoems} />}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {figures.map(f => (
          <FigureCard key={f.slug} figure={f} />
        ))}
      </div>
    </div>
  )
}
