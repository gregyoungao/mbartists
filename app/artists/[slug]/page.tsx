// =========================================================
// app/artists/[slug]/page.tsx
// Server component — fetches artist from Supabase.
// Step 6 update: adds an embedded booking enquiry form.
// =========================================================

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import FeaturedTracks from '@/components/tracks/FeaturedTracks'
import EnquiryForm from '@/components/enquiry/EnquiryForm'
import {
  getAllArtists,
  getArtistBySlug,
  getArtistSpotlights,
} from '@/lib/supabase'

// Pre-render all published artist pages at build time
export async function generateStaticParams() {
  const artists = await getAllArtists()
  return artists.map((a) => ({ slug: a.slug }))
}

// Re-fetch every 60s so newly approved artists appear without redeploy
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
        {/* Header */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={artist.image_url || '/placeholder-artist.jpg'}
              alt={artist.name}
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.4)' }}
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, transparent 50%, #000 100%)',
              }}
            />
          </div>

          {/* Corner brackets */}
          <div className="absolute inset-8 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: '#4E7DFE' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: '#4E7DFE' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: '#4E7DFE' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: '#4E7DFE' }} />
          </div>

          <div className="relative h-full flex flex-col justify-end px-8 md:px-16 pb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.genres.map((g) => (
                <span
                  key={g.id}
                  className="font-mono text-[10px] px-3 py-1 uppercase tracking-wider"
                  style={{ background: 'rgba(78, 125, 254, 0.2)', color: '#4E7DFE' }}
                >
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              {artist.name}
            </h1>
            {artist.small_bio && (
              <p className="font-mono text-sm max-w-2xl" style={{ color: '#888' }}>
                {artist.small_bio}
              </p>
            )}
          </div>
        </section>

        {/* Main */}
        <section className="px-8 md:px-16 py-16">
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
                  <Link
                    href={`/agents/${artist.primary_agent.slug}`}
                    className="block p-6 border transition-all duration-300 group"
                    style={{ borderColor: '#222', background: '#0a0a0a' }}
                  >
                    <p className="font-bold text-lg mb-1 group-hover:text-[#4E7DFE] transition-colors">
                      {artist.primary_agent.name}
                    </p>
                    {artist.primary_agent.email && (
                      <p className="font-mono text-xs" style={{ color: '#666' }}>
                        {artist.primary_agent.email}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 font-mono text-xs" style={{ color: '#4E7DFE' }}>
                      <span>View Profile</span>
                      <span>{'>'}</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Spotlight tracks */}
            {tracks.length > 0 && (
              <div className="mb-20">
                <h2 className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: '#4E7DFE' }}>
                  {'// Spotlight'}
                </h2>
                <FeaturedTracks tracks={tracks} />
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              <Stat label="Location" value={artist.locations[0]?.name || '—'} />
              <Stat label="Genres" value={String(artist.genres.length)} />
              <Stat label="Tracks" value={String(tracks.length)} />
              <Stat label="Status" value={artist.featured_artist ? 'Featured' : 'Active'} highlight />
            </div>

            {/* Booking enquiry */}
            <div className="border-t pt-12 mb-20" style={{ borderColor: '#1a1a1a' }}>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#4E7DFE' }}>
                {'// Book ' + artist.name}
              </h2>
              <p className="mb-8" style={{ color: '#666' }}>
                Interested in booking {artist.name}? Send an enquiry and the
                agent will be in touch.
              </p>
              <div className="max-w-3xl">
                <EnquiryForm
                  artists={[{ id: artist.id, name: artist.name }]}
                  lockedArtistId={artist.id}
                  lockedArtistName={artist.name}
                />
              </div>
            </div>

            {/* Socials */}
            <div className="border-t pt-12" style={{ borderColor: '#1a1a1a' }}>
              <h3 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#666' }}>
                {'// Connect'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <SocialLink href={artist.spotify} label="Spotify" />
                <SocialLink href={artist.soundcloud} label="SoundCloud" />
                <SocialLink href={artist.instagram} label="Instagram" />
                <SocialLink href={artist.facebook} label="Facebook" />
                <SocialLink href={artist.tiktok} label="TikTok" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="p-6 border" style={{ borderColor: '#1a1a1a', background: '#080808' }}>
      <p className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: '#444' }}>
        {label}
      </p>
      <p className="font-bold" style={{ color: highlight ? '#4E7DFE' : '#fff' }}>{value}</p>
    </div>
  )
}

function SocialLink({ href, label }: { href: string | null; label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs px-5 py-2.5 border transition-all duration-200 hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
      style={{ borderColor: '#222', color: '#888' }}
    >
      {label}
    </a>
  )
}
