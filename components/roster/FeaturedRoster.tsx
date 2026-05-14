"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface FeaturedArtist {
  slug: string
  name: string
  image: string
  genres: string[]
}

interface FeaturedRosterProps {
  artists: FeaturedArtist[]
}

export default function FeaturedRoster({ artists }: FeaturedRosterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener("scroll", checkScroll)
      return () => el.removeEventListener("scroll", checkScroll)
    }
  }, [])

  // Auto-slider — advances every 3s, pauses on hover, loops back to start
  useEffect(() => {
    if (isPaused || artists.length === 0) return

    const interval = setInterval(() => {
      const el = scrollRef.current
      if (!el) return

      const { scrollLeft, scrollWidth, clientWidth } = el
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 10

      if (atEnd) {
        // Loop back to the beginning
        el.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        // Advance by one card width (280px + 16px gap)
        el.scrollBy({ left: 296, behavior: "smooth" })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused, artists.length])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (artists.length === 0) {
    return null
  }

  return (
    <section
      className="relative py-16 md:py-24"
      style={{ background: "#000" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section header */}
      <div className="px-6 md:px-12 mb-8 flex items-end justify-between">
        <div>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-2"
            style={{ color: "#4E7DFE" }}
          >
            {"// Featured"}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "#fff" }}>
            Our Roster
          </h2>
        </div>

        {/* Navigation arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-10 h-10 flex items-center justify-center border transition-all duration-200"
            style={{
              borderColor: canScrollLeft ? "#4E7DFE" : "#333",
              color: canScrollLeft ? "#4E7DFE" : "#333",
              cursor: canScrollLeft ? "pointer" : "not-allowed",
            }}
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-10 h-10 flex items-center justify-center border transition-all duration-200"
            style={{
              borderColor: canScrollRight ? "#4E7DFE" : "#333",
              color: canScrollRight ? "#4E7DFE" : "#333",
              cursor: canScrollRight ? "pointer" : "not-allowed",
            }}
            aria-label="Scroll right"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
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
            style={{ width: "280px" }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Image container */}
            <div
              className="relative aspect-square overflow-hidden transition-all duration-300"
              style={{
                boxShadow: hoveredIndex === index ? "0 0 30px rgba(78, 125, 254, 0.3)" : "none",
              }}
            >
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="280px"
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
                  opacity: hoveredIndex === index ? 1 : 0.6,
                }}
              />

              {/* Corner accents on hover */}
              <div
                className="absolute top-3 left-3 w-4 h-4 transition-all duration-300"
                style={{
                  borderTop: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                  borderLeft: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                }}
              />
              <div
                className="absolute top-3 right-3 w-4 h-4 transition-all duration-300"
                style={{
                  borderTop: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                  borderRight: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                }}
              />
              <div
                className="absolute bottom-3 left-3 w-4 h-4 transition-all duration-300"
                style={{
                  borderBottom: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                  borderLeft: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                }}
              />
              <div
                className="absolute bottom-3 right-3 w-4 h-4 transition-all duration-300"
                style={{
                  borderBottom: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                  borderRight: `2px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                }}
              />

              {/* Artist info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="font-bold text-lg mb-1 transition-colors duration-300"
                  style={{ color: hoveredIndex === index ? "#4E7DFE" : "#fff" }}
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
                        color: "#4E7DFE",
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

        {/* View all card */}
        <Link
          href="/artists"
          className="group relative flex-shrink-0 flex items-center justify-center aspect-square border transition-all duration-300"
          style={{
            width: "280px",
            borderColor: "#333",
            background: "#0a0a0a",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#4E7DFE"
            e.currentTarget.style.boxShadow = "0 0 30px rgba(78, 125, 254, 0.2)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#333"
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          <div className="text-center">
            <p
              className="font-mono text-xs tracking-widest uppercase mb-2 transition-colors duration-300 group-hover:text-[#4E7DFE]"
              style={{ color: "#666" }}
            >
              {"=>"}
            </p>
            <p className="text-lg font-bold transition-colors duration-300 group-hover:text-[#4E7DFE]" style={{ color: "#fff" }}>
              View All Artists
            </p>
          </div>
        </Link>
      </div>

      {/* Gradient fade on edges */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none hidden md:block"
          style={{
            background: "linear-gradient(to right, #000, transparent)",
            marginTop: "120px",
          }}
        />
      )}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none hidden md:block"
          style={{
            background: "linear-gradient(to left, #000, transparent)",
            marginTop: "120px",
          }}
        />
      )}
    </section>
  )
}
