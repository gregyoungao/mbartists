// =========================================================
// POST /api/admin/delete-agent
// Admin-only: deletes agent record + auth user.
// Their artists become orphaned (primary_agent_id = NULL).
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { agentId } = await req.json()
    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 })

    const supabase = getServiceClient()

    const { data: agent } = await supabase
      .from('agents')
      .select('id, auth_user_id')
      .eq('id', agentId)
      .maybeSingle()
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    // Delete agent record (artists' agent FKs will set to null due to schema)
    const { error: delErr } = await supabase.from('agents').delete().eq('id', agentId)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    // Delete the auth user
    if (agent.auth_user_id) {
      await supabase.auth.admin.deleteUser(agent.auth_user_id)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('delete-agent error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
