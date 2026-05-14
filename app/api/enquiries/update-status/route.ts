// =========================================================
// POST /api/enquiries/update-status
// Admin or the assigned agent can mark an enquiry new/handled.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { enquiryId, status } = await req.json()
    if (!enquiryId || !status) {
      return NextResponse.json(
        { error: 'enquiryId and status are required' },
        { status: 400 }
      )
    }
    if (!['new', 'handled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Fetch the enquiry to check permissions
    const { data: enquiry } = await supabase
      .from('enquiries')
      .select('id, primary_agent_id')
      .eq('id', enquiryId)
      .maybeSingle()

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    // Agents can only update enquiries for their own artists
    if (user.role === 'agent' && enquiry.primary_agent_id !== user.agentId) {
      return NextResponse.json(
        { error: 'You can only update enquiries for your own artists' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', enquiryId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('update-status error:', err)
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}
