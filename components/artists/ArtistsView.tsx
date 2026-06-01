"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import type { PublicArtist } from "@/app/artists/page"

export default function ArtistsView({ artists }: { artists: PublicArtist[] }) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Genre filter chips include ALL genres assigned to any artist (primary OR
  // secondary). Filtering matches if any of the artist's genres is selected.
  // The "primary" concept still drives display order on the card chips.
  const ALL_GENRES = Array.from(
    new Set(artists.flatMap((a) => a.genres))
  ).sort()

  const ALL_LOCATIONS = Array.from(
    new Set(artists.flatMap((a) => a.locations))
  ).sort()

  // Filter artists — genre filter matches if ANY of the artist's genres is selected.
  const filteredArtists = artists
    .filter((artist) => {
      const genreMatch =
        selectedGenres.length === 0 ||
        artist.genres.some((g) => selectedGenres.includes(g))
      const locationMatch =
        selectedLocations.length === 0 ||
        artist.locations.some((l) => selectedLocations.includes(l))
      return genreMatch && locationMatch
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedLocations([])
  }

  const activeFilterCount = selectedGenres.length + selectedLocations.length

  /**
   * Return the artist's genres ordered with PRIMARY first, then the rest
   * in their natural order. Used to display on the card.
   */
  const orderedGenres = (artist: PublicArtist): string[] => {
    if (!artist.primaryGenre) return artist.genres
    return [
      artist.primaryGenre,
      ...artist.genres.filter((g) => g !== artist.primaryGenre),
    ]
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
        {/* Background glow following cursor */}
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(78, 125, 254, 0.06), transparent 40%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: "#4E7DFE" }}
          >
            Our Roster
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-6">
            MB Artists
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: "#666" }}>
            {filteredArtists.length} artists
            {ALL_LOCATIONS.length > 0 && ` across ${ALL_LOCATIONS.length} regions`}
          </p>
        </div>
      </section>

      {/* Filters — collapsible */}
      {artists.length > 0 && (
        <section className="px-4 md:px-8 sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            {/* Toggle bar — always visible */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between py-4 group"
              aria-expanded={filtersOpen}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs uppercase tracking-widest transition-colors duration-200 group-hover:text-[#4E7DFE]"
                  style={{ color: filtersOpen ? "#4E7DFE" : "#888" }}
                >
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: "#4E7DFE", color: "#000" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      clearFilters()
                    }}
                    className="font-mono text-[10px] uppercase tracking-widest hover:text-[#4E7DFE] transition-colors cursor-pointer"
                    style={{ color: "#666" }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        clearFilters()
                      }
                    }}
                  >
                    Clear
                  </span>
                )}
                <span
                  className="font-mono text-xs transition-transform duration-200"
                  style={{
                    color: filtersOpen ? "#4E7DFE" : "#888",
                    transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  aria-hidden
                >
                  ▾
                </span>
              </div>
            </button>

            {/* Collapsible content */}
            <div
              className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
              style={{
                maxHeight: filtersOpen ? "600px" : "0px",
                opacity: filtersOpen ? 1 : 0,
              }}
            >
              <div className="pb-6 space-y-4">
                {/* Genre filters — all genres, not just primaries */}
                {ALL_GENRES.length > 0 && (
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-widest uppercase mb-2"
                      style={{ color: "#444" }}
                    >
                      Genres
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_GENRES.map((genre) => {
                        const isActive = selectedGenres.includes(genre)
                        return (
                          <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className="font-mono text-xs px-3 py-1.5 border transition-all duration-200"
                            style={{
                              borderColor: isActive ? "#4E7DFE" : "#222",
                              background: isActive ? "#4E7DFE" : "transparent",
                              color: isActive ? "#000" : "#666",
                            }}
                          >
                            {genre}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Location filters */}
                {ALL_LOCATIONS.length > 0 && (
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-widest uppercase mb-2"
                      style={{ color: "#444" }}
                    >
                      Locations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_LOCATIONS.map((location) => {
                        const isActive = selectedLocations.includes(location)
                        return (
                          <button
                            key={location}
                            onClick={() => toggleLocation(location)}
                            className="font-mono text-xs px-3 py-1.5 border transition-all duration-200"
                            style={{
                              borderColor: isActive ? "#4E7DFE" : "#222",
                              background: isActive ? "#4E7DFE" : "transparent",
                              color: isActive ? "#000" : "#666",
                            }}
                          >
                            {location}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Artist Grid */}
      <section className="px-4 md:px-8 py-12">
        <div ref={gridRef} className="max-w-7xl mx-auto">
          {/* Empty state — no artists at all */}
          {artists.length === 0 ? (
            <div className="text-center py-24">
              <p
                className="font-mono text-xs tracking-widest uppercase mb-3"
                style={{ color: "#4E7DFE" }}
              >
                {"// Coming Soon"}
              </p>
              <p className="font-mono text-sm" style={{ color: "#444" }}>
                No artists have been added yet. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
                {filteredArtists.map((artist, index) => (
                  <Link
                    key={artist.slug}
                    href={`/artists/${artist.slug}`}
                    className="group relative aspect-square cursor-pointer overflow-hidden block"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      background:
                        hoveredIndex === index ? "#0a0a0a" : "#050505",
                    }}
                  >
                    {/* Artist image */}
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        backgroundImage: `url(${artist.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter:
                          hoveredIndex === index
                            ? "brightness(1.1)"
                            : "brightness(0.7)",
                      }}
                    />

                    {/* Dark gradient for text legibility */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                      }}
                    />

                    {/* Blue glow on hover */}
                    {hoveredIndex === index && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 50%, rgba(78, 125, 254, 0.15) 0%, transparent 70%)",
                        }}
                      />
                    )}

                    {/* Artist info */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 z-10">
                      <h3
                        className="font-bold text-sm md:text-base truncate transition-colors duration-300"
                        style={{
                          color: hoveredIndex === index ? "#fff" : "#888",
                        }}
                      >
                        {artist.name}
                      </h3>

                      {/* Genres — comma-separated, primary first */}
                      {artist.genres.length > 0 && (
                        <div
                          className="mt-1 transition-all duration-300"
                          style={{
                            opacity: hoveredIndex === index ? 1 : 0,
                            transform:
                              hoveredIndex === index
                                ? "translateY(0)"
                                : "translateY(8px)",
                          }}
                        >
                          <span
                            className="font-mono text-[9px] tracking-wider uppercase truncate block"
                            style={{ color: "#4E7DFE" }}
                          >
                            {orderedGenres(artist).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Corner accent */}
                    <div
                      className="absolute top-2 right-2 w-2 h-2 transition-all duration-300"
                      style={{
                        borderTop: `1px solid ${
                          hoveredIndex === index ? "#4E7DFE" : "transparent"
                        }`,
                        borderRight: `1px solid ${
                          hoveredIndex === index ? "#4E7DFE" : "transparent"
                        }`,
                      }}
                    />
                  </Link>
                ))}
              </div>

              {/* Empty state — filters too narrow */}
              {filteredArtists.length === 0 && (
                <div className="text-center py-24">
                  <p className="font-mono text-sm" style={{ color: "#444" }}>
                    No artists match the selected filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="font-mono text-xs mt-4 px-6 py-2 border transition-colors duration-200"
                    style={{ borderColor: "#4E7DFE", color: "#4E7DFE" }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer stats */}
      <section className="px-4 md:px-8 py-8 border-t" style={{ borderColor: "#111" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-mono text-xs" style={{ color: "#333" }}>
            Showing{" "}
            <span style={{ color: "#4E7DFE" }}>{filteredArtists.length}</span> of{" "}
            {artists.length} artists
          </p>
          <p className="font-mono text-xs" style={{ color: "#333" }}>
            MB Artists <span style={{ color: "#4E7DFE" }}>2026</span>
          </p>
        </div>
      </section>
    </>
  )
}
