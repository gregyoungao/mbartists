// =========================================================
// app/artists/[slug]/page.tsx
// Server component — fetches artist from Supabase.
// Step 6 enquiry form replaced with a "Make an Enquiry" CTA
// linking to /book?artist=<id> (artist auto-selected).
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

                    {/* Make an Enquiry button — pre-fills this artist in the booking form */}
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
              <div className="mb-20">
                <h2 className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: '#4E7DFE' }}>
                  {'// Spotlight'}
                </h2>
                <FeaturedTracks tracks={tracks} />
              </div>
            )}

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