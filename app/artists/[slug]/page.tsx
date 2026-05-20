// =========================================================
// app/artists/[slug]/page.tsx
// Artist profile page
//   - Hero: image only (no fade), "All Artists" gray button bottom-left
//   - Intro: name + chips + socials (max 751w) | small bio 14px (min 384h)
//   - Bio + Agents: biography 14px (max 680w) | primary + secondary side-by-side, "Make Enquiry" button below
//   - Spotlight tracks (4-col grid)
// =========================================================

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import FeaturedTracks from '@/components/tracks/FeaturedTracks'
import {
  getAllArtists,
  getArtistBySlug,
  getArtistSpotlights,
} from '@/lib/supabase'

export async function generateStaticParams() {
  const artists = await getAllArtists()
  return artists.map((a) => ({ slug: a.slug }))
}

export const revalidate = 60

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)
  if (!artist) notFound()

  const spotlights = getArtistSpotlights(artist)
  const tracks = spotlights.map((url, i) => ({ url, title: `Track ${i + 1}` }))

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navigation />

      <main className="relative z-20">
        {/* ───────── Hero ───────── */}
        <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
          <Image
            src={artist.image_url || '/placeholder-artist.jpg'}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />

          {/* Gray "All Artists" button, bottom-left */}
          <div className="absolute bottom-8 left-8">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-colors duration-200 hover:bg-white"
              style={{ background: '#d9d9d9', color: '#000' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M9 3L3 9M3 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>All Artists</span>
            </Link>
          </div>
        </section>

        {/* ───────── Intro (name | small bio) ───────── */}
        <section className="px-8 max-w-[1280px] mx-auto pt-14 pb-12">
          <div className="grid gap-12 items-start grid-cols-1 lg:grid-cols-[minmax(0,751px)_1fr]">
            {/* Left — name + chips + socials */}
            <div className="max-w-[751px]">
              <h1
                className="font-bold tracking-tight mb-6 whitespace-nowrap"
                style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {artist.name}
              </h1>

              {(artist.genres.length > 0 || artist.locations.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {artist.genres.map((g) => (
                    <span
                      key={g.id}
                      className="font-mono text-[10px] px-3 py-1 uppercase tracking-wider border"
                      style={{ borderColor: '#333', color: '#aaa' }}
                    >
                      {g.name}
                    </span>
                  ))}
                  {artist.locations.map((l) => (
                    <span
                      key={l.id}
                      className="font-mono text-[10px] px-3 py-1 uppercase tracking-wider border"
                      style={{ borderColor: '#333', color: '#aaa' }}
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Social icons — hover blue */}
              <div className="flex flex-wrap gap-[18px]">
                <SocialIcon href={artist.facebook} label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </SocialIcon>
                <SocialIcon href={artist.instagram} label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </SocialIcon>
                <SocialIcon href={artist.tiktok} label="TikTok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" /></svg>
                </SocialIcon>
                <SocialIcon href={artist.spotify} label="Spotify">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                </SocialIcon>
                <SocialIcon href={artist.soundcloud} label="SoundCloud">
                  <svg width="22" height="20" viewBox="0 0 32 24" fill="currentColor"><path d="M27.5 12.3c-.6 0-1.1.1-1.6.3-.4-3.7-3.5-6.6-7.3-6.6-1 0-1.9.2-2.8.6-.3.1-.4.3-.4.6v15.6c0 .3.2.5.5.6.1 0 11.5 0 11.6 0 2.6 0 4.8-2.1 4.8-4.8s-2.2-4.3-4.8-4.3z" /></svg>
                </SocialIcon>
              </div>
            </div>

            {/* Right — small bio (14px, min-height 384) */}
            <div>
              {artist.small_bio && (
                <p
                  className="leading-[1.7]"
                  style={{ fontSize: '14px', color: '#aaa', minHeight: '384px' }}
                >
                  {artist.small_bio}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ───────── Bio + Agents ───────── */}
        <section className="px-8 max-w-[1280px] mx-auto pb-16">
          <div className="grid gap-12 items-start mb-20 grid-cols-1 lg:grid-cols-[minmax(0,680px)_1fr]">
            {/* Left — Biography (14px text) */}
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#4E7DFE' }}>
                {'// Biography'}
              </h2>
              <div className="space-y-3">
                {(artist.large_bio || '').split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontSize: '14px', lineHeight: '1.65', color: '#aaa' }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right — Primary + Secondary agents, then Make Enquiry button */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Primary */}
                {artist.primary_agent && (
                  <AgentBlock
                    label="// Primary Agent"
                    name={artist.primary_agent.name}
                    email={artist.primary_agent.email}
                    slug={artist.primary_agent.slug}
                  />
                )}
                {/* Secondary — only renders if set */}
                {artist.secondary_agent && (
                  <AgentBlock
                    label="// Secondary Agent"
                    name={artist.secondary_agent.name}
                    email={artist.secondary_agent.email}
                    slug={artist.secondary_agent.slug}
                  />
                )}
              </div>

              {/* Make an Enquiry — pre-fills this artist. Tailwind hover so this can stay in a server component. */}
              <Link
                href={`/book?artist=${artist.id}`}
                className="inline-flex items-center gap-3 self-start font-mono text-xs uppercase tracking-widest px-6 py-3.5 transition-all duration-200
                           bg-[#4E7DFE] text-black
                           hover:bg-black hover:text-[#4E7DFE]
                           hover:shadow-[inset_0_0_0_1px_#4E7DFE]"
              >
                <span>Make an Enquiry</span>
                <span>{'>'}</span>
              </Link>
            </div>
          </div>

          {/* ───────── Spotlight ───────── */}
          {tracks.length > 0 && (
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: '#4E7DFE' }}>
                {'// Spotlight'}
              </h2>
              <FeaturedTracks tracks={tracks} />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

/** Compact agent block — label, name (single line), email */
function AgentBlock({
  label,
  name,
  email,
  slug,
}: {
  label: string
  name: string
  email: string | null
  slug: string
}) {
  return (
    <Link
      href={`/agents/${slug}`}
      className="block group"
      style={{ minHeight: '114px' }}
    >
      <div
        className="font-mono uppercase tracking-[0.18em] mb-3"
        style={{ fontSize: '11px', color: '#4E7DFE' }}
      >
        {label}
      </div>
      <div className="font-bold text-base mb-1 whitespace-nowrap group-hover:text-[#4E7DFE] transition-colors">
        {name}
      </div>
      {email && (
        <div
          className="font-mono break-all"
          style={{ fontSize: '12px', color: '#888' }}
        >
          {email}
        </div>
      )}
    </Link>
  )
}

/** Social icon — only renders if href is provided; hovers to blue */
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string | null
  label: string
  children: React.ReactNode
}) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200"
    >
      {children}
    </a>
  )
}