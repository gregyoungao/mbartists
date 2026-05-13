// =========================================================
// /dashboard — agent's personal roster (primary + secondary)
// =========================================================

import Link from 'next/link'
import { requireAgent } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import DashboardArtistRowActions from './DashboardArtistRowActions'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>
}) {
  const user = await requireAgent()
  const params = await searchParams
  const showArchived = params.archived === '1'

  const supabase = getServiceClient()

  // Fetch artists where this agent is primary OR secondary
  const { data: artists } = await supabase
    .from('artists')
    .select(`
      id, slug, name, image_url, featured_artist, academy_artist, archived,
      primary_agent_id, secondary_agent_id,
      primary_agent:agents!primary_agent_id (name),
      secondary_agent:agents!secondary_agent_id (name)
    `)
    .or(`primary_agent_id.eq.${user.agentId},secondary_agent_id.eq.${user.agentId}`)
    .eq('archived', showArchived)
    .order('name', { ascending: true })

  const primaryCount = (artists || []).filter((a) => a.primary_agent_id === user.agentId).length
  const secondaryCount = (artists || []).filter((a) => a.secondary_agent_id === user.agentId).length

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
        <div>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: '#4E7DFE' }}
          >
            {showArchived ? '// Archived' : '// My Roster'}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {showArchived ? 'Archive' : 'Artists'}
          </h1>
          {!showArchived && (
            <p className="font-mono text-xs mt-3" style={{ color: '#666' }}>
              {primaryCount} as primary · {secondaryCount} as secondary
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href={showArchived ? '/dashboard' : '/dashboard?archived=1'}
            className="font-mono text-xs uppercase tracking-widest px-4 py-3 border transition-colors hover:border-[#4E7DFE]"
            style={{ borderColor: '#222', color: '#888' }}
          >
            {showArchived ? 'Show Active' : 'Show Archive'}
          </Link>
          {!showArchived && (
            <Link
              href="/dashboard/artists/new"
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors"
              style={{ background: '#4E7DFE', color: '#000' }}
            >
              + Add Artist
            </Link>
          )}
        </div>
      </div>

      {!artists || artists.length === 0 ? (
        <div
          className="p-12 border text-center"
          style={{ borderColor: '#222', background: '#0a0a0a' }}
        >
          <p style={{ color: '#666' }}>
            {showArchived
              ? 'No archived artists.'
              : 'You don\'t have any artists yet.'}
          </p>
          {!showArchived && (
            <Link
              href="/dashboard/artists/new"
              className="font-mono text-xs uppercase tracking-widest mt-6 inline-block"
              style={{ color: '#4E7DFE' }}
            >
              Add your first artist →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((a: any) => {
            const isPrimary = a.primary_agent_id === user.agentId
            return (
              <div
                key={a.id}
                className="border overflow-hidden flex flex-col"
                style={{ borderColor: '#1a1a1a' }}
              >
                <div
                  className="aspect-square relative"
                  style={{
                    backgroundImage: a.image_url ? `url(${a.image_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    background: a.image_url ? undefined : '#111',
                  }}
                >
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {a.featured_artist && (
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider px-2 py-1"
                        style={{ background: '#4E7DFE', color: '#000' }}
                      >
                        Featured
                      </span>
                    )}
                    {a.academy_artist && (
                      <span
                        className="font-mono text-[9px] uppercase tracking-wider px-2 py-1"
                        style={{ background: '#fff', color: '#000' }}
                      >
                        Academy
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider px-2 py-1"
                      style={{
                        background: isPrimary ? 'rgba(78, 125, 254, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        color: isPrimary ? '#4E7DFE' : '#aaa',
                      }}
                    >
                      {isPrimary ? 'Primary' : 'Secondary'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg truncate">{a.name}</h3>
                  {!isPrimary && a.primary_agent?.name && (
                    <p className="font-mono text-[10px] mb-4 truncate" style={{ color: '#666' }}>
                      Primary: {a.primary_agent.name}
                    </p>
                  )}
                  <div className="mt-auto">
                    <DashboardArtistRowActions
                      artistId={a.id}
                      artistName={a.name}
                      archived={a.archived}
                      isPrimary={isPrimary}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
