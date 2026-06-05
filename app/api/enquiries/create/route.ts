// =========================================================
// POST /api/enquiries/create
// =========================================================
// 1. Validates and saves a booking enquiry to the DB.
// 2. Sends an email to the artist's primary agent, with
//    support@mbartists.co.uk CC'd for visibility.
// 3. Email sending is best-effort — if it fails, the enquiry
//    is still saved and the form still reports success.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

const SUPPORT_EMAIL = 'support@mbartists.co.uk'
// Resend requires the From address to use a verified domain. Once you've
// verified mbartists.co.uk in Resend's dashboard, this address works.
// Until then, you can use 'onboarding@resend.dev' (sender) for testing.
const FROM_EMAIL = 'MB Artists <enquiries@mbartists.co.uk>'

const ADMIN_ENQUIRIES_URL = 'https://mbartists.vercel.app/admin/enquiries'

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    // Look up artist + primary agent. We need the artist name (for the email
    // subject/body) and the primary agent's id (to route the enquiry).
    const { data: artist } = await supabase
      .from('artists')
      .select('id, name, primary_agent_id, archived')
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

    // Look up the primary agent's email + name so we can address them
    // directly in the notification. Prefer contact_email over email.
    let agentEmail: string | null = null
    let agentName: string | null = null
    if (artist.primary_agent_id) {
      const { data: agent } = await supabase
        .from('agents')
        .select('name, email, contact_email')
        .eq('id', artist.primary_agent_id)
        .maybeSingle()
      if (agent) {
        const preferred = (agent.contact_email || agent.email || '').trim()
        agentEmail = preferred || null
        agentName = agent.name || null
      }
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

    // ====== Email notification (best-effort) ======
    // Don't block the response on email — even if Resend is down or the API
    // key is missing, the enquiry is already saved and visible in /admin.
    try {
      await sendEnquiryNotification({
        artistName: artist.name,
        agentEmail,
        agentName,
        submitter: {
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          eventLocation: eventLocation.trim(),
          eventName: eventName?.trim() || null,
          proposedOffer: proposedOffer?.trim() || null,
          ticketPrice: ticketPrice?.trim() || null,
          eventDate: eventDate || null,
          message: message.trim(),
        },
      })
    } catch (emailErr) {
      // Log but don't fail the request — the form succeeds either way.
      console.error('Enquiry email send failed (enquiry still saved):', emailErr)
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

// =========================================================
// Helpers
// =========================================================

interface SubmitterData {
  name: string
  email: string
  organization: string
  eventLocation: string
  eventName: string | null
  proposedOffer: string | null
  ticketPrice: string | null
  eventDate: string | null
  message: string
}

/**
 * Sends the enquiry notification email.
 * Recipient logic:
 *   - Primary "to" is the agent (if their email exists)
 *   - Support is CC'd for visibility
 *   - If there's no agent email, support becomes the primary recipient
 *   - If the agent IS support, we don't CC support to avoid duplicates
 *
 * Reply-To is set to the submitter's email so replying goes straight to them.
 */
async function sendEnquiryNotification(params: {
  artistName: string
  agentEmail: string | null
  agentName: string | null
  submitter: SubmitterData
}) {
  const { artistName, agentEmail, agentName, submitter } = params

  // If no email service is configured, log and skip. The enquiry is already
  // saved to the database, so nothing is lost — once the env var is added the
  // emails will start flowing.
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      '[enquiry] RESEND_API_KEY not set — enquiry saved but email not sent. ' +
        'See deployment notes.'
    )
    return
  }

  // Decide who the primary recipient is. Dedupe support if it matches the agent.
  const supportLower = SUPPORT_EMAIL.toLowerCase()
  const agentLower = (agentEmail || '').toLowerCase()
  const to: string[] = agentEmail ? [agentEmail] : [SUPPORT_EMAIL]
  const cc: string[] | undefined =
    agentEmail && agentLower !== supportLower ? [SUPPORT_EMAIL] : undefined

  const subject = `New enquiry for ${artistName} — from ${submitter.name}`
  const html = renderEnquiryHtml({ artistName, agentName, submitter })
  const text = renderEnquiryText({ artistName, agentName, submitter })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      cc,
      reply_to: submitter.email, // Replying goes to the person who enquired
      subject,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`Resend ${res.status}: ${detail}`)
  }
}

/**
 * Lightweight HTML email template. Inline styles only (most email clients
 * strip <style> blocks and don't support external CSS).
 */
