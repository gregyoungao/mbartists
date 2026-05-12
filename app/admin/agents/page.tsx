// =========================================================
// /admin/agents — list of all agents with edit/delete actions
// =========================================================

import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'
import { getRoleLabel } from '@/lib/roles'
import AgentRowActions from './AgentRowActions'

export const dynamic = 'force-dynamic'

export default async function AdminAgentsPage() {
  const supabase = getServiceClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, slug, name, contact_email, email, role, role_order, photo_url')
    .order('role_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
        <div>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: '#4E7DFE' }}
          >
            {'// Agents'}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Roster
          </h1>
          <p className="font-mono text-xs mt-3" style={{ color: '#666' }}>
            {agents?.length || 0} of 20 agent slots used
          </p>
        </div>
        <Link
          href="/admin/agents/new"
          className="font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors inline-flex items-center justify-center"
          style={{ background: '#4E7DFE', color: '#000' }}
        >
          + Add Agent
        </Link>
      </div>

      {!agents || agents.length === 0 ? (
        <div
          className="p-12 border text-center"
          style={{ borderColor: '#222', background: '#0a0a0a' }}
        >
          <p style={{ color: '#666' }}>No agents yet.</p>
          <Link
            href="/admin/agents/new"
            className="font-mono text-xs uppercase tracking-widest mt-6 inline-block"
            style={{ color: '#4E7DFE' }}
          >
            Add the first agent →
          </Link>
        </div>
      ) : (
        <div className="border" style={{ borderColor: '#1a1a1a' }}>
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              className="flex items-center gap-4 p-4 border-b transition-colors hover:bg-white/[0.02]"
              style={{
                borderColor: i === agents.length - 1 ? 'transparent' : '#1a1a1a',
              }}
            >
              {/* Photo */}
              <div
                className="w-12 h-12 flex-shrink-0 border"
                style={{
                  borderColor: '#222',
                  backgroundImage: agent.photo_url ? `url(${agent.photo_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  background: agent.photo_url ? undefined : '#1a1a1a',
                }}
              />

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{agent.name}</p>
                <p
                  className="font-mono text-[10px] truncate"
                  style={{ color: '#666' }}
                >
                  {agent.contact_email || agent.email || '—'}
                </p>
              </div>

              {/* Role */}
              <div className="hidden md:block">
                <p
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border"
                  style={{
                    borderColor: '#4E7DFE',
                    color: '#4E7DFE',
                  }}
                >
                  {getRoleLabel(agent.role)}
                </p>
              </div>

              {/* Actions */}
              <AgentRowActions agentId={agent.id} agentName={agent.name} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
