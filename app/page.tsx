// =========================================================
// Homepage — Hero + Featured Roster + Building Careers
// + Artists Worldwide (map with real artist regions) + Footer
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

interface ArtistRegion {
  name: string
  region: string
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

/**
 * Convert a location name from the DB to the region key the map expects.
 * Map uses lowercase, hyphenated keys; DB stores proper-case names.
 * Returns null if the location doesn't correspond to a map region.
 */
function locationToRegionKey(name: string): string | null {
  const normalized = name.trim().toLowerCase()
  switch (normalized) {
    case 'uk':
    case 'united kingdom':
      return 'uk'
    case 'europe':
      return 'europe'
    case 'north america':
      return 'north-america'
    case 'south america':
      return 'south-america'
    case 'asia':
      return 'asia'
    case 'africa':
    case 'south africa':
      return 'africa'
    case 'oceania':
    case 'australia':
      return 'oceania'
    default:
      return null
  }
}

/**
 * Fetch all non-archived artists with their associated locations.
 * Each artist may have multiple locations; we emit one ArtistRegion
 * entry per (artist, region) pair so the map counts everywhere they operate.
 */
async function getArtistRegions(): Promise<ArtistRegion[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('artists')
    .select(`
      name,
      artist_locations ( locations ( name ) )
    `)
    .eq('archived', false)

  if (error || !data) return []

  const result: ArtistRegion[] = []

  data.forEach((a: any) => {
    const locations = (a.artist_locations || [])
      .map((al: any) => al.locations?.name)
      .filter(Boolean) as string[]

    // Deduplicate the regions for this artist (in case multiple locations
    // map to the same region) so we don't double-count.
    const regions = new Set<string>()
    locations.forEach((loc) => {
      const region = locationToRegionKey(loc)
      if (region) regions.add(region)
    })

    regions.forEach((region) => {
      result.push({ name: a.name, region })
    })
  })

  return result
}

export default async function Page() {
  const [featuredArtists, artistRegions] = await Promise.all([
    getFeaturedArtists(),
    getArtistRegions(),
  ])

  return (
    <main className="bg-black">
      <Navigation />
      <HeroSection />
      <FeaturedRoster artists={featuredArtists} />
      <BuildingCareers />
      <ArtistMap artists={artistRegions} />
      <Footer />
    </main>
  )
}