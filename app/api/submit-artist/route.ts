// =========================================================
// POST /api/submit-artist
// Receives multipart form data from /submit, uploads image
// to Supabase Storage, inserts pending Artist row + tags.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient, toSlug } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const fd = await req.formData()
    const supabase = getServiceClient()

    const name = String(fd.get('name') || '').trim()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    // ---- Build a unique slug ----
    let slug = toSlug(name)
    const { data: existing } = await supabase
      .from('artists')
      .select('slug')
      .like('slug', `${slug}%`)
    if (existing && existing.length > 0) {
      const slugs = new Set(existing.map((r) => r.slug))
      let i = 2
      let candidate = slug
      while (slugs.has(candidate)) {
        candidate = `${slug}-${i++}`
      }
      slug = candidate
    }

    // ---- Upload image to Supabase Storage ----
    let image_url: string | null = null
    const image = fd.get('image') as File | null
    if (image && image.size > 0) {
      const ext = image.name.split('.').pop() || 'jpg'
      const path = `artists/${slug}-${Date.now()}.${ext}`
      const arrayBuffer = await image.arrayBuffer()

      const { error: uploadErr } = await supabase.storage
        .from('artist-images')
        .upload(path, arrayBuffer, {
          contentType: image.type || 'image/jpeg',
          upsert: false,
        })
      if (uploadErr) {
        console.error('Upload error:', uploadErr)
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
      }

      const { data: pub } = supabase.storage.from('artist-images').getPublicUrl(path)
      image_url = pub.publicUrl
    }

    // ---- Insert artist row ----
    const primary_agent_id = (fd.get('primary_agent_id') as string) || null
    const secondary_agent_id = (fd.get('secondary_agent_id') as string) || null

    const insertPayload = {
      slug,
      name,
      image_url,
      primary_agent_id: primary_agent_id || null,
      secondary_agent_id: secondary_agent_id || null,
      small_bio: String(fd.get('small_bio') || '') || null,
      large_bio: String(fd.get('large_bio') || '') || null,
      academy_artist: fd.get('academy_artist') === 'true',
      featured_artist: fd.get('featured_artist') === 'true',
      instagram: String(fd.get('instagram') || '') || null,
      spotify: String(fd.get('spotify') || '') || null,
      soundcloud: String(fd.get('soundcloud') || '') || null,
      facebook: String(fd.get('facebook') || '') || null,
      tiktok: String(fd.get('tiktok') || '') || null,
      spotlight_1: String(fd.get('spotlight_1') || '') || null,
      spotlight_2: String(fd.get('spotlight_2') || '') || null,
      spotlight_3: String(fd.get('spotlight_3') || '') || null,
      spotlight_4: String(fd.get('spotlight_4') || '') || null,
      status: 'pending' as const,
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('artists')
      .insert(insertPayload)
      .select('id')
      .single()

    if (insertErr || !inserted) {
      console.error('Insert error:', insertErr)
      return NextResponse.json({ error: 'Could not save artist' }, { status: 500 })
    }

    // ---- Attach genres + locations ----
    const genreIds: string[] = JSON.parse(String(fd.get('genres') || '[]'))
    const locationIds: string[] = JSON.parse(String(fd.get('locations') || '[]'))

    if (genreIds.length) {
      await supabase.from('artist_genres').insert(
        genreIds.map((genre_id) => ({ artist_id: inserted.id, genre_id }))
      )
    }
    if (locationIds.length) {
      await supabase.from('artist_locations').insert(
        locationIds.map((location_id) => ({ artist_id: inserted.id, location_id }))
      )
    }

    return NextResponse.json({ ok: true, slug })
  } catch (err: any) {
    console.error('submit-artist error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
