// =========================================================
// Supabase Client + Data Fetching
// =========================================================

import { createClient } from '@supabase/supabase-js'

// PUBLIC client — safe to use in browser (anon key, RLS-enforced)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ADMIN client — server-only. Bypasses RLS. NEVER import in client components.
export function getServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

// =========================================================
// TYPES
// =========================================================

export interface Genre {
  id: string
  slug: string
  name: string
}

export interface Location {
  id: string
  slug: string
  name: string
}

export interface Agent {
  id: string
  slug: string
  name: string
  email: string | null
  contact_email: string | null
  bio: string | null
  photo_url: string | null
  role: string | null
  role_order: number | null
  instagram: string | null
  linkedin: string | null
}

export interface Artist {
  id: string
  slug: string
  name: string
  image_url: string | null
  primary_agent: Agent | null
  secondary_agent: Agent | null
  small_bio: string | null
  large_bio: string | null
  academy_artist: boolean
  featured_artist: boolean
  instagram: string | null
  spotify: string | null
  soundcloud: string | null
  facebook: string | null
  tiktok: string | null
  spotlight_1: string | null
  spotlight_2: string | null
  spotlight_3: string | null
  spotlight_4: string | null
  genres: Genre[]
  locations: Location[]
}

// =========================================================
// FETCH FUNCTIONS
// =========================================================

const ARTIST_SELECT = `
  id, slug, name, image_url,
  small_bio, large_bio,
  academy_artist, featured_artist,
  instagram, spotify, soundcloud, facebook, tiktok,
  spotlight_1, spotlight_2, spotlight_3, spotlight_4,
  primary_agent:agents!primary_agent_id (id, slug, name, email, contact_email, bio, photo_url, role, role_order, instagram, linkedin),
  secondary_agent:agents!secondary_agent_id (id, slug, name, email, contact_email, bio, photo_url, role, role_order, instagram, linkedin),
  artist_genres ( genres ( id, slug, name ) ),
  artist_locations ( locations ( id, slug, name ) )
`

function shapeArtist(row: any): Artist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    image_url: row.image_url,
    small_bio: row.small_bio,
    large_bio: row.large_bio,
    academy_artist: row.academy_artist,
    featured_artist: row.featured_artist,
    instagram: row.instagram,
    spotify: row.spotify,
    soundcloud: row.soundcloud,
    facebook: row.facebook,
    tiktok: row.tiktok,
    spotlight_1: row.spotlight_1,
    spotlight_2: row.spotlight_2,
    spotlight_3: row.spotlight_3,
    spotlight_4: row.spotlight_4,
    primary_agent: row.primary_agent || null,
    secondary_agent: row.secondary_agent || null,
    genres: (row.artist_genres || []).map((g: any) => g.genres).filter(Boolean),
    locations: (row.artist_locations || []).map((l: any) => l.locations).filter(Boolean),
  }
}

export async function getAllArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select(ARTIST_SELECT)
    .order('name', { ascending: true })

  if (error) {
    console.error('getAllArtists error:', error)
    return []
  }
  return (data || []).map(shapeArtist)
}

export async function getFeaturedArtists(): Promise<Artist[]> {
  const { data, error } = await supabase
    .from('artists')
    .select(ARTIST_SELECT)
    .eq('featured_artist', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('getFeaturedArtists error:', error)
    return []
  }
  return (data || []).map(shapeArtist)
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const { data, error } = await supabase
    .from('artists')
    .select(ARTIST_SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('getArtistBySlug error:', error)
    return null
  }
  return data ? shapeArtist(data) : null
}

export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('role_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })
  if (error) return []
  return data || []
}

export async function getAllGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name', { ascending: true })
  if (error) return []
  return data || []
}

export async function getAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true })
  if (error) return []
  return data || []
}

// =========================================================
// HELPERS
// =========================================================

export function getArtistSpotlights(artist: Artist): string[] {
  return [
    artist.spotlight_1,
    artist.spotlight_2,
    artist.spotlight_3,
    artist.spotlight_4,
  ].filter(Boolean) as string[]
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
