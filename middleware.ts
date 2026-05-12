// =========================================================
// Next.js Middleware
//
// Two jobs:
//   1. Refresh the Supabase auth session on every request
//      (keeps the user logged in for ~30 days as cookies refresh)
//   2. Protect /admin/* and /dashboard/* routes
//      - logged out → redirect to /login
//      - role check happens in the page itself (via requireAdmin/requireAgent)
//
// This file MUST live at the project root (next to package.json),
// NOT in /app or /lib.
// =========================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes session if needed
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /admin and /dashboard routes
  const isProtected =
    path.startsWith('/admin') || path.startsWith('/dashboard')

  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and visiting /login, redirect them to their dashboard
  if (path === '/login' && user) {
    // Check role to decide where to send them
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (adminRow) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const { data: agentRow } = await supabase
      .from('agents')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (agentRow) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/no-access', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - Public asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
