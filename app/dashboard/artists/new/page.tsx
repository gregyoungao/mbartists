// =========================================================
// /dashboard/artists/new — agent creates a new artist
// =========================================================

import Link from 'next/link'
import { requireAgent } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import ArtistForm from '@/components/admin/ArtistForm'

export const dynamic = 'force-dynamic'

export default async function NewArtistByAgentPage() {
  const user = await requireAgent()
  const supabase = getServiceClient()

  // Get all agents (for the secondary-agent dropdown)
  const [{ data: agents }, { data: genres }, { data: locations }] = await Promise.all([
    supabase.from('agents').select('id, name').order('role_order').order('name'),
    supabase.from('genres').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <Link
        href="/dashboard"
        className="font-mono text-xs uppercase tracking-widest mb-8 inline-block"
        style={{ color: '#666' }}
      >
        ← Back to My Roster
      </Link>

      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// New Artist'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Add Artist
      </h1>
      <p className="font-mono text-xs mb-12" style={{ color: '#666' }}>
        You will be assigned as the primary agent automatically.
      </p>

      <ArtistForm
        mode="create"
        agents={agents || []}
        genres={genres || []}
        locations={locations || []}
        initial={{
          primaryAgentId: user.agentId!, // pre-fill with current agent
        }}
        lockPrimaryAgent={true}
      />
    </section>
  )
}
