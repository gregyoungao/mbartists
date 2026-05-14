// =========================================================
// Homepage — fetches 10 random featured artists from Supabase
// =========================================================

import HeroSection from '@/components/hero/HeroSection'
import ArtistMap from '@/components/map/ArtistMap'
import Navigation from '@/components/nav/Navigation'
import FeaturedRoster from '@/components/roster/FeaturedRoster'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface FeaturedArtist {
  slug: string
  name: string
  image: string
  genres: string[]
}

async function getFeaturedArtists(): Promise<FeaturedArtist[]> {
  const supabase = getServiceClient()

  // Get all non-archived, featured artists with their genres
  const { data, error } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url,
      artist_genres ( genres ( name ) )
    `)
    .eq('archived', false)
    .eq('featured_artist', true)

  if (error || !data) return []

  // Map to the shape FeaturedRoster expects
  const mapped: FeaturedArtist[] = data.map((a: any) => ({
    slug: a.slug,
    name: a.name,
    image: a.image_url || '/placeholder-artist.jpg',
    genres: (a.artist_genres || [])
      .map((ag: any) => ag.genres?.name)
      .filter(Boolean),
  }))

  // Shuffle (Fisher-Yates) and take 10
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[mapped[i], mapped[j]] = [mapped[j], mapped[i]]
  }

  return mapped.slice(0, 10)
}

export default async function Page() {
  const featuredArtists = await getFeaturedArtists()

  return (
    <main>
      <Navigation />
      <HeroSection />
      <FeaturedRoster artists={featuredArtists} />
      <ArtistMap />
    </main>
  )
}
