"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Navigation from "@/components/nav/Navigation"

// Helper to create URL slug from artist name
const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

// Sample dubstep/electronic artist roster
const ARTISTS = [
  { name: "Barely Alive", genres: ["Dubstep", "Heavy Bass"], location: "North America", image: "/placeholder-artist.jpg", hasPage: true },
  { name: "Skrillex", genres: ["Dubstep", "Electronic"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Rusko", genres: ["Dubstep", "Drum & Bass"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Caspa", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Benga", genres: ["Dubstep", "Grime"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Skream", genres: ["Dubstep", "House"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Excision", genres: ["Dubstep", "Heavy Bass"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Zomboy", genres: ["Dubstep", "Electro"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "12th Planet", genres: ["Dubstep"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Flux Pavilion", genres: ["Dubstep", "Electronic"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Doctor P", genres: ["Dubstep", "Bass"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Borgore", genres: ["Dubstep", "Electro House"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Knife Party", genres: ["Dubstep", "Electro House"], location: "Oceania", image: "/placeholder-artist.jpg" },
  { name: "Zeds Dead", genres: ["Dubstep", "House"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Datsik", genres: ["Dubstep"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Nero", genres: ["Dubstep", "Drum & Bass"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Chase & Status", genres: ["Drum & Bass", "Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Bassnectar", genres: ["Dubstep", "IDM"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Virtual Riot", genres: ["Dubstep", "Complextro"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "MUST DIE!", genres: ["Dubstep", "Trap"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Getter", genres: ["Dubstep", "Trap"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Eptic", genres: ["Dubstep", "Heavy Bass"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Modestep", genres: ["Dubstep", "Rock"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Habstrakt", genres: ["Bass House", "Dubstep"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Destroid", genres: ["Dubstep", "Metal"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Cookie Monsta", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Funtcase", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Bar9", genres: ["Dubstep", "Electro"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "501", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Specimen A", genres: ["Dubstep", "Drum & Bass"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Camo & Krooked", genres: ["Drum & Bass", "Dubstep"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Noisia", genres: ["Drum & Bass", "Dubstep"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Pendulum", genres: ["Drum & Bass", "Rock"], location: "Oceania", image: "/placeholder-artist.jpg" },
  { name: "Sub Focus", genres: ["Drum & Bass", "Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Koan Sound", genres: ["Dubstep", "Glitch Hop"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Kill The Noise", genres: ["Dubstep", "Electro"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Feed Me", genres: ["Dubstep", "Electro House"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Savant", genres: ["Dubstep", "Complextro"], location: "Europe", image: "/placeholder-artist.jpg" },
  { name: "Figure", genres: ["Dubstep", "Horror"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Bare Noize", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Gemini", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Midnight Tyrannosaurus", genres: ["Dubstep", "Riddim"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "Svdden Death", genres: ["Dubstep", "Riddim"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "PEEKABOO", genres: ["Dubstep", "Experimental"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "G Jones", genres: ["Dubstep", "Experimental"], location: "North America", image: "/placeholder-artist.jpg" },
  { name: "TRUTH", genres: ["Dubstep", "Deep"], location: "Oceania", image: "/placeholder-artist.jpg" },
  { name: "Digital Mystikz", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Mala", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Coki", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Distance", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
  { name: "Youngsta", genres: ["Dubstep"], location: "UK", image: "/placeholder-artist.jpg" },
]

// Extract unique genres and locations
const ALL_GENRES = Array.from(new Set(ARTISTS.flatMap((a) => a.genres))).sort()
const ALL_LOCATIONS = Array.from(new Set(ARTISTS.map((a) => a.location))).sort()

export default function ArtistsPage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const gridRef = useRef<HTMLDivElement>(null)

  // Filter artists
  const filteredArtists = ARTISTS.filter((artist) => {
    const genreMatch = selectedGenres.length === 0 || artist.genres.some((g) => selectedGenres.includes(g))
    const locationMatch = selectedLocations.length === 0 || selectedLocations.includes(artist.location)
    return genreMatch && locationMatch
  }).sort((a, b) => a.name.localeCompare(b.name))

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
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedLocations([])
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        {/* Background glow following cursor */}
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(78, 125, 254, 0.06), transparent 40%)`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#4E7DFE" }}>
            Our Roster
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance mb-6">
            Artists
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: "#666" }}>
            {filteredArtists.length} artists across {ALL_LOCATIONS.length} regions
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 pb-8 sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Genre filters */}
          <div className="mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#444" }}>
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

          {/* Location filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#444" }}>
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

            {(selectedGenres.length > 0 || selectedLocations.length > 0) && (
              <button
                onClick={clearFilters}
                className="font-mono text-xs px-4 py-2 transition-colors duration-200"
                style={{ color: "#4E7DFE" }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Artist Grid */}
      <section className="px-6 md:px-12 py-12">
        <div ref={gridRef} className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {filteredArtists.map((artist, index) => {
              const CardWrapper = artist.hasPage ? Link : "div"
              const cardProps = artist.hasPage ? { href: `/artists/${toSlug(artist.name)}` } : {}
              
              return (
              <CardWrapper
                key={artist.name}
                {...cardProps}
                className="group relative aspect-square cursor-pointer overflow-hidden block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: hoveredIndex === index ? "#0a0a0a" : "#050505",
                }}
              >
                {/* Placeholder image - grayscale, brightens on hover */}
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, #111 0%, #0a0a0a 100%)`,
                    filter: hoveredIndex === index ? "brightness(1.2)" : "brightness(0.7)",
                  }}
                />

                {/* Blue glow on hover */}
                {hoveredIndex === index && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(78, 125, 254, 0.15) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Artist info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 z-10">
                  <h3
                    className="font-bold text-sm md:text-base truncate transition-colors duration-300"
                    style={{ color: hoveredIndex === index ? "#fff" : "#888" }}
                  >
                    {artist.name}
                  </h3>
                  
                  {/* Show genres on hover */}
                  <div
                    className="flex flex-wrap gap-1 mt-1 transition-all duration-300"
                    style={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      transform: hoveredIndex === index ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    {artist.genres.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="font-mono text-[9px] tracking-wider uppercase"
                        style={{ color: "#4E7DFE" }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-2 right-2 w-2 h-2 transition-all duration-300"
                  style={{
                    borderTop: `1px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                    borderRight: `1px solid ${hoveredIndex === index ? "#4E7DFE" : "transparent"}`,
                  }}
                />
              </CardWrapper>
              )
            })}
          </div>

          {/* Empty state */}
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
        </div>
      </section>

      {/* Footer stats */}
      <section className="px-6 md:px-12 py-8 border-t" style={{ borderColor: "#111" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="font-mono text-xs" style={{ color: "#333" }}>
            Showing <span style={{ color: "#4E7DFE" }}>{filteredArtists.length}</span> of {ARTISTS.length} artists
          </p>
          <p className="font-mono text-xs" style={{ color: "#333" }}>
            MB Artists <span style={{ color: "#4E7DFE" }}>2024</span>
          </p>
        </div>
      </section>
    </main>
  )
}
