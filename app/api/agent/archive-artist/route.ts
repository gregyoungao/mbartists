// =========================================================
// POST /api/agent/archive-artist
// Agent archives or restores an artist (primary agent only).
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'agent' || !user.agentId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { artistId, action } = await req.json()
    if (!artistId || !action) {
      return NextResponse.json({ error: 'artistId and action required' }, { status: 400 })
    }
    if (!['archive', 'restore'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Verify the agent is the primary on this artist
    const { data: artist } = await supabase
      .from('artists')
      .select('primary_agent_id')
      .eq('id', artistId)
      .maybeSingle()

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }
    if (artist.primary_agent_id !== user.agentId) {
      return NextResponse.json(
        { error: 'Only the primary agent can archive this artist' },
        { status: 403 }
      )
    }

    const updates = action === 'archive'
      ? { archived: true, archived_at: new Date().toISOString() }
      : { archived: false, archived_at: null }

    const { error } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', artistId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('archive-artist error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
