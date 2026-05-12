// =========================================================
// /admin/artists/new — create a new artist
// =========================================================

import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'
import ArtistForm from '@/components/admin/ArtistForm'

export const dynamic = 'force-dynamic'

export default async function NewArtistPage() {
  const supabase = getServiceClient()
  const [{ data: agents }, { data: genres }, { data: locations }] = await Promise.all([
    supabase.from('agents').select('id, name').order('role_order').order('name'),
    supabase.from('genres').select('id, name').order('name'),
    supabase.from('locations').select('id, name').order('name'),
  ])

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
        {'// New Artist'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        Add Artist
      </h1>

      {(agents?.length || 0) === 0 ? (
        <div
          className="p-8 border max-w-2xl"
          style={{ borderColor: '#ff6666', background: '#0a0000' }}
        >
          <p style={{ color: '#ff9999' }} className="mb-4">
            You need at least one agent before you can create an artist.
          </p>
          <Link
            href="/admin/agents/new"
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: '#4E7DFE' }}
          >
            Create an agent →
          </Link>
        </div>
      ) : (
        <ArtistForm
          mode="create"
          initial={{}}
          agents={agents || []}
          genres={genres || []}
          locations={locations || []}
        />
      )}
    </section>
  )
}
