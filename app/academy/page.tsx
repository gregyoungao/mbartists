// =========================================================
// /academy — public academy roster listing
// Server component: fetches non-archived academy artists,
// passes them to the same ArtistsView used by /artists.
// =========================================================

import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import ArtistsView from '@/components/artists/ArtistsView'
import { getServiceClient } from '@/lib/supabase'
import type { PublicArtist } from '@/app/artists/page'

export const dynamic = 'force-dynamic'

async function getAcademyArtists(): Promise<PublicArtist[]> {
  const supabase = getServiceClient()

  const { data, error } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url, primary_genre_id,
      artist_genres ( genres ( id, name ) ),
      artist_locations ( locations ( name ) )
    `)
    .eq('archived', false)
    .eq('academy_artist', true)
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map((a: any) => {
    const allGenres: { id: string; name: string }[] = (a.artist_genres || [])
      .map((ag: any) => ag.genres)
      .filter(Boolean)

    const primary = a.primary_genre_id
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

export default async function AcademyPage() {
  const artists = await getAcademyArtists()

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <ArtistsView
        artists={artists}
        title="MB Academy"
        eyebrow="Rising Talent"
      />
      <Footer />
    </main>
  )
}