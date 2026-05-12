// =========================================================
// POST /api/admin/delete-artist
// Soft delete (archive), restore, or hard delete.
// Admins only.
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
    const { artistId, action } = await req.json()
    if (!artistId || !action) {
      return NextResponse.json({ error: 'artistId and action required' }, { status: 400 })
    }

    const supabase = getServiceClient()

    if (action === 'archive') {
      const { error } = await supabase
        .from('artists')
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq('id', artistId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (action === 'restore') {
      const { error } = await supabase
        .from('artists')
        .update({ archived: false, archived_at: null })
        .eq('id', artistId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (action === 'hard_delete') {
      const { error } = await supabase.from('artists').delete().eq('id', artistId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('delete-artist error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
