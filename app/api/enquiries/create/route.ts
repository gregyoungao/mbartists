// =========================================================
// POST /api/enquiries/create
// Public endpoint — anyone can submit a booking enquiry.
// Looks up the artist's primary agent and attaches it.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      artistId,
      name,
      email,
      organization,
      eventLocation,
      eventName,
      proposedOffer,
      ticketPrice,
      eventDate,
      message,
    } = body

    // Validate required fields
    if (!artistId || !name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, artist, and message are required.' },
        { status: 400 }
      )
    }
    if (!organization?.trim() || !eventLocation?.trim()) {
      return NextResponse.json(
        { error: 'Company name and location are required.' },
        { status: 400 }
      )
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    // Look up the artist to get the primary agent (so the enquiry routes correctly)
    const { data: artist } = await supabase
      .from('artists')
      .select('id, primary_agent_id, archived')
      .eq('id', artistId)
      .maybeSingle()

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found.' }, { status: 404 })
    }
    if (artist.archived) {
      return NextResponse.json(
        { error: 'This artist is not currently available for booking.' },
        { status: 400 }
      )
    }

    // Insert the enquiry
    const { error: insertErr } = await supabase.from('enquiries').insert({
      artist_id: artist.id,
      primary_agent_id: artist.primary_agent_id,
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim(),
      event_location: eventLocation.trim(),
      event_name: eventName?.trim() || null,
      proposed_offer: proposedOffer?.trim() || null,
      ticket_price: ticketPrice?.trim() || null,
      event_date: eventDate || null,
      message: message.trim(),
      status: 'new',
    })

    if (insertErr) {
      console.error('enquiry insert error:', insertErr)
      return NextResponse.json(
        { error: 'Could not save your enquiry. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('create enquiry error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
