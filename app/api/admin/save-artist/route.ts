// =========================================================
// POST /api/admin/save-artist
// Create or update an artist record.
// Admin or assigned agent can save.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient, toSlug } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const fd = await req.formData()
    const supabase = getServiceClient()
    const artistId = (fd.get('artistId') as string) || null

    const name = String(fd.get('name') || '').trim()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const primaryAgentId = String(fd.get('primaryAgentId') || '').trim() || null
    const secondaryAgentId = String(fd.get('secondaryAgentId') || '').trim() || null
    if (!primaryAgentId) {
      return NextResponse.json({ error: 'Primary agent is required' }, { status: 400 })
    }

    // For agents (not admins), check they're allowed to assign this artist
    if (user.role === 'agent') {
      // Agents can only create/edit artists where they are primary or secondary
      if (
        primaryAgentId !== user.agentId &&
        secondaryAgentId !== user.agentId
      ) {
        return NextResponse.json(
          { error: 'You can only create or edit your own artists' },
          { status: 403 }
        )
      }
    }

    // For updates, verify the artist exists and the user has rights
    let existingSlug: string | null = null
    let existingImageUrl: string | null = null
    if (artistId) {
      const { data: existing } = await supabase
        .from('artists')
        .select('id, slug, image_url, primary_agent_id, secondary_agent_id')
        .eq('id', artistId)
        .maybeSingle()
      if (!existing) return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
      existingSlug = existing.slug
      existingImageUrl = existing.image_url

      if (user.role === 'agent' &&
          existing.primary_agent_id !== user.agentId &&
          existing.secondary_agent_id !== user.agentId) {
        return NextResponse.json({ error: 'Not authorized to edit this artist' }, { status: 403 })
      }
    }

    // Build / generate slug
    let slug = existingSlug
    if (!slug) {
      slug = toSlug(name)
      const { data: existingSlugs } = await supabase
        .from('artists')
        .select('slug')
        .like('slug', `${slug}%`)
      if (existingSlugs && existingSlugs.length > 0) {
        const set = new Set(existingSlugs.map((r) => r.slug))
        let candidate = slug
        let i = 2
        while (set.has(candidate)) candidate = `${slug}-${i++}`
        slug = candidate
      }
    }

    // Handle image upload
    let image_url = existingImageUrl
    const image = fd.get('image') as File | null
    if (image && image.size > 0) {
      const ext = image.name.split('.').pop() || 'jpg'
      const path = `artists/${slug}-${Date.now()}.${ext}`
      const buf = await image.arrayBuffer()
      const { error: upErr } = await supabase.storage
        .from('artist-images')
        .upload(path, buf, { contentType: image.type || 'image/jpeg' })
      if (upErr) {
        console.error('Image upload error:', upErr)
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
      }
      const { data: pub } = supabase.storage.from('artist-images').getPublicUrl(path)
      image_url = pub.publicUrl
    }

    // Validate image present for create
    if (!artistId && !image_url) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    const payload = {
      slug: slug!,
      name,
      image_url,
      primary_agent_id: primaryAgentId,
      secondary_agent_id: secondaryAgentId,
      small_bio: String(fd.get('smallBio') || '').trim() || null,
      large_bio: String(fd.get('largeBio') || '').trim() || null,
      academy_artist: fd.get('academyArtist') === 'true',
      featured_artist: fd.get('featuredArtist') === 'true',
      instagram: String(fd.get('instagram') || '').trim() || null,
      spotify: String(fd.get('spotify') || '').trim() || null,
      soundcloud: String(fd.get('soundcloud') || '').trim() || null,
      facebook: String(fd.get('facebook') || '').trim() || null,
      tiktok: String(fd.get('tiktok') || '').trim() || null,
      spotlight_1: String(fd.get('spotlight1') || '').trim() || null,
      spotlight_2: String(fd.get('spotlight2') || '').trim() || null,
      spotlight_3: String(fd.get('spotlight3') || '').trim() || null,
      spotlight_4: String(fd.get('spotlight4') || '').trim() || null,
      updated_at: new Date().toISOString(),
    }

    let savedId = artistId
    if (artistId) {
      const { error: upErr } = await supabase.from('artists').update(payload).eq('id', artistId)
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('artists')
        .insert(payload)
        .select('id')
        .single()
      if (insErr || !inserted) {
        console.error('Insert error:', insErr)
        return NextResponse.json({ error: insErr?.message || 'Insert failed' }, { status: 500 })
      }
      savedId = inserted.id
    }

    // Replace genre + location associations
    const genreIds: string[] = JSON.parse(String(fd.get('genres') || '[]'))
    const locationIds: string[] = JSON.parse(String(fd.get('locations') || '[]'))

    await supabase.from('artist_genres').delete().eq('artist_id', savedId)
    await supabase.from('artist_locations').delete().eq('artist_id', savedId)

    if (genreIds.length) {
      await supabase
        .from('artist_genres')
        .insert(genreIds.map((genre_id) => ({ artist_id: savedId, genre_id })))
    }
    if (locationIds.length) {
      await supabase
        .from('artist_locations')
        .insert(locationIds.map((location_id) => ({ artist_id: savedId, location_id })))
    }

    return NextResponse.json({ ok: true, id: savedId, slug })
  } catch (err: any) {
    console.error('save-artist error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
