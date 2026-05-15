// =========================================================
// FeaturedTracks — 4-column grid of track cards.
// Fetches oEmbed data server-side to get artwork + real titles
// for Spotify, SoundCloud, YouTube, and Bandcamp URLs.
// =========================================================

interface Track {
  url: string
  title?: string
}

interface EmbedData {
  thumbnail: string | null
  title: string
  platform: string
  url: string
}

const ACCENT = '#4E7DFE'

function detectPlatform(url: string): {
  platform: string
  oembedUrl: string | null
} {
  if (url.includes('spotify.com')) {
    return {
      platform: 'Spotify',
      oembedUrl: `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
    }
  }
  if (url.includes('soundcloud.com')) {
    return {
      platform: 'SoundCloud',
      oembedUrl: `https://soundcloud.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`,
    }
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return {
      platform: 'YouTube',
      oembedUrl: `https://www.youtube.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`,
    }
  }
  if (url.includes('bandcamp.com')) {
    return {
      platform: 'Bandcamp',
      oembedUrl: `https://bandcamp.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`,
    }
  }
  return { platform: 'External', oembedUrl: null }
}

async function fetchEmbed(track: Track): Promise<EmbedData> {
  const { url, title } = track
  const { platform, oembedUrl } = detectPlatform(url)

  if (!oembedUrl) {
    return { thumbnail: null, title: title || 'Track', platform, url }
  }

  try {
    const res = await fetch(oembedUrl, {
      // Cache for 24 hours — track artwork doesn't change often
      next: { revalidate: 86400 },
    })
    if (!res.ok) throw new Error(`oEmbed ${res.status}`)
    const data = await res.json()
    return {
      thumbnail: data.thumbnail_url || null,
      title: data.title || title || 'Track',
      platform,
      url,
    }
  } catch {
    // Graceful fallback if oEmbed fails (deleted track, network issue, etc.)
    return { thumbnail: null, title: title || 'Track', platform, url }
  }
}

export default async function FeaturedTracks({
  tracks,
}: {
  tracks: Track[]
}) {
  if (!tracks?.length) return null

  // Filter out empty/invalid URLs, then fetch all oEmbeds in parallel
  const validTracks = tracks.filter((t) => t.url?.trim())
  if (!validTracks.length) return null

  const embeds = await Promise.all(validTracks.map(fetchEmbed))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {embeds.map((embed, i) => (
        <a
          key={i}
          href={embed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          aria-label={`${embed.title} on ${embed.platform}`}
        >
          {/* Artwork */}
          <div
            className="relative aspect-square overflow-hidden mb-3"
            style={{ background: '#111' }}
          >
            {embed.thumbnail ? (
              // Using plain <img> so external CDN URLs don't need next.config remote patterns
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={embed.thumbnail}
                alt={embed.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'brightness(0.85)' }}
              />
            ) : (
              <div
                className="flex items-center justify-center h-full"
                style={{ color: '#444' }}
              >
                <span className="font-mono text-xs uppercase tracking-widest">
                  {embed.platform}
                </span>
              </div>
            )}

            {/* Play overlay on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="28" cy="28" r="28" fill={ACCENT} />
                <path d="M22 18l16 10-16 10z" fill="#000" />
              </svg>
            </div>

            {/* Corner accents on hover */}
            <div
              className="absolute top-2 left-2 w-3 h-3 transition-all duration-300"
              style={{
                borderTop: `2px solid transparent`,
                borderLeft: `2px solid transparent`,
              }}
            />
            <div
              className="absolute top-2 right-2 w-3 h-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                borderTop: `2px solid ${ACCENT}`,
                borderRight: `2px solid ${ACCENT}`,
              }}
            />
            <div
              className="absolute bottom-2 left-2 w-3 h-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                borderBottom: `2px solid ${ACCENT}`,
                borderLeft: `2px solid ${ACCENT}`,
              }}
            />
            <div
              className="absolute bottom-2 right-2 w-3 h-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                borderBottom: `2px solid ${ACCENT}`,
                borderRight: `2px solid ${ACCENT}`,
              }}
            />
          </div>

          {/* Title + platform */}
          <h3
            className="font-bold text-sm mb-1 truncate transition-colors duration-200 group-hover:text-[#4E7DFE]"
            style={{ color: '#fff' }}
          >
            {embed.title}
          </h3>
          <p
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: '#666' }}
          >
            {embed.platform}
          </p>
        </a>
      ))}
    </div>
  )
}