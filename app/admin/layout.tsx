// =========================================================
// Admin Layout
// Wraps every /admin/* page with sidebar nav + auth check.
// =========================================================

import { requireAdmin } from '@/lib/auth'
import AdminSidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <AdminSidebar userEmail={user.email} />
        <main className="flex-1 ml-0 md:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
