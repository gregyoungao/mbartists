// =========================================================
// /artists — public roster listing
// Server component: fetches non-archived artists with their
// primary genre, all genres, and locations, then passes to ArtistsView.
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
  /** Names of all genres assigned to the artist */
  genres: string[]
  /** Name of the artist's PRIMARY genre, or null if not set */
  primaryGenre: string | null
  locations: string[]
}

async function getArtists(): Promise<PublicArtist[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url, primary_genre_id,
      artist_genres ( genres ( id, name ) ),
      artist_locations ( locations ( name ) )
    `)
    .eq('archived', false)
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map((a: any) => {
    const allGenres: { id: string; name: string }[] = (a.artist_genres || [])
      .map((ag: any) => ag.genres)
      .filter(Boolean)

    const primary =
      a.primary_genre_id
        ? allGenres.find((g) => g.id === a.primary_genre_id) || null
        : null

    return {
      slug: a.slug,
      name: a.name,
      image: a.image_url || '/placeholder-artist.jpg',
      genres: allGenres.map((g) => g.name),
      primaryGenre: primary?.name ?? null,
      locations: (a.artist_locations || [])
        .map((al: any) => al.locations?.name)
        .filter(Boolean),
    }
  })
}

export default async function ArtistsPage() {
  const artists = await getArtists()

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <ArtistsView artists={artists} />
      <Footer />
    </main>
  )
}