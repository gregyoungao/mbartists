"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Golos_Text } from "next/font/google"

// Golos Text loaded only in this component — won't affect the rest of the site
const golos = Golos_Text({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

interface FeaturedArtist {
  slug: string
  name: string
  image: string
  genres: string[]
}

interface FeaturedRosterProps {
  artists: FeaturedArtist[]
}

const BG = "#d9d9d9"
const INK = "#0a0a0a"
const ACCENT = "#4E7DFE"
const CARD_WIDTH = 300
const GAP = 16

export default function FeaturedRoster({ artists }: FeaturedRosterProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (artists.length === 0) {
    return null
  }

  // Duplicate the list so the scroll wraps seamlessly (no jump back to start).
  // The CSS animation moves the track by exactly the width of ONE full set;
  // when it loops, the second set is already in view, so there's no visible reset.
  const loopedArtists = [...artists, ...artists]

  // Slower pace: ~5s per card width, with a 35s floor for short rosters
  const durationSec = Math.max(35, artists.length * 5)

  // Animation pauses only when a specific card is hovered, not the whole section
  const isPaused = hoveredIndex !== null

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden ${golos.className}`}
      style={{ background: BG }}
    >
      {/* Keyframes for the infinite scroll — defined inline so the file is self-contained */}
      <style>{`
        @keyframes mb-roster-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-50% - ${GAP / 2}px)); }
        }
      `}</style>

      {/* Section header — centered */}
      <div className="px-6 md:px-12 mb-12 text-center">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: ACCENT }}
        >
          {""}
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight"
          style={{ color: INK }}
        >
          Our Roster
        </h2>
      </div>

      {/* Track — duplicated list, animated horizontally. Centered on wide screens via max-w-7xl + mx-auto. */}
      <div className="overflow-hidden max-w-7xl mx-auto">
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            width: "max-content",
            animation: `mb-roster-scroll ${durationSec}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {loopedArtists.map((artist, index) => (
            <Link
              key={`${artist.slug}-${index}`}
              href={`/artists/${artist.slug}`}
              className="group relative flex-shrink-0 overflow-hidden"
              style={{ width: `${CARD_WIDTH}px` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="relative aspect-[3/4] overflow-hidden transition-all duration-300"
                style={{
                  boxShadow:
                    hoveredIndex === index
                      ? "0 0 30px rgba(78, 125, 254, 0.3)"
                      : "none",
                }}
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  sizes="300px"
                  style={{
                    filter:
                      hoveredIndex === index
                        ? "grayscale(0%)"
                        : "grayscale(100%)",
                  }}
                />

                {/* Overlay gradient — only when hovered, to make name readable */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)",
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                />

                {/* Corner accents on hover */}
                <div
                  className="absolute top-3 left-3 w-4 h-4 transition-all duration-300"
                  style={{
                    borderTop: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                    borderLeft: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                  }}
                />
                <div
                  className="absolute top-3 right-3 w-4 h-4 transition-all duration-300"
                  style={{
                    borderTop: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                    borderRight: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 w-4 h-4 transition-all duration-300"
                  style={{
                    borderBottom: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                    borderLeft: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                  }}
                />
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 transition-all duration-300"
                  style={{
                    borderBottom: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                    borderRight: `2px solid ${
                      hoveredIndex === index ? ACCENT : "transparent"
                    }`,
                  }}
                />

                {/* Artist name — only visible on hover, fades in/out */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300"
                  style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                >
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "#fff" }}
                  >
                    {artist.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tagline + CTA — centered below the row */}
      <div className="px-6 md:px-12 mt-10 text-center">
        <p
          className="max-w-2xl mx-auto mb-6 text-sm md:text-base"
          style={{ color: "#444" }}
        >
          We are chosen to represent some of the world&apos;s best artists
          across the genres of electronic dance music. Browse through our
          roster.
        </p>

        <Link
          href="/artists"
          className="inline-block font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-200"
          style={{ background: ACCENT, color: "#000" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#000"
            e.currentTarget.style.color = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = ACCENT
            e.currentTarget.style.color = "#000"
          }}
        >
          See All Artists
        </Link>
      </div>
    </section>
  )
}