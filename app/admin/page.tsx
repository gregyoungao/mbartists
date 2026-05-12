// =========================================================
// /admin — overview page with counts
// =========================================================

import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const supabase = getServiceClient()

  const [
    { count: artistCount },
    { count: archivedArtistCount },
    { count: agentCount },
    { count: enquiryCount },
    { count: genreCount },
    { count: locationCount },
  ] = await Promise.all([
    supabase.from('artists').select('id', { count: 'exact', head: true }).eq('archived', false),
    supabase.from('artists').select('id', { count: 'exact', head: true }).eq('archived', true),
    supabase.from('agents').select('id', { count: 'exact', head: true }),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('genres').select('id', { count: 'exact', head: true }),
    supabase.from('locations').select('id', { count: 'exact', head: true }),
  ])

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// Overview'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        <StatCard label="Active Artists" value={artistCount ?? 0} href="/admin/artists" />
        <StatCard label="Agents" value={agentCount ?? 0} href="/admin/agents" />
        <StatCard
          label="New Enquiries"
          value={enquiryCount ?? 0}
          href="/admin/enquiries"
          highlight={(enquiryCount ?? 0) > 0}
        />
        <StatCard label="Archived" value={archivedArtistCount ?? 0} href="/admin/artists?archived=1" />
        <StatCard label="Genres" value={genreCount ?? 0} href="/admin/taxonomies" />
        <StatCard label="Locations" value={locationCount ?? 0} href="/admin/taxonomies" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction
          title="Add Artist"
          subtitle="Create a new artist profile"
          href="/admin/artists/new"
        />
        <QuickAction
          title="Add Agent"
          subtitle="Onboard a new team member"
          href="/admin/agents/new"
        />
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string
  value: number
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className="block p-6 border transition-colors"
      style={{
        borderColor: highlight ? '#4E7DFE' : '#1a1a1a',
        background: highlight ? 'rgba(78, 125, 254, 0.05)' : '#080808',
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-wider mb-3"
        style={{ color: highlight ? '#4E7DFE' : '#444' }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-bold"
        style={{ color: highlight ? '#4E7DFE' : '#fff' }}
      >
        {value}
      </p>
    </Link>
  )
}

function QuickAction({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <Link
      href={href}
      className="block p-6 border transition-all duration-200 hover:border-[#4E7DFE] group"
      style={{ borderColor: '#222', background: '#0a0a0a' }}
    >
      <h3 className="font-bold text-xl mb-1 group-hover:text-[#4E7DFE]">{title}</h3>
      <p className="font-mono text-xs" style={{ color: '#666' }}>
        {subtitle}
      </p>
      <p className="font-mono text-xs mt-4" style={{ color: '#4E7DFE' }}>
        Create →
      </p>
    </Link>
  )
}
