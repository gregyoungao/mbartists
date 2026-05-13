// =========================================================
// POST /api/agent/update-profile
// Agent updates their own profile (not role, not login email).
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
    const fd = await req.formData()
    const supabase = getServiceClient()

    const { data: existing } = await supabase
      .from('agents')
      .select('id, slug, photo_url')
      .eq('id', user.agentId)
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

    const updates = {
      name: String(fd.get('name') || '').trim(),
      contact_email: String(fd.get('contactEmail') || '').trim() || null,
      bio: String(fd.get('bio') || '').trim() || null,
      instagram: String(fd.get('instagram') || '').trim() || null,
      linkedin: String(fd.get('linkedin') || '').trim() || null,
      photo_url,
    }

    if (!updates.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { error: updateErr } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', user.agentId)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('update-profile error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
