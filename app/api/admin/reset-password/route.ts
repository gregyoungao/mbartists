// =========================================================
// POST /api/admin/reset-password
// Admin-only: generates a new password for an agent.
// Returns the password once so admin can communicate it.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

function generatePassword(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  let result = ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  for (let i = 0; i < length; i++) result += chars[arr[i] % chars.length]
  return result
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { agentId, customPassword } = await req.json()
    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 })

    const supabase = getServiceClient()
    const { data: agent } = await supabase
      .from('agents')
      .select('auth_user_id')
      .eq('id', agentId)
      .maybeSingle()
    if (!agent?.auth_user_id) {
      return NextResponse.json({ error: 'Agent has no linked auth user' }, { status: 400 })
    }

    const password = customPassword || generatePassword()
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 chars' }, { status: 400 })
    }

    const { error } = await supabase.auth.admin.updateUserById(agent.auth_user_id, { password })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, password })
  } catch (err: any) {
    console.error('reset-password error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
