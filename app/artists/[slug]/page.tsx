// =========================================================
// app/artists/[slug]/page.tsx
// Restructured layout:
//   - Hero: artist image only (no overlay text)
//   - Intro section: left col (name + genres + social icons) | right col (small bio)
//   - Bio + Agent + Spotlight as before
//   - No standalone // Connect socials section at the bottom
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
        {/* Hero — just the artist image, no text overlay */}
        <section className="relative h-[60vh] min-h-[450px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={artist.image_url || '/placeholder-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
              priority
            />
            {/* Bottom fade into page bg */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, transparent 70%, #000 100%)',
              }}
            />
          </div>

          {/* "All Artists" back link, bottom-left corner */}
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-200"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M9 3L3 9M3 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>All Artists</span>
            </Link>
          </div>
        </section>

        {/* Intro — name + genres + socials on left, small bio on right */}
        <section className="px-8 md:px-16 pt-12 md:pt-16 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left column */}
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                  {artist.name}
                </h1>

                {artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
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

                {/* Social icons */}
                <div className="flex flex-wrap gap-4">
                  <SocialIcon href={artist.facebook} label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={artist.instagram} label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={artist.tiktok} label="TikTok">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={artist.spotify} label="Spotify">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon href={artist.soundcloud} label="SoundCloud">
                    <svg width="22" height="20" viewBox="0 0 32 24" fill="currentColor">
                      <path d="M27.5 12.3c-.6 0-1.1.1-1.6.3-.4-3.7-3.5-6.6-7.3-6.6-1 0-1.9.2-2.8.6-.3.1-.4.3-.4.6v15.6c0 .3.2.5.5.6.1 0 11.5 0 11.6 0 2.6 0 4.8-2.1 4.8-4.8s-2.2-4.3-4.8-4.3zm-13.6-5.5c-.4 0-.7.3-.7.7l-.2 9.2.2 4.3c0 .4.3.7.7.7s.7-.3.7-.7l.2-4.3-.2-9.2c0-.4-.3-.7-.7-.7zm-3 1.8c-.4 0-.7.3-.7.7l-.2 7.4.2 4.3c0 .4.3.7.7.7s.7-.3.7-.7l.2-4.3-.2-7.4c0-.4-.3-.7-.7-.7zm-3 1.3c-.4 0-.7.3-.7.7l-.2 6.1.2 4.3c0 .4.3.7.7.7s.7-.3.7-.7l.2-4.3-.2-6.1c0-.4-.3-.7-.7-.7zm-3 1.4c-.4 0-.7.3-.7.7l-.2 4.7.2 4.3c0 .4.3.7.7.7s.7-.3.7-.7l.2-4.3-.2-4.7c0-.4-.3-.7-.7-.7zm-2.9 2c-.4 0-.7.3-.7.7l-.3 2.7.3 4.3c0 .4.3.7.7.7s.7-.3.7-.7l.3-4.3-.3-2.7c0-.4-.3-.7-.7-.7zm-2.6 2.5c-.4 0-.7.3-.7.7l-.4.2.4 1.8c0 .4.3.7.7.7s.7-.3.7-.7l.4-1.8-.4-.2c0-.4-.3-.7-.7-.7z" />
                    </svg>
                  </SocialIcon>
                </div>
              </div>

              {/* Right column — small bio */}
              <div>
                {artist.small_bio && (
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: '#aaa' }}>
                    {artist.small_bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bio + Agent + Spotlight */}
        <section className="px-8 md:px-16 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Bio + Agent grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
              <div className="lg:col-span-2">
                <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#4E7DFE' }}>
                  {'// Biography'}
                </h2>
                <div className="space-y-4" style={{ color: '#aaa' }}>
                  {(artist.large_bio || '').split('\n\n').map((p, i) => (
                    <p key={i} className="leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {artist.primary_agent && (
                <div>
                  <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#4E7DFE' }}>
                    {'// Agent'}
                  </h2>
                  <div
                    className="p-6 border"
                    style={{ borderColor: '#222', background: '#0a0a0a' }}
                  >
                    <Link
                      href={`/agents/${artist.primary_agent.slug}`}
                      className="block group"
                    >
                      <p className="font-bold text-lg mb-1 group-hover:text-[#4E7DFE] transition-colors">
                        {artist.primary_agent.name}
                      </p>
                      {artist.primary_agent.email && (
                        <p className="font-mono text-xs mb-4" style={{ color: '#666' }}>
                          {artist.primary_agent.email}
                        </p>
                      )}
                      <div className="flex items-center gap-2 font-mono text-xs mb-6" style={{ color: '#4E7DFE' }}>
                        <span>View Profile</span>
                        <span>{'>'}</span>
                      </div>
                    </Link>

                    {/* Make an Enquiry button */}
                    <Link
                      href={`/book?artist=${artist.id}`}
                      className="block text-center font-mono text-xs uppercase tracking-widest px-4 py-3 transition-colors"
                      style={{ background: '#4E7DFE', color: '#000' }}
                    >
                      Make an Enquiry
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Spotlight tracks */}
            {tracks.length > 0 && (
              <div>
                <h2 className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: '#4E7DFE' }}>
                  {'// Spotlight'}
                </h2>
                <FeaturedTracks tracks={tracks} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/** Social icon button — only renders if href is provided */
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
      className="transition-colors duration-200"
      style={{ color: '#888' }}
    >
      {children}
    </a>
  )
}