"use client"

import { useRef, useState, useEffect } from "react"
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

const BG = "#EEE9E1"
const INK = "#0a0a0a"
const ACCENT = "#4E7DFE"

// Card dimensions — 300x400 (3:4 portrait)
const CARD_WIDTH = 300

export default function FeaturedRoster({ artists }: FeaturedRosterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-slider — advances every 3s, pauses on hover, loops back
  useEffect(() => {
    if (isPaused || artists.length === 0) return

    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return

      const { scrollLeft, scrollWidth, clientWidth } = el
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 10

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        el.scrollBy({ left: CARD_WIDTH + 16, behavior: "smooth" })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused, artists.length])

  if (artists.length === 0) {
    return null
  }

  return (
    <section
      className={`relative py-20 md:py-28 ${golos.className}`}
      style={{ background: BG }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section header — centered */}
      <div className="px-6 md:px-12 mb-12 text-center">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: ACCENT }}
        >
          {"// Featured"}
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight"
          style={{ color: INK }}
        >
          Our Roster
        </h2>
      </div>

      {/* Scrollable artist cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {artists.map((artist, index) => (
          <Link
            key={artist.slug}
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

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
                  opacity: hoveredIndex === index ? 1 : 0.5,
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

              {/* Artist info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="font-bold text-lg mb-1 transition-colors duration-300"
                  style={{
                    color: hoveredIndex === index ? ACCENT : "#fff",
                  }}
                >
                  {artist.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {artist.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider"
                      style={{
                        background: "rgba(78, 125, 254, 0.2)",
                        color: ACCENT,
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
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