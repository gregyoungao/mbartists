'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Track {
  url: string
  title?: string
}

interface FeaturedTracksProps {
  tracks: Track[]
}

export default function FeaturedTracks({ tracks }: FeaturedTracksProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [embedHtml, setEmbedHtml] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const getOEmbedUrl = (trackUrl: string) => {
    if (trackUrl.includes('spotify.com')) {
      return `https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`
    } else if (trackUrl.includes('soundcloud.com')) {
      return `https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`
    }
    return null
  }

  const getEmbedUrl = (trackUrl: string) => {
    if (trackUrl.includes('spotify.com')) {
      const trackId = trackUrl.split('/track/')[1]?.split('?')[0]
      return `https://open.spotify.com/embed/track/${trackId}`
    } else if (trackUrl.includes('soundcloud.com')) {
      return trackUrl
    }
    return null
  }

  const handleTrackClick = async (track: Track) => {
    setSelectedTrack(track)
    setLoading(true)

    try {
      const oembedUrl = getOEmbedUrl(track.url)
      if (oembedUrl && !track.url.includes('soundcloud.com')) {
        // For Spotify, we use iframe embed directly
        const trackId = track.url.split('/track/')[1]?.split('?')[0]
        setEmbedHtml(`<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`)
      } else if (track.url.includes('soundcloud.com')) {
        // For SoundCloud, fetch iframe code from oEmbed
        const response = await fetch(
          `https://soundcloud.com/oembed?url=${encodeURIComponent(track.url)}&format=json`
        )
        const data = await response.json()
        setEmbedHtml(data.html)
      }
    } catch (error) {
      console.error('Error fetching embed:', error)
    }

    setLoading(false)
  }

  // Fetch cover art from oEmbed
  const getCoverImage = (trackUrl: string): string => {
    // For demo purposes, return placeholder
    // In production, this would fetch from oEmbed API
    return '/placeholder-artist.jpg'
  }

  return (
    <>
      {/* Track Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {tracks.map((track, idx) => (
          <button
            key={idx}
            onClick={() => handleTrackClick(track)}
            className="group relative overflow-hidden bg-secondary rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              aspectRatio: '1/1',
              boxShadow: '0 0 20px rgba(78, 125, 254, 0)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(78, 125, 254, 0.4)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(78, 125, 254, 0)'
            }}
          >
            <Image
              src={getCoverImage(track.url)}
              alt={track.title || `Track ${idx + 1}`}
              fill
              className="object-cover group-hover:brightness-75 transition-all duration-300"
            />

            {/* Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white fill-white ml-1"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedTrack && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTrack(null)}
        >
          <div
            className="bg-card rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedTrack(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            )}

            {/* Embed */}
            {!loading && embedHtml && (
              <div
                className="w-full"
                dangerouslySetInnerHTML={{ __html: embedHtml }}
              />
            )}

            {!loading && !embedHtml && (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground font-mono text-sm">
                  Open in {selectedTrack.url.includes('spotify.com') ? 'Spotify' : 'SoundCloud'}
                </p>
                <a
                  href={selectedTrack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2 bg-primary text-white rounded hover:brightness-110 transition-all font-mono text-sm"
                >
                  {'→'} Open Player
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
