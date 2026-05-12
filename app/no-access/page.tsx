// =========================================================
// /no-access
// Shown when an authenticated user has no admin or agent record,
// or when an agent tries to visit /admin (or vice versa).
// =========================================================

import Navigation from '@/components/nav/Navigation'

export default function NoAccessPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: '#ff6666' }}
          >
            {'// Access Denied'}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            No access
          </h1>
          <p className="text-lg mb-12" style={{ color: '#666' }}>
            You don't have permission to view this page.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="font-mono text-xs uppercase tracking-widest px-6 py-3 border w-full sm:w-auto transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
                style={{ borderColor: '#444', color: '#888' }}
              >
                Sign Out
              </button>
            </form>
            <a
              href="/"
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE] inline-flex items-center justify-center"
              style={{ borderColor: '#444', color: '#888' }}
            >
              Go to homepage
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
