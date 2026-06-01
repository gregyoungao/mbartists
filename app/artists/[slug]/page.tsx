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

              {/* Social icons — uniform 20x20, hover blue */}
              <div className="flex flex-wrap items-center gap-5">
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
                  {/* SoundCloud icon — proper 24x24 viewBox with full wave bars visible */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.319c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.21 2.479c0 .061.06.12.12.12.061 0 .12-.045.12-.12l.225-2.479-.225-2.563c0-.06-.045-.105-.12-.105m.945-.089c-.075 0-.135.06-.15.135l-.193 2.652.21 2.526c0 .075.06.135.135.135.075 0 .135-.06.15-.135l.225-2.526-.225-2.652c-.015-.075-.075-.135-.15-.135m1.155.36c-.005-.09-.075-.149-.159-.149-.09 0-.158.06-.164.149l-.217 2.448.21 2.541c0 .09.075.16.165.16.09 0 .158-.07.164-.16l.249-2.541-.249-2.448zm.824-1.433c-.097 0-.18.075-.18.18l-.21 3.69.21 2.5c0 .097.083.18.18.18s.18-.083.18-.18l.24-2.52-.24-3.67c0-.105-.083-.18-.18-.18m.945.045c-.105 0-.195.09-.21.21l-.18 3.66.18 2.46c.015.12.105.21.21.21.114 0 .203-.09.213-.21l.207-2.46-.207-3.66c-.012-.12-.099-.21-.213-.21m1.062-.811c-.13 0-.227.103-.227.227l-.17 4.402.17 2.41c0 .124.097.227.227.227.124 0 .226-.103.226-.227l.19-2.41-.19-4.402c0-.124-.102-.227-.226-.227m.974-.515c-.137 0-.252.115-.252.252l-.137 4.892.137 2.396c0 .137.115.252.252.252.137 0 .252-.115.265-.252l.155-2.396-.155-4.892c-.013-.137-.128-.252-.265-.252m.97-.45c-.15 0-.273.124-.273.272l-.122 5.354.122 2.388c0 .149.124.272.273.272.149 0 .27-.124.285-.272l.139-2.388-.139-5.354c-.015-.149-.136-.272-.285-.272m1.012-.314c-.165 0-.299.135-.299.3l-.099 5.671.099 2.366c0 .165.134.3.299.3s.299-.135.314-.3l.114-2.366-.114-5.671c-.015-.165-.149-.3-.314-.3m1.04-.39c-.18 0-.328.149-.328.328l-.084 6.06.084 2.351c0 .18.149.328.328.328.18 0 .329-.149.345-.328l.094-2.351-.094-6.06c-.016-.18-.165-.329-.345-.329m1.077.054c-.195 0-.357.164-.357.359l-.069 5.998.069 2.336c0 .195.162.358.357.358.196 0 .358-.163.371-.358l.078-2.336-.078-5.998c-.013-.195-.176-.359-.371-.359m1.116.227c-.21 0-.388.178-.388.388l-.054 5.764.054 2.32c0 .21.178.389.388.389.211 0 .389-.178.402-.389l.062-2.32-.062-5.764c-.013-.21-.191-.388-.402-.388m1.149.39c-.227 0-.418.19-.418.418l-.038 5.42.038 2.305c0 .227.191.419.418.419.226 0 .417-.192.432-.419l.044-2.305-.044-5.42c-.015-.227-.206-.418-.432-.418m4.137-1.213c-.376 0-.736.075-1.066.21-.225-2.434-2.267-4.34-4.766-4.34-.6 0-1.184.105-1.71.3-.21.078-.27.158-.27.318V18.81c0 .172.135.314.314.314 0 0 11.474-.018 11.499-.018 2.535 0 4.602-2.07 4.602-4.605s-2.067-4.605-4.602-4.605"/>
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