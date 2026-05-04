export interface Poem {
  title: string
  content: string
  source?: string
}

export interface Figure {
  slug: string
  name: string
  era: string
  tags: string[]
  bio: string
  poems: Poem[]
  systemPrompt: string
}

export interface CouncilMessage {
  figureSlug: string
  figureName: string
  figureEra: string
  content: string
  streaming: boolean
}

export interface SavedPoem {
  id: string
  title: string
  content: string
  figures: string[]   // figure slugs
  created_at: string
}
