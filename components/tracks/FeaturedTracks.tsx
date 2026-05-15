// =========================================================
// FeaturedTracks — 4-column grid of inline-playable tracks.
// Each card has the same height (352px) so the row stays even,
// regardless of whether the track is on Spotify, SoundCloud, etc.
// =========================================================

interface Track {
  url: string
  title?: string
}

const ACCENT = '#4E7DFE'
const PLAYER_HEIGHT = 352 // matches Spotify's tall card; keeps row even

function getSpotifyEmbedUrl(url: string): string | null {
  const match = url.match(
    /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
  )
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?theme=0`
}

function getSoundCloudEmbedUrl(url: string): string {
  const params = new URLSearchParams({
    url: url,
    color: ACCENT.replace('#', ''),
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'true', // tall visual player with artwork
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

function getYouTubeEmbedUrl(url: string): string | null {
  let id: string | null = null
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (watchMatch) id = watchMatch[1]
  else if (shortMatch) id = shortMatch[1]
  else if (embedMatch) id = embedMatch[1]
  if (!id) return null
  return `https://www.youtube.com/embed/${id}`
}

interface EmbedInfo {
  type: 'spotify' | 'soundcloud' | 'youtube' | 'external'
  embedUrl: string | null
}

function getEmbed(url: string): EmbedInfo {
  if (url.includes('spotify.com')) {
    return { type: 'spotify', embedUrl: getSpotifyEmbedUrl(url) }
  }
  if (url.includes('soundcloud.com')) {
    return { type: 'soundcloud', embedUrl: getSoundCloudEmbedUrl(url) }
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return { type: 'youtube', embedUrl: getYouTubeEmbedUrl(url) }
  }
  return { type: 'external', embedUrl: null }
}

export default function FeaturedTracks({ tracks }: { tracks: Track[] }) {
  if (!tracks?.length) return null
  const validTracks = tracks.filter((t) => t.url?.trim())
  if (!validTracks.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {validTracks.map((track, i) => {
        const embed = getEmbed(track.url)

        // External / unrecognized URL — fall back to a link card
        if (embed.type === 'external' || !embed.embedUrl) {
          return (
            <a
              key={i}
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center border p-6 transition-colors hover:border-[#4E7DFE]"
              style={{
                borderColor: '#222',
                height: PLAYER_HEIGHT,
                background: '#0a0a0a',
              }}
            >
              <p
                className="font-mono text-xs uppercase tracking-widest mb-3"
                style={{ color: ACCENT }}
              >
                Listen
              </p>
              <p
                className="text-sm text-center truncate w-full"
                style={{ color: '#888' }}
              >
                {track.title || track.url}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-widest mt-3"
                style={{ color: '#666' }}
              >
                Open →
              </p>
            </a>
          )
        }

        if (embed.type === 'youtube') {
          return (
            <div
              key={i}
              className="overflow-hidden border"
              style={{
                borderColor: '#222',
                height: PLAYER_HEIGHT,
                background: '#000',
              }}
            >
              <iframe
                src={embed.embedUrl}
                title={track.title || `Track ${i + 1}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          )
        }

        if (embed.type === 'spotify') {
          return (
            <div
              key={i}
              className="overflow-hidden"
              style={{ height: PLAYER_HEIGHT }}
            >
              <iframe
                src={embed.embedUrl}
                title={track.title || `Spotify track ${i + 1}`}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          )
        }

        if (embed.type === 'soundcloud') {
          return (
            <div
              key={i}
              className="overflow-hidden border"
              style={{
                borderColor: '#222',
                height: PLAYER_HEIGHT,
              }}
            >
              <iframe
                src={embed.embedUrl}
                title={track.title || `SoundCloud track ${i + 1}`}
                loading="lazy"
                allow="autoplay"
                className="w-full h-full"
                style={{ border: 0 }}
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}