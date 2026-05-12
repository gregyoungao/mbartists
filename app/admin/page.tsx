import { requireAdmin } from '@/lib/auth'
import Navigation from '@/components/nav/Navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await requireAdmin()

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: '#4E7DFE' }}
          >
            {'// Admin Dashboard'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Hello,
          </h1>
          <p className="text-lg mb-12" style={{ color: '#666' }}>
            You are logged in as <span style={{ color: '#4E7DFE' }}>{user.email}</span>.
          </p>

          <div className="space-y-4 mb-12">
            <Stat label="Role" value="Admin" />
            <Stat label="User ID" value={user.id} mono />
            <Stat label="Admin Record ID" value={user.adminId || '—'} mono />
          </div>

          <div
            className="p-6 border"
            style={{ borderColor: '#222', background: '#0a0a0a' }}
          >
            <p
              className="font-mono text-xs tracking-widest uppercase mb-3"
              style={{ color: '#4E7DFE' }}
            >
              {'// Coming Soon'}
            </p>
            <p style={{ color: '#888' }}>
              The full admin dashboard (manage agents, artists, genres, locations) will appear here in Step 3.
            </p>
          </div>

          <form action="/api/auth/signout" method="post" className="mt-12">
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
              style={{ borderColor: '#444', color: '#888' }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      className="flex items-center justify-between p-4 border"
      style={{ borderColor: '#1a1a1a', background: '#080808' }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-wider"
        style={{ color: '#444' }}
      >
        {label}
      </span>
      <span
        className={mono ? 'font-mono text-xs' : 'font-bold'}
        style={{ color: '#fff' }}
      >
        {value}
      </span>
    </div>
  )
}
