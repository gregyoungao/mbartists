// =========================================================
// /admin/artists/[id]/edit
// =========================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServiceClient } from '@/lib/supabase'
import ArtistForm from '@/components/admin/ArtistForm'

export const dynamic = 'force-dynamic'

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = getServiceClient()

  const [{ data: artist }, { data: agents }, { data: genres }, { data: locations }] = await Promise.all([
    supabase
      .from('artists')
      .select(`
        *,
        artist_genres (genre_id),
        artist_locations (location_id)
      `)
      .eq('id', id)
      .maybeSingle(),
    supabase.from('agents').select('id, name').order('role_order').order('name'),
    supabase.from('genres').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  if (!artist) notFound()

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <Link
        href="/admin/artists"
        className="font-mono text-xs uppercase tracking-widest mb-8 inline-block"
        style={{ color: '#666' }}
      >
        ← Back to Artists
      </Link>

      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// Edit Artist'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        {artist.name}
      </h1>

      <ArtistForm
        mode="edit"
        agents={agents || []}
        genres={genres || []}
        locations={locations || []}
        initial={{
          id: artist.id,
          name: artist.name,
          primaryAgentId: artist.primary_agent_id || '',
          secondaryAgentId: artist.secondary_agent_id || '',
          smallBio: artist.small_bio || '',
          largeBio: artist.large_bio || '',
          academyArtist: artist.academy_artist,
          featuredArtist: artist.featured_artist,
          instagram: artist.instagram || '',
          spotify: artist.spotify || '',
          soundcloud: artist.soundcloud || '',
          facebook: artist.facebook || '',
          tiktok: artist.tiktok || '',
          spotlight1: artist.spotlight_1 || '',
          spotlight2: artist.spotlight_2 || '',
          spotlight3: artist.spotlight_3 || '',
          spotlight4: artist.spotlight_4 || '',
          imageUrl: artist.image_url,
          selectedGenres: (artist.artist_genres || []).map((g: any) => g.genre_id),
          selectedLocations: (artist.artist_locations || []).map((l: any) => l.location_id),
        }}
      />
    </section>
  )
}
