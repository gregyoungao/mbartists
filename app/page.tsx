// =========================================================
// Homepage — Hero + Featured Roster + Building Careers
// + Artists Worldwide (map) + Footer
// =========================================================

import HeroSection from '@/components/hero/HeroSection'
import ArtistMap from '@/components/map/ArtistMap'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import FeaturedRoster from '@/components/roster/FeaturedRoster'
import BuildingCareers from '@/components/sections/BuildingCareers'
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

  const { data, error } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url,
      artist_genres ( genres ( name ) )
    `)
    .eq('archived', false)
    .eq('featured_artist', true)

  if (error || !data) return []

  const mapped: FeaturedArtist[] = data.map((a: any) => ({
    slug: a.slug,
    name: a.name,
    image: a.image_url || '/placeholder-artist.jpg',
    genres: (a.artist_genres || [])
      .map((ag: any) => ag.genres?.name)
      .filter(Boolean),
  }))

  // Shuffle and take 10
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[mapped[i], mapped[j]] = [mapped[j], mapped[i]]
  }

  return mapped.slice(0, 10)
}

export default async function Page() {
  const featuredArtists = await getFeaturedArtists()

  return (
    <main className="bg-black">
      <Navigation />
      <HeroSection />
      <FeaturedRoster artists={featuredArtists} />
      <BuildingCareers />

      {/* Artists Worldwide — wraps existing ArtistMap with a heading */}
      <section className="relative py-20 md:py-28" style={{ background: '#000' }}>
        <div className="px-6 md:px-12 mb-12 text-center">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: '#4E7DFE' }}
          >
            {'// Global Reach'}
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ color: '#fff' }}
          >
            Artists Worldwide
          </h2>
          <p
            className="font-mono text-xs tracking-wider"
            style={{ color: '#666' }}
          >
            Brighter regions indicate more artists — hover to explore
          </p>
        </div>
        <ArtistMap />
      </section>

      <Footer />
    </main>
  )
}