function renderEnquiryHtml(params: {
  artistName: string
  agentName: string | null
  submitter: SubmitterData
}): string {
  const { artistName, agentName, submitter } = params

  const ROW = (label: string, value: string | null | undefined) => {
    if (!value) return ''
    return `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#666;font-size:13px;vertical-align:top;white-space:nowrap;">
          ${escapeHtml(label)}
        </td>
        <td style="padding:6px 0;color:#111;font-size:14px;">
          ${escapeHtml(value)}
        </td>
      </tr>`
  }

  const greeting = agentName
    ? `Hi ${escapeHtml(agentName.split(' ')[0])},`
    : 'Hello,'

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">

      <!-- Header -->
      <div style="border-bottom:1px solid #ececea;padding-bottom:16px;margin-bottom:24px;">
        <p style="margin:0;color:#4E7DFE;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-family:'SFMono-Regular',Menlo,monospace;">
          // MB Artists Enquiry
        </p>
        <h1 style="margin:6px 0 0;font-size:24px;color:#111;font-weight:700;">
          New booking enquiry
        </h1>
      </div>

      <!-- Greeting + intro -->
      <p style="margin:0 0 8px;color:#111;font-size:15px;">
        ${greeting}
      </p>
      <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.5;">
        You've received a new booking enquiry for
        <strong>${escapeHtml(artistName)}</strong>.
      </p>

      <!-- Details table -->
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:24px;">
        ${ROW('Submitter', submitter.name)}
        ${ROW('Email', submitter.email)}
        ${ROW('Company', submitter.organization)}
        ${ROW('Event location', submitter.eventLocation)}
        ${ROW('Event name', submitter.eventName)}
        ${ROW('Event date', formatDate(submitter.eventDate))}
        ${ROW('Proposed offer', submitter.proposedOffer)}
        ${ROW('Ticket price', submitter.ticketPrice)}
      </table>

      <!-- Message -->
      <div style="background:#f6f6f4;padding:16px;border-left:3px solid #4E7DFE;margin-bottom:24px;">
        <p style="margin:0 0 6px;color:#666;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-family:'SFMono-Regular',Menlo,monospace;">
          Message
        </p>
        <p style="margin:0;color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap;">
          ${escapeHtml(submitter.message)}
        </p>
      </div>

      <!-- CTA -->
      <p style="margin:0 0 8px;color:#444;font-size:14px;line-height:1.5;">
        Hit reply to respond directly to the submitter, or manage the enquiry in the admin:
      </p>
      <p style="margin:0 0 24px;">
        <a href="${ADMIN_ENQUIRIES_URL}" style="display:inline-block;padding:10px 18px;background:#4E7DFE;color:#fff;text-decoration:none;font-size:13px;font-weight:600;border-radius:2px;">
          Open in admin →
        </a>
      </p>

      <!-- Footer -->
      <hr style="border:none;border-top:1px solid #ececea;margin:24px 0;">
      <p style="margin:0;color:#888;font-size:12px;font-family:'SFMono-Regular',Menlo,monospace;">
        MB Artists Agency
      </p>
    </div>
  </body>
</html>
`.trim()
}

/**
 * Plain-text version for clients that don't render HTML (and for accessibility).
 */
function renderEnquiryText(params: {
  artistName: string
  agentName: string | null
  submitter: SubmitterData
}): string {
  const { artistName, agentName, submitter } = params
  const greeting = agentName ? `Hi ${agentName.split(' ')[0]},` : 'Hello,'

  const lines: string[] = [
    greeting,
    '',
    `You've received a new booking enquiry for ${artistName}.`,
    '',
    `Submitter: ${submitter.name}`,
    `Email: ${submitter.email}`,
    `Company: ${submitter.organization}`,
    `Event location: ${submitter.eventLocation}`,
  ]
  if (submitter.eventName) lines.push(`Event name: ${submitter.eventName}`)
  if (submitter.eventDate) lines.push(`Event date: ${formatDate(submitter.eventDate)}`)
  if (submitter.proposedOffer) lines.push(`Proposed offer: ${submitter.proposedOffer}`)
  if (submitter.ticketPrice) lines.push(`Ticket price: ${submitter.ticketPrice}`)
  lines.push('', 'Message:', submitter.message, '', `Manage in admin: ${ADMIN_ENQUIRIES_URL}`)
  return lines.join('\n')
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}