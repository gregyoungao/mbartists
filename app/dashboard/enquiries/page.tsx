// =========================================================
// /dashboard/enquiries — agent's inbox placeholder
// =========================================================

import { requireAgent } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function DashboardEnquiriesPage() {
  await requireAgent()

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// Enquiries'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        Inbox
      </h1>

      <div
        className="p-12 border max-w-2xl"
        style={{ borderColor: '#222', background: '#0a0a0a' }}
      >
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: '#4E7DFE' }}
        >
          {'// Coming Soon'}
        </p>
        <p style={{ color: '#888' }}>
          Booking enquiries for your artists will appear here once the public enquiry form is live (Step 6).
        </p>
      </div>
    </section>
  )
}
