// =========================================================
// POST /api/admin/create-agent
// Admin-only: creates a Supabase Auth user + agent record.
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
    const fd = await req.formData()
    const supabase = getServiceClient()

    const name = String(fd.get('name') || '').trim()
    const loginEmail = String(fd.get('loginEmail') || '').trim().toLowerCase()
    const contactEmail = String(fd.get('contactEmail') || '').trim() || null
    const password = String(fd.get('password') || '')
    const bio = String(fd.get('bio') || '').trim()
    const role = String(fd.get('role') || '').trim()
    const instagram = String(fd.get('instagram') || '').trim() || null
    const linkedin = String(fd.get('linkedin') || '').trim() || null

    if (!name || !loginEmail || !password || !role || !bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Cap at 20 agents
    const { count: agentCount } = await supabase
      .from('agents')
      .select('id', { count: 'exact', head: true })
    if ((agentCount ?? 0) >= 20) {
      return NextResponse.json(
        { error: 'Maximum of 20 agents reached. Delete an existing agent first.' },
        { status: 400 }
      )
    }

    // Unique slug
    let slug = toSlug(name)
    const { data: existingSlugs } = await supabase
      .from('agents')
      .select('slug')
      .like('slug', `${slug}%`)
    if (existingSlugs && existingSlugs.length > 0) {
      const slugSet = new Set(existingSlugs.map((r) => r.slug))
      let candidate = slug
      let i = 2
      while (slugSet.has(candidate)) {
        candidate = `${slug}-${i++}`
      }
      slug = candidate
    }

    // Upload photo if provided
    let photo_url: string | null = null
    const photo = fd.get('photo') as File | null
    if (photo && photo.size > 0) {
      const ext = photo.name.split('.').pop() || 'jpg'
      const path = `agents/${slug}-${Date.now()}.${ext}`
      const buf = await photo.arrayBuffer()
      const { error: upErr } = await supabase.storage
        .from('agent-photos')
        .upload(path, buf, { contentType: photo.type || 'image/jpeg' })
      if (upErr) {
        console.error('Photo upload failed:', upErr)
        return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 })
      }
      const { data: pub } = supabase.storage.from('agent-photos').getPublicUrl(path)
      photo_url = pub.publicUrl
    }

    // Create the auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: loginEmail,
      password,
      email_confirm: true, // skip confirmation email
    })
    if (authErr || !authData.user) {
      console.error('Auth user create failed:', authErr)
      return NextResponse.json(
        { error: authErr?.message || 'Could not create auth user' },
        { status: 500 }
      )
    }

    // Insert the agent record
    const { error: insertErr } = await supabase.from('agents').insert({
      auth_user_id: authData.user.id,
      slug,
      name,
      email: loginEmail,
      contact_email: contactEmail,
      bio,
      role,
      instagram,
      linkedin,
      photo_url,
    })

    if (insertErr) {
      // Rollback the auth user if agent insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      console.error('Agent insert failed:', insertErr)
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, slug })
  } catch (err: any) {
    console.error('create-agent error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
