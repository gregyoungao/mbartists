"use client"

// =========================================================
// components/agents/AgentDetailView.tsx
// Renders the public agent profile:
//   - Hero: photo + "All Agents" gray back button
//   - Intro: name + // Connect & Contact + socials (LEFT)
//            | bio (RIGHT)
//   - Section divider
//   - // Artist Roster grid (6-col responsive)
//   - "View All Artists" button (centered, blue)
// All hover effects via Tailwind CSS — no JS handlers needed.
// =========================================================

import Image from 'next/image'
import Link from 'next/link'
import type { AgentDetail } from '@/app/agents/[slug]/page'

interface Props {
  agent: AgentDetail
}

/** Initials from a name, e.g. "Paul Sandilands" → "PS" */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function AgentDetailView({ agent }: Props) {
  return (
    <main className="relative z-20">
      {/* ───────── Hero ───────── */}
      <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
        <Image
          src={agent.photo}
          alt={agent.name}
          fill
          className="object-cover"
          priority
        />

        {/* "All Agents" back button — bottom-left, gray */}
        <div className="absolute bottom-8 left-8">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-colors duration-200 hover:bg-white"
            style={{ background: '#d9d9d9', color: '#000' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M9 3L3 9M3 3v6h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>All Agents</span>
          </Link>
        </div>
      </section>

      {/* ───────── Intro: name + contact (LEFT) | bio (RIGHT) ───────── */}
      <section className="px-20 max-w-[1280px] mx-auto pt-14 pb-16 border-b border-[#1a1a1a]">
        <div className="grid gap-12 items-start grid-cols-1 lg:grid-cols-[minmax(0,680px)_1fr]">
          {/* LEFT — name + Connect & Contact + socials */}
          <div className="max-w-[680px]">
            <h1
              className="font-bold tracking-tight mb-8 break-words"
              style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              {agent.name}
            </h1>

            <p
              className="font-mono text-xs tracking-widest uppercase mb-4"
              style={{ color: '#4E7DFE' }}
            >
              {'// Connect & Contact'}
            </p>

            <div className="flex flex-wrap gap-[18px]">
              {agent.instagram && (
                <a
                  href={agent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {agent.linkedin && (
                <a
                  href={agent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  aria-label="Email"
                  className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT — bio */}
          <div>
            {agent.bio && (
              <p
                className="leading-[1.7]"
                style={{ fontSize: '14px', color: '#aaa' }}
              >
                {agent.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ───────── Artist Roster ───────── */}
      <section className="px-20 max-w-[1280px] mx-auto pt-14 pb-24">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-7"
          style={{ color: '#4E7DFE' }}
        >
          {'// Artist Roster'}
        </p>

        {agent.roster.length === 0 ? (
          <p className="font-mono text-sm py-8" style={{ color: '#666' }}>
            No artists yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {agent.roster.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(78,125,254,0.3)]">
                  {artist.image && artist.image !== '/placeholder-artist.jpg' ? (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 200px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center font-mono text-xl"
                      style={{
                        background:
                          'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)',
                        color: '#444',
                      }}
                    >
                      {initials(artist.name)}
                    </div>
                  )}

                  {/* Bottom gradient for legibility */}
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

                  {/* Name + genre overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <div className="font-bold text-sm leading-tight text-white mb-1">
                      {artist.name}
                    </div>
                    {artist.genres[0] && (
                      <div
                        className="font-mono uppercase tracking-[0.15em]"
                        style={{ fontSize: '10px', color: '#4E7DFE' }}
                      >
                        {artist.genres[0]}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Artists button — centered */}
        <div className="flex justify-center mt-12">
          <Link
            href="/artists"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest px-7 py-3.5 transition-all duration-200
                       bg-[#4E7DFE] text-black
                       hover:bg-black hover:text-[#4E7DFE]
                       hover:shadow-[inset_0_0_0_1px_#4E7DFE]"
          >
            <span>View All Artists</span>
            <span>{'>'}</span>
          </Link>
        </div>
      </section>
    </main>
  )
}