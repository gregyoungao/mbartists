// =========================================================
// POST /api/admin/manage-taxonomy
// Admin-only: create/update/delete genres and locations.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient, toSlug } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { taxonomy, action, id, name } = await req.json()
    if (!['genres', 'locations'].includes(taxonomy)) {
      return NextResponse.json({ error: 'Invalid taxonomy' }, { status: 400 })
    }

    const supabase = getServiceClient()

    if (action === 'create') {
      if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
      const slug = toSlug(name.trim())
      const { error } = await supabase.from(taxonomy).insert({ name: name.trim(), slug })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (action === 'update') {
      if (!id || !name?.trim()) return NextResponse.json({ error: 'id and name required' }, { status: 400 })
      // Don't change slug on edit (avoid breaking existing references)
      const { error } = await supabase.from(taxonomy).update({ name: name.trim() }).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
      const { error } = await supabase.from(taxonomy).delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('manage-taxonomy error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
