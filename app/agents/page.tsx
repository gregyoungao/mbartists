// =========================================================
// app/agents/page.tsx
// Public agent roster page — 6-col grid (responsive: 2/3/4/6)
// Server component, sorted by role_order then name
// =========================================================

import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Agent {
  id: string
  slug: string
  name: string
  role: string | null
  photo_url: string | null
}

async function getAgents(): Promise<Agent[]> {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('agents')
    .select('id, slug, name, role, photo_url, role_order')
    // Most senior first (lower role_order = more senior). Nulls fall to the end.
    .order('role_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error || !data) return []
  return data
}

/** Initials from name, e.g. "Paul Sandilands" → "PS" */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function AgentsPage() {
  const agents = await getAgents()

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation />

      {/* Title section — mirrors the artist roster header style */}
      <section className="px-20 max-w-[1280px] mx-auto pt-32 pb-16">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: '#4E7DFE' }}
        >
          {'// Our Team'}
        </p>
        <h1
          className="font-bold tracking-tight mb-5 leading-none"
          style={{ fontSize: 'clamp(48px, 6vw, 84px)', letterSpacing: '-0.02em' }}
        >
          MB Agents
        </h1>
        <p className="text-base md:text-lg max-w-[600px]" style={{ color: '#888' }}>
          The team that supports our incredible roster of artists
        </p>
      </section>

      {/* 6-column agent grid */}
      <section className="px-20 max-w-[1280px] mx-auto pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.slug}`}
              className="group block"
            >
              {/* Photo with name + role overlay at bottom */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(78,125,254,0.3)]">
                {agent.photo_url ? (
                  <Image
                    src={agent.photo_url}
                    alt={agent.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 200px"
                  />
                ) : (
                  /* Fallback when no photo — show initials on dark gradient */
                  <div
                    className="absolute inset-0 flex items-center justify-center font-mono text-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)',
                      color: '#444',
                    }}
                  >
                    {initials(agent.name)}
                  </div>
                )}

                {/* Bottom gradient so name reads on light photos */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)',
                  }}
                />

                {/* Corner accents on hover */}
                <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-transparent group-hover:border-[#4E7DFE] transition-colors duration-300" />
                <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-transparent group-hover:border-[#4E7DFE] transition-colors duration-300" />
                <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-transparent group-hover:border-[#4E7DFE] transition-colors duration-300" />
                <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-transparent group-hover:border-[#4E7DFE] transition-colors duration-300" />

                {/* Name + role overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <div className="font-bold text-sm leading-tight text-white mb-1">
                    {agent.name}
                  </div>
                  {agent.role && (
                    <div
                      className="font-mono uppercase tracking-[0.15em]"
                      style={{ fontSize: '10px', color: '#4E7DFE' }}
                    >
                      {agent.role}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {agents.length === 0 && (
          <p className="text-center font-mono text-sm py-16" style={{ color: '#666' }}>
            No agents yet.
          </p>
        )}
      </section>

      <Footer />
    </main>
  )
}