// =========================================================
// GET /api/artist-names
// Returns array of all non-archived artist names (uppercase).
// Cached for 5 minutes (revalidate = 300) so it's cheap.
// Used by LogoSymbolCanvas to render the logo with real names.
// =========================================================

import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

// Cache the response on the edge for 5 minutes
export const revalidate = 300

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('artists')
      .select('name')
      .eq('archived', false)
      .order('name', { ascending: true })

    if (error || !data) {
      return NextResponse.json({ names: [] })
    }

    const names = data
      .map((row) => (row.name || '').trim().toUpperCase())
      .filter((n) => n.length > 0)

    return NextResponse.json({ names })
  } catch {
    return NextResponse.json({ names: [] })
  }
}
