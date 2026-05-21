// =========================================================
// /agents/[slug] — public individual agent page
// Server component: fetches the agent + their roster.
// =========================================================

import { notFound } from 'next/navigation'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import AgentDetailView from '@/components/agents/AgentDetailView'
import { getServiceClient } from '@/lib/supabase'
import { getRoleLabel } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export interface AgentRosterArtist {
  slug: string
  name: string
  image: string
  genres: string[]
}

export interface AgentDetail {
  name: string
  photo: string
  photoFocusY?: number  // ← ADD THIS LINE
  email: string
  roles: string[]
  bio: string
  instagram?: string
  linkedin?: string
  roster: AgentRosterArtist[]
}

async function getAgent(slug: string): Promise<AgentDetail | null> {
  const supabase = getServiceClient()

  const { data: agent } = await supabase
    .from('agents')
    .select('id, slug, name, photo_url, photo_focus_y, contact_email, role, bio, instagram, linkedin')
    .eq('slug', slug)
    .maybeSingle()

  if (!agent) return null

  const { data: artists } = await supabase
    .from('artists')
    .select(`
      slug, name, image_url,
      artist_genres ( genres ( name ) )
    `)
    .or(`primary_agent_id.eq.${agent.id},secondary_agent_id.eq.${agent.id}`)
    .eq('archived', false)
    .order('name', { ascending: true })

  const roster: AgentRosterArtist[] = (artists || []).map((a: any) => ({
    slug: a.slug,
    name: a.name,
    image: a.image_url || '/placeholder-artist.jpg',
    genres: (a.artist_genres || [])
      .map((ag: any) => ag.genres?.name)
      .filter(Boolean),
  }))

  return {
    name: agent.name,
    photo: agent.photo_url || '/placeholder-artist.jpg',
    photoFocusY: agent.photo_focus_y ?? 50,
    email: agent.contact_email || '',
    roles: agent.role ? [getRoleLabel(agent.role)] : [],
    bio: agent.bio || '',
    instagram: agent.instagram || undefined,
    linkedin: agent.linkedin || undefined,
    roster,
  }
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const agent = await getAgent(slug)

  if (!agent) notFound()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <AgentDetailView agent={agent} />
      <Footer />
    </div>
  )
}
