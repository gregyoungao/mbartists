// =========================================================
// POST /api/agent/change-password
// Agent changes their own password. Requires current password.
// =========================================================

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    // Verify the current password by re-authenticating
    const supabase = await createSupabaseServerClient()
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (verifyErr) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Update the password (service role bypasses RLS)
    const admin = getServiceClient()
    const { error: updateErr } = await admin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('change-password error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
