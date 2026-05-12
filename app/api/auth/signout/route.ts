// =========================================================
// POST /api/auth/signout
// Clears the session and redirects to /login.
// =========================================================

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  const url = new URL('/login', request.url)
  return NextResponse.redirect(url, { status: 303 })
}
