// =========================================================
// /dashboard/enquiries — agent sees enquiries for THEIR artists
// =========================================================

import Link from 'next/link'
import { requireAgent } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import EnquiryCard, { type EnquiryData } from '@/components/enquiry/EnquiryCard'

export const dynamic = 'force-dynamic'

export default async function DashboardEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const user = await requireAgent()
  const params = await searchParams
  const filter = params.filter === 'handled' ? 'handled' : params.filter === 'all' ? 'all' : 'new'

  const supabase = getServiceClient()

  let query = supabase
    .from('enquiries')
    .select(`
      id, name, email, organization, event_location, event_name,
      proposed_offer, ticket_price, event_date, message, status, created_at,
      artists ( name )
    `)
    .eq('primary_agent_id', user.agentId)
    .order('created_at', { ascending: false })

  if (filter !== 'all') {
    query = query.eq('status', filter)
  }

  const { data: rows } = await query

  const enquiries: EnquiryData[] = (rows || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    organization: r.organization,
    event_location: r.event_location,
    event_name: r.event_name,
    proposed_offer: r.proposed_offer,
    ticket_price: r.ticket_price,
    event_date: r.event_date,
    message: r.message,
    status: r.status,
    created_at: r.created_at,
    artistName: r.artists?.name || 'Unknown artist',
    agentName: null, // agent already knows it's theirs
  }))

  // New count for this agent
  const { count: newCount } = await supabase
    .from('enquiries')
    .select('id', { count: 'exact', head: true })
    .eq('primary_agent_id', user.agentId)
    .eq('status', 'new')

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// Enquiries'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
        Inbox
      </h1>
      <p className="font-mono text-xs mb-8" style={{ color: '#666' }}>
        Booking enquiries for artists where you are the primary agent.
      </p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        <FilterTab label="New" href="/dashboard/enquiries?filter=new" active={filter === 'new'} badge={newCount || 0} />
        <FilterTab label="Handled" href="/dashboard/enquiries?filter=handled" active={filter === 'handled'} />
        <FilterTab label="All" href="/dashboard/enquiries?filter=all" active={filter === 'all'} />
      </div>

      {enquiries.length === 0 ? (
        <div
          className="p-12 border text-center"
          style={{ borderColor: '#222', background: '#0a0a0a' }}
        >
          <p style={{ color: '#666' }}>
            {filter === 'new'
              ? 'No new enquiries for your artists right now.'
              : filter === 'handled'
              ? 'No handled enquiries yet.'
              : 'No enquiries yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {enquiries.map((enquiry) => (
            <EnquiryCard key={enquiry.id} enquiry={enquiry} />
          ))}
        </div>
      )}
    </section>
  )
}

function FilterTab({
  label,
  href,
  active,
  badge,
}: {
  label: string
  href: string
  active: boolean
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-colors flex items-center gap-2"
      style={{
        borderColor: active ? '#4E7DFE' : '#222',
        background: active ? '#4E7DFE' : 'transparent',
        color: active ? '#000' : '#888',
      }}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span
          className="font-mono text-[10px] px-1.5 py-0.5 rounded-full"
          style={{
            background: active ? '#000' : '#4E7DFE',
            color: active ? '#4E7DFE' : '#000',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
