"use client"

// =========================================================
// components/agents/AgentDetailView.tsx
// Renders the public agent profile:
//   - Hero: photo + focal point + "All Agents" back button flush to corner
//   - Margins match listing pages (px-4 md:px-8, max-w-7xl)
//   - Artist roster grid styled to match /artists (square, hover-bright, blue glow)
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
          style={{ objectPosition: `center ${agent.photoFocusY ?? 50}%` }}
          priority
        />

        {/* "All Agents" back button — flush to bottom-left corner */}
        <Link
          href="/agents"
          className="absolute bottom-0 left-0 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-colors duration-200 hover:bg-white"
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
      </section>

      {/* ───────── Intro: name + contact (LEFT) | bio (RIGHT) ───────── */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto pt-14 pb-16 border-b border-[#1a1a1a]">
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

            <div className="flex flex-wrap gap-3">
              {agent.instagram && (
                <a
                  href={agent.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
                >
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M276.59,224.85c0,14.39-5.83,27.41-15.16,36.84-9.34,9.42-22.19,15.25-36.24,15.25h-.68c-28.1,0-51.4-23.31-51.4-52.09,0-14.05,5.83-26.9,15.16-36.24,9.34-9.34,22.19-15.16,36.24-15.16h.68c28.1,0,51.4,23.3,51.4,51.4Z" />
                    <path d="M290.3,106.29h-130.9c-29.46,0-53.45,23.99-53.45,53.46v130.21c0,29.46,23.99,53.45,53.45,53.45h130.9c29.47,0,53.45-23.99,53.45-53.45v-130.21c0-29.47-23.98-53.46-53.45-53.46ZM280.19,280.11c-14.22,14.13-33.75,22.87-55,22.87h-.68c-42.49,0-77.44-34.95-77.44-78.13,0-21.24,8.74-40.78,22.79-54.99,14.04-14.22,33.4-23.13,54.65-23.13h.68c42.49,0,78.13,35.63,78.13,78.12,0,21.59-8.91,41.12-23.13,55.26ZM313.52,159.66c-3,3-7.12,4.88-11.57,4.88-4.79,0-8.91-1.88-11.82-4.88-2.91-2.99-4.63-7.11-4.63-11.56s1.72-8.57,4.63-11.57c2.91-3,7.03-4.88,11.82-4.88,8.91,0,16.45,7.54,16.45,16.45,0,4.45-1.88,8.57-4.88,11.56Z" />
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM368.42,290.64c0,42.49-34.95,77.44-77.44,77.44h-132.26c-42.49,0-77.44-34.95-77.44-77.44v-131.58c0-42.49,34.95-77.44,77.44-77.44h132.26c42.49,0,77.44,34.95,77.44,77.44v131.58Z" />
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
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM150.43,349.75h-50.63v-170.04h50.63v170.04ZM124.8,154.71c-16.88,0-30-13.75-30-30.63s13.12-30.63,30-30.63,30.63,13.75,30.63,30.63-13.75,30.63-30.63,30.63ZM349.85,349.75h-50.01v-91.89c-.31-9.69-3.75-18.29-9.53-24.46-5.78-6.18-13.91-9.93-23.6-9.93s-18.6,3.75-25.16,9.93c-6.56,6.17-10.78,14.77-11.1,24.46v91.89h-50.01v-170.04h50.01v23.76c10.63-15.63,28.13-25.63,48.14-25.63h13.75c31.88,0,57.51,26.26,57.51,57.51v114.4Z" />
                  </svg>
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  aria-label="Email"
                  className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
                >
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM342.48,175.39c-6.98,47.89-14.96,95.77-22.94,143.66-3,22.94-14.97,34.91-39.91,20.95l-77.81-54.87c-10.98-8.98-7.98-15.96,1-24.94l71.82-67.84c18.96-18.96,9.98-25.94-11.97-10.97l-98.76,66.84c-13.97,9.97-28.93,9.97-44.89,4.98l-33.92-11.97c-21.95-7.98-4.99-16.96,5.98-21.95,61.86-25.93,136.68-62.84,201.52-87.78,59.86-21.95,58.86-15.97,49.88,43.89Z" />
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
      <section className="px-4 md:px-8 max-w-7xl mx-auto pt-14 pb-24">
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
          /* Grid mirrors /artists styling: square aspect, gap-1, brightness on hover */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {agent.roster.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="group relative aspect-square overflow-hidden block bg-[#050505] hover:bg-[#0a0a0a]"
              >
                {artist.image && artist.image !== '/placeholder-artist.jpg' ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover transition-all duration-500 brightness-75 group-hover:brightness-110 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 220px"
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
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                  }}
                />

                {/* Blue glow on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(78, 125, 254, 0.15) 0%, transparent 70%)',
                  }}
                />

                {/* Artist info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 z-10">
                  <h3 className="font-bold text-sm md:text-base truncate text-[#888] group-hover:text-white transition-colors duration-300">
                    {artist.name}
                  </h3>

                  {/* Show genre on hover */}
                  {artist.genres[0] && (
                    <div className="mt-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span
                        className="font-mono text-[9px] tracking-wider uppercase"
                        style={{ color: '#4E7DFE' }}
                      >
                        {artist.genres[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Corner accent — top right only, like /artists */}
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-transparent group-hover:border-[#4E7DFE] transition-colors duration-300" />
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