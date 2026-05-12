// =========================================================
// Browser-side Supabase client
// Use this in Client Components ('use client') only.
// Reads/writes the session via cookies that the middleware syncs.
// =========================================================

'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
