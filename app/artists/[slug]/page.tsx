// =========================================================
// app/artists/[slug]/page.tsx
// Artist profile page
//   - Hero: image w/ focal point + "All Artists" button flush to corner
//   - Margins match listing pages: px-4 md:px-8, max-w-7xl
//   - Primary genre always sorts first in chip row
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

  // Vertical focal point for hero (0 = top, 50 = center, 100 = bottom)
  const focusY = (artist as any).image_focus_y ?? 50

  // Reorder genres so the artist's primary genre appears first (Style 3)
  const primaryGenreId = (artist as any).primary_genre_id ?? null
  const sortedGenres = primaryGenreId
    ? [
        ...artist.genres.filter((g) => g.id === primaryGenreId),
        ...artist.genres.filter((g) => g.id !== primaryGenreId),
      ]
    : artist.genres

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
            style={{ objectPosition: `center ${focusY}%` }}
            priority
          />

          {/* "All Artists" button — flush to bottom-left corner */}
          <Link
            href="/artists"
            className="absolute bottom-0 left-0 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 transition-colors duration-200 hover:bg-white"
            style={{ background: '#d9d9d9', color: '#000' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M9 3L3 9M3 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>All Artists</span>
          </Link>
        </section>

        {/* ───────── Intro (name | small bio) ───────── */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pt-14 pb-16 border-b border-[#1a1a1a]">
          <div className="grid gap-12 items-start grid-cols-1 lg:grid-cols-[minmax(0,680px)_1fr]">
            {/* Left — name + chips + socials */}
            <div className="max-w-[680px]">
              <h1
                className="font-bold tracking-tight mb-6 break-words"
                style={{ fontSize: 'clamp(36px, 4.5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                {artist.name}
              </h1>

              {(sortedGenres.length > 0 || artist.locations.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {sortedGenres.map((g) => (
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

              {/* Social icons — all 5 use the same circular filled style.
                  All paths use currentColor so hover blue works uniformly. */}
              <div className="flex flex-wrap items-center gap-4">
                <SocialIcon href={artist.facebook} label="Facebook">
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM300.49,127.54h-26.48c-14.64,0-29.98,9.06-29.98,25.1v43.21h54.37l-9.06,57.16h-45.31v141.5h-61.34v-141.5h-51.58v-57.16h51.58v-42.52c0-42.52,25.1-78.07,70.41-75.28l47.39,2.09v47.4Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={artist.instagram} label="Instagram">
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M276.59,224.85c0,14.39-5.83,27.41-15.16,36.84-9.34,9.42-22.19,15.25-36.24,15.25h-.68c-28.1,0-51.4-23.31-51.4-52.09,0-14.05,5.83-26.9,15.16-36.24,9.34-9.34,22.19-15.16,36.24-15.16h.68c28.1,0,51.4,23.3,51.4,51.4Z" />
                    <path d="M290.3,106.29h-130.9c-29.46,0-53.45,23.99-53.45,53.46v130.21c0,29.46,23.99,53.45,53.45,53.45h130.9c29.47,0,53.45-23.99,53.45-53.45v-130.21c0-29.47-23.98-53.46-53.45-53.46ZM280.19,280.11c-14.22,14.13-33.75,22.87-55,22.87h-.68c-42.49,0-77.44-34.95-77.44-78.13,0-21.24,8.74-40.78,22.79-54.99,14.04-14.22,33.4-23.13,54.65-23.13h.68c42.49,0,78.13,35.63,78.13,78.12,0,21.59-8.91,41.12-23.13,55.26ZM313.52,159.66c-3,3-7.12,4.88-11.57,4.88-4.79,0-8.91-1.88-11.82-4.88-2.91-2.99-4.63-7.11-4.63-11.56s1.72-8.57,4.63-11.57c2.91-3,7.03-4.88,11.82-4.88,8.91,0,16.45,7.54,16.45,16.45,0,4.45-1.88,8.57-4.88,11.56Z" />
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM368.42,290.64c0,42.49-34.95,77.44-77.44,77.44h-132.26c-42.49,0-77.44-34.95-77.44-77.44v-131.58c0-42.49,34.95-77.44,77.44-77.44h132.26c42.49,0,77.44,34.95,77.44,77.44v131.58Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={artist.tiktok} label="TikTok">
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM357.82,205.11c-25.12,1.88-49.62-6.28-68.47-23.24v103.02c0,50.26-41.46,91.09-92.35,91.09-26.38,0-50.25-11.31-67.21-28.9-15.08-16.33-24.5-38.32-24.5-62.19,0-49.63,39.57-90.46,89.83-91.72h1.88c4.4,0,8.8.63,12.57,1.26v50.26c-3.77-1.26-8.17-1.89-12.57-1.89-23.24,0-42.09,18.85-42.09,42.09,0,8.8,2.52,17.59,7.54,24.5,8.17,10.68,20.73,17.59,34.55,17.59,23.88,0,42.72-18.84,42.72-42.09V87.01h49.63c-.63,16.96,6.28,34.55,18.22,47.74,10.05,11.31,21.98,18.85,35.81,20.73,4.39,1.26,9.42,1.26,14.44,0v49.63Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={artist.spotify} label="Spotify">
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor">
                    <path d="M224.85,0C100.73,0,0,100.73,0,224.85s100.73,224.85,224.85,224.85,224.85-100.73,224.85-224.85S348.97,0,224.85,0ZM316.15,330.84c-3.81,0-6.17-1.18-9.7-3.26-56.58-34.09-122.4-35.54-187.41-22.21-3.54.91-8.16,2.36-10.79,2.36-8.79,0-14.33-6.98-14.33-14.33,0-9.34,5.53-13.78,12.33-15.23,74.25-16.41,150.14-14.96,214.88,23.75,5.53,3.54,8.79,6.71,8.79,14.96s-6.44,13.96-13.78,13.96h0ZM340.54,271.36c-4.71,0-7.89-2.09-11.15-3.81-56.67-33.55-141.17-47.06-216.33-26.66-4.35,1.18-6.71,2.36-10.79,2.36-9.7,0-17.59-7.89-17.59-17.59s4.71-16.14,14.05-18.77c25.2-7.07,50.95-12.33,88.67-12.33,58.84,0,115.69,14.6,160.48,41.25,7.34,4.35,10.25,9.97,10.25,17.86-.09,9.79-7.71,17.68-17.59,17.68ZM368.65,202.27c-4.71,0-7.62-1.18-11.7-3.54-64.55-38.53-179.97-47.78-254.68-26.93-3.26.91-7.34,2.36-11.7,2.36-11.97,0-21.13-9.34-21.13-21.4s7.62-19.31,15.78-21.67c31.91-9.34,67.64-13.78,106.53-13.78,66.19,0,135.54,13.78,186.23,43.34,7.07,4.08,11.7,9.7,11.7,20.49,0,12.33-9.97,21.13-21.03,21.13h0Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href={artist.soundcloud} label="SoundCloud">
                  <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                    <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM50.1,260.42c-.12.83-.71,1.4-1.44,1.4s-1.35-.58-1.45-1.41l-2.64-19.68,2.64-20.03c.1-.83.69-1.41,1.45-1.41s1.33.58,1.44,1.41l3.13,20.03-3.13,19.69ZM63.49,272.4c-.12.86-.74,1.45-1.5,1.45s-1.4-.61-1.5-1.46l-3.54-31.66s3.54-32.37,3.54-32.38c.11-.84.74-1.45,1.5-1.45s1.38.59,1.5,1.45l4.03,32.38-4.03,31.67ZM77.96,277.76c-.11,1.02-.87,1.76-1.81,1.76s-1.71-.74-1.81-1.77l-3.36-37.01,3.36-38.42c.1-1.02.86-1.77,1.81-1.77s1.7.74,1.81,1.77l3.82,38.42-3.82,37.02ZM92.55,278.93c-.1,1.18-1.01,2.08-2.11,2.08s-2.03-.89-2.12-2.08l-3.18-38.19,3.18-39.47c.09-1.19,1-2.08,2.12-2.08s2.02.89,2.11,2.07l3.61,39.48-3.61,38.19ZM107.25,279.25c-.1,1.35-1.14,2.38-2.42,2.38s-2.34-1.03-2.42-2.38l-3-38.5,3-36.61c.08-1.36,1.12-2.39,2.42-2.39s2.33,1.02,2.42,2.37l3.41,36.63-3.41,38.51ZM122.07,279.26h0c-.09,1.5-1.28,2.69-2.73,2.69s-2.65-1.19-2.73-2.69l-2.82-38.5,2.82-59.57c.07-1.51,1.27-2.7,2.73-2.7s2.65,1.19,2.73,2.7l3.19,59.57-3.19,38.5ZM137.01,279.01c-.08,1.69-1.41,3.01-3.04,3.01s-2.97-1.32-3.04-2.99l-2.64-38.26,2.64-73.2c.07-1.69,1.4-3.01,3.04-3.01s2.96,1.32,3.04,3.01l2.98,73.2-2.98,38.24ZM152.06,278.63c-.07,1.86-1.54,3.32-3.34,3.32s-3.29-1.46-3.34-3.3l-2.45-37.87,2.45-79.3c.06-1.86,1.53-3.32,3.35-3.32s3.27,1.46,3.34,3.32l2.76,79.31-2.77,37.85ZM167.23,278.39h0c-.07,2.03-1.66,3.62-3.65,3.62s-3.59-1.59-3.65-3.61l-2.28-37.63,2.27-81.98c.05-2.04,1.66-3.63,3.65-3.63s3.59,1.6,3.65,3.63l2.56,81.98-2.56,37.61ZM182.51,278.06v-.03c-.06,2.21-1.8,3.94-3.96,3.94s-3.92-1.73-3.96-3.92l-2.09-37.27,2.09-79.89c.05-2.21,1.79-3.94,3.96-3.94s3.9,1.73,3.96,3.94l2.35,79.88-2.35,37.28ZM197.91,277.83v-.03c-.05,2.39-1.92,4.25-4.26,4.25s-4.23-1.86-4.27-4.22l-1.91-37.04,1.91-76.97c.05-2.39,1.93-4.25,4.27-4.25s4.21,1.86,4.26,4.24l2.14,76.98-2.14,37.04ZM213.43,277.57c-.05,2.51-2.09,4.56-4.58,4.56s-4.54-2.04-4.57-4.53c0,0-1.73-36.76-1.73-36.82l1.73-91.56c.04-2.52,2.09-4.56,4.57-4.56s4.53,2.05,4.57,4.56l1.93,91.6-1.93,36.76ZM228.88,277.07v-.04c-.04,2.69-2.23,4.87-4.88,4.87s-4.85-2.18-4.89-4.83l-2-36.26,2-99.9c.04-2.69,2.23-4.87,4.89-4.87s4.84,2.19,4.88,4.87l2.17,99.91-2.17,36.26ZM360.77,282.23c-.79,0-122.81-.06-122.92-.07-2.65-.27-4.75-2.53-4.79-5.24v-140.75c.03-2.59.92-3.92,4.27-5.22,8.61-3.33,18.36-5.3,28.37-5.3,40.88,0,74.4,31.35,77.93,71.32,5.28-2.21,11.08-3.44,17.15-3.44,24.49,0,44.34,19.86,44.34,44.35,0,24.49-19.86,44.35-44.35,44.35Z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>

            {/* Right — small bio */}
            <div>
              {artist.small_bio && (
                <p
                  className="leading-[1.7]"
                  style={{ fontSize: '14px', color: '#aaa' }}
                >
                  {artist.small_bio}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ───────── Bio + Agents ───────── */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pt-14 pb-16">
          <div className="grid gap-12 items-start mb-20 grid-cols-1 lg:grid-cols-[minmax(0,680px)_1fr]">
            {/* Left — Biography */}
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#4E7DFE' }}>
                {'// Biography'}
              </h2>
              <div className="space-y-3 max-w-[476px]">
                {(artist.large_bio || '').split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontSize: '14px', lineHeight: '1.65', color: '#aaa' }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right — Agents + Enquiry */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-6">
                {artist.primary_agent && (
                  <AgentBlock
                    label="// Primary Agent"
                    name={artist.primary_agent.name}
                    email={artist.primary_agent.email}
                    slug={artist.primary_agent.slug}
                  />
                )}
                {artist.secondary_agent && (
                  <AgentBlock
                    label="// Secondary Agent"
                    name={artist.secondary_agent.name}
                    email={artist.secondary_agent.email}
                    slug={artist.secondary_agent.slug}
                  />
                )}
              </div>

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
      className="text-[#888] hover:text-[#4E7DFE] transition-colors duration-200 inline-flex items-center justify-center"
    >
      {children}
    </a>
  )
}