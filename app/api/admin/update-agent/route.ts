// =========================================================
// POST /api/admin/update-agent
// Admin-only: updates an existing agent record.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { getRoleOrder } from '@/lib/roles'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const fd = await req.formData()
    const supabase = getServiceClient()

    const agentId = String(fd.get('agentId') || '')
    if (!agentId) return NextResponse.json({ error: 'agentId is required' }, { status: 400 })

    const { data: existing } = await supabase
      .from('agents')
      .select('id, slug, photo_url')
      .eq('id', agentId)
      .maybeSingle()
    if (!existing) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

    // Handle photo update
    let photo_url = existing.photo_url
    const photo = fd.get('photo') as File | null
    if (photo && photo.size > 0) {
      const ext = photo.name.split('.').pop() || 'jpg'
      const path = `agents/${existing.slug}-${Date.now()}.${ext}`
      const buf = await photo.arrayBuffer()
      const { error: upErr } = await supabase.storage
        .from('agent-photos')
        .upload(path, buf, { contentType: photo.type || 'image/jpeg' })
      if (upErr) {
        return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 })
      }
      const { data: pub } = supabase.storage.from('agent-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }

    // Parse focal point — clamped to 0-100, default 50
    const focusYRaw = fd.get('photoFocusY')
    let photo_focus_y = 50
    if (focusYRaw !== null && focusYRaw !== '') {
      const n = parseInt(String(focusYRaw), 10)
      if (!Number.isNaN(n)) {
        photo_focus_y = Math.max(0, Math.min(100, n))
      }
    }

    const role = String(fd.get('role') || '').trim()

    const updates: any = {
      name: String(fd.get('name') || '').trim(),
      contact_email: String(fd.get('contactEmail') || '').trim() || null,
      bio: String(fd.get('bio') || '').trim(),
      role,
      // Keep role_order in lockstep with role — calculated from the canonical
      // mapping in lib/roles.ts. Never set role without also setting this.
      role_order: getRoleOrder(role),
      instagram: String(fd.get('instagram') || '').trim() || null,
      linkedin: String(fd.get('linkedin') || '').trim() || null,
      photo_url,
      photo_focus_y,
    }

    const { error: updateErr } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', agentId)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('update-agent error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}