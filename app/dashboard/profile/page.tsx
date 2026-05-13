// =========================================================
// /dashboard/profile — agent's own profile
// =========================================================

import { requireAgent } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import { getRoleLabel } from '@/lib/roles'
import ProfileForm from './ProfileForm'
import ChangePasswordForm from './ChangePasswordForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await requireAgent()
  const supabase = getServiceClient()

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', user.agentId)
    .maybeSingle()

  if (!agent) {
    return (
      <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
        <p style={{ color: '#ff6666' }}>Could not load your agent profile.</p>
      </section>
    )
  }

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// My Profile'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        {agent.name}
      </h1>
      <p className="font-mono text-xs mb-12" style={{ color: '#666' }}>
        {getRoleLabel(agent.role)} · {user.email}
      </p>

      <ProfileForm
        initial={{
          name: agent.name,
          contactEmail: agent.contact_email || '',
          bio: agent.bio || '',
          instagram: agent.instagram || '',
          linkedin: agent.linkedin || '',
          photoUrl: agent.photo_url,
        }}
      />

      <div className="mt-16 pt-12 border-t max-w-2xl" style={{ borderColor: '#1a1a1a' }}>
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: '#4E7DFE' }}
        >
          {'// Change Password'}
        </p>
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>
        <ChangePasswordForm />
      </div>

      <div className="mt-16 pt-12 border-t max-w-2xl" style={{ borderColor: '#1a1a1a' }}>
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: '#666' }}
        >
          {'// Account Info'}
        </p>
        <p style={{ color: '#888' }} className="text-sm">
          Your login email and role are managed by an admin. To change them, contact your administrator.
        </p>
      </div>
    </section>
  )
}
