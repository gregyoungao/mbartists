// =========================================================
// Dashboard Layout (agents only)
// =========================================================

import { requireAgent } from '@/lib/auth'
import DashboardSidebar from '@/components/dashboard/Sidebar'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAgent()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <DashboardSidebar
          agentName={user.agentName || 'Agent'}
          agentEmail={user.email}
        />
        <main className="flex-1 ml-0 md:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
