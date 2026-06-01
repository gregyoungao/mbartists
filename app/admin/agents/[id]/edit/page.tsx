// =========================================================
// /admin/agents/[id]/edit — edit an existing agent
// =========================================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServiceClient } from '@/lib/supabase'
import AgentForm from '@/components/admin/AgentForm'
import ResetPasswordButton from './ResetPasswordButton'

export const dynamic = 'force-dynamic'

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = getServiceClient()

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!agent) notFound()

  // Get auth user email for the login email field
  let loginEmail = agent.email || ''
  if (agent.auth_user_id) {
    const { data: { user } } = await supabase.auth.admin.getUserById(agent.auth_user_id)
    if (user?.email) loginEmail = user.email
  }

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
        {'// Edit Agent'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        {agent.name}
      </h1>

      <AgentForm
        mode="edit"
        initial={{
          id: agent.id,
          name: agent.name,
          loginEmail,
          contactEmail: agent.contact_email || '',
          bio: agent.bio || '',
          role: agent.role || '',
          instagram: agent.instagram || '',
          linkedin: agent.linkedin || '',
          photoUrl: agent.photo_url,
          photoFocusY: agent.photo_focus_y ?? 50,
        }}
      />

      {agent.auth_user_id && (
        <div className="mt-16 pt-12 border-t max-w-2xl" style={{ borderColor: '#1a1a1a' }}>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: '#ff6666' }}
          >
            {'// Danger Zone'}
          </p>
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <p style={{ color: '#666' }} className="mb-6">
            Generate a new password for this agent. Share it with them through a secure channel — they should change it after first login.
          </p>
          <ResetPasswordButton agentId={agent.id} />
        </div>
      )}
    </section>
  )
}