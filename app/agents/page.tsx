// =========================================================
// /agents — public agents listing
// Server component: fetches agents + roster counts, sorted by seniority.
// =========================================================

import Navigation from '@/components/nav/Navigation'
import AgentsView from '@/components/agents/AgentsView'
import { getServiceClient } from '@/lib/supabase'
import { getRoleLabel } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export interface PublicAgent {
  slug: string
  name: string
  photo: string
  email: string
  roles: string[]
  bio: string
  rosterCount: number
}

async function getAgents(): Promise<PublicAgent[]> {
  const supabase = getServiceClient()

  // Get all agents ordered by seniority (role_order ascending)
  const { data: agents, error } = await supabase
    .from('agents')
    .select('id, slug, name, photo_url, contact_email, role, bio, role_order')
    .order('role_order', { ascending: true })
    .order('name', { ascending: true })

  if (error || !agents) return []

  // Get all non-archived artists to compute roster counts
  const { data: artists } = await supabase
    .from('artists')
    .select('primary_agent_id, secondary_agent_id')
    .eq('archived', false)

  const countFor = (agentId: string) =>
    (artists || []).filter(
      (a) =>
        a.primary_agent_id === agentId || a.secondary_agent_id === agentId
    ).length

  return agents.map((a: any) => ({
    slug: a.slug,
    name: a.name,
    photo: a.photo_url || '/placeholder-artist.jpg',
    email: a.contact_email || '',
    roles: a.role ? [getRoleLabel(a.role)] : [],
    bio: a.bio || '',
    rosterCount: countFor(a.id),
  }))
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <AgentsView agents={agents} />
    </main>
  )
}
