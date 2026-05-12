// =========================================================
// /admin/agents/new — create a new agent
// =========================================================

import Link from 'next/link'
import AgentForm from '@/components/admin/AgentForm'

export const dynamic = 'force-dynamic'

export default function NewAgentPage() {
  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <Link
        href="/admin/agents"
        className="font-mono text-xs uppercase tracking-widest mb-8 inline-block"
        style={{ color: '#666' }}
      >
        ← Back to Agents
      </Link>

      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// New Agent'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        Add Agent
      </h1>

      <AgentForm mode="create" />
    </section>
  )
}
