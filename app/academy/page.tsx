// =========================================================
// /academy — public academy roster listing
// Server component: fetches non-archived academy artists,
// passes them to the same ArtistsView used by /artists.
// =========================================================

import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import ArtistsView from '@/components/artists/ArtistsView'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export interface PublicArtist {
  slug: string
  name: string
  image: string
  genres: string[]
  locations: string[]
}

async function getAcademyArtists(): Promise<PublicArtist[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url,
      artist_genres ( genres ( name ) ),
      artist_locations ( locations ( name ) )
    `)
    .eq('archived', false)
    .eq('academy_artist', true)
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map((a: any) => ({
    slug: a.slug,
    name: a.name,
    image: a.image_url || '/placeholder-artist.jpg',
    genres: (a.artist_genres || [])
      .map((ag: any) => ag.genres?.name)
      .filter(Boolean),
    locations: (a.artist_locations || [])
      .map((al: any) => al.locations?.name)
      .filter(Boolean),
  }))
}

export default async function AcademyPage() {
  const artists = await getAcademyArtists()

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <ArtistsView artists={artists} />
      <Footer />
    </main>
  )
}
