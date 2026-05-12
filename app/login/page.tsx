'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import Navigation from '@/components/nav/Navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setSubmitting(false)
      return
    }

    // Figure out where to send them based on role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Login succeeded but no user returned. Try again.')
      setSubmitting(false)
      return
    }

    // If a specific redirectTo was provided, use it
    if (redirectTo) {
      router.push(redirectTo)
      router.refresh()
      return
    }

    // Otherwise check role and route accordingly
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (adminRow) {
      router.push('/admin')
      router.refresh()
      return
    }

    const { data: agentRow } = await supabase
      .from('agents')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (agentRow) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // No role assigned — sign them out and show error
    await supabase.auth.signOut()
    setError('Your account has no role assigned. Contact an administrator.')
    setSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-md mx-auto">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: '#4E7DFE' }}
          >
            {'// Sign In'}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-12">
            Log In
          </h1>

          {error && (
            <div
              className="mb-8 p-4 border"
              style={{ borderColor: '#ff4444', background: '#1a0000' }}
            >
              <p className="font-mono text-sm" style={{ color: '#ff6666' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                className="font-mono text-xs tracking-widest uppercase mb-3 block"
                style={{ color: '#4E7DFE' }}
              >
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent border-b-2 py-3 px-0 font-bold text-xl outline-none transition-colors"
                style={{ borderColor: '#222' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
              />
            </div>

            <div>
              <label
                className="font-mono text-xs tracking-widest uppercase mb-3 block"
                style={{ color: '#4E7DFE' }}
              >
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-transparent border-b-2 py-3 px-0 font-bold text-xl outline-none transition-colors"
                style={{ borderColor: '#222' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-mono text-xs uppercase tracking-widest py-4 transition-colors disabled:opacity-50"
              style={{ background: '#4E7DFE', color: '#000' }}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p
            className="font-mono text-xs mt-12 text-center"
            style={{ color: '#444' }}
          >
            Need access? Contact an administrator.
          </p>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
