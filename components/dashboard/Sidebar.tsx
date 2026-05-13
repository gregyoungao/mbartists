'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'My Roster', href: '/dashboard', icon: '♫' },
  { label: 'Profile', href: '/dashboard/profile', icon: '◉' },
  { label: 'Enquiries', href: '/dashboard/enquiries', icon: '✉' },
]

export default function DashboardSidebar({
  agentName,
  agentEmail,
}: {
  agentName: string
  agentEmail: string
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 border font-mono text-xs"
        style={{ borderColor: '#4E7DFE', color: '#4E7DFE', background: '#000' }}
      >
        {mobileOpen ? 'CLOSE' : 'MENU'}
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40 border-r overflow-y-auto
          transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ borderColor: '#1a1a1a', background: '#050505' }}
      >
        <div className="p-6 border-b" style={{ borderColor: '#1a1a1a' }}>
          <Link href="/" className="block">
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-1"
              style={{ color: '#4E7DFE' }}
            >
              {'// MB Artists'}
            </p>
            <h2 className="font-bold text-xl tracking-tight truncate">{agentName}</h2>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors"
                style={{
                  color: isActive ? '#4E7DFE' : '#888',
                  background: isActive ? 'rgba(78, 125, 254, 0.08)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? '#4E7DFE' : 'transparent'}`,
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: '#1a1a1a' }}
        >
          <p className="font-mono text-[10px] truncate mb-3" style={{ color: '#444' }}>
            {agentEmail}
          </p>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full font-mono text-xs uppercase tracking-widest py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
              style={{ borderColor: '#222', color: '#666' }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
