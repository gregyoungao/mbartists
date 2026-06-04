"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface ArtistRegion {
  name: string
  region: string
}

interface ArtistMapProps {
  /** Each artist may appear multiple times if active in multiple regions. */
  artists?: ArtistRegion[]
}

// Fallback used only when no artists prop is provided (so /demo or storybook
// renders don't break). In production the homepage passes real data.
const FALLBACK_ARTISTS: ArtistRegion[] = [
  { name: "Sample Artist", region: "uk" },
]

const REGION_LABELS: Record<string, string> = {
  uk: "UK",
  europe: "Europe",
  "north-america": "North America",
  "south-america": "South America",
  asia: "Asia",
  africa: "Africa",
  oceania: "Oceania",
}

// Simplified continental boundary polygons (lng, lat).
// UK is checked first so it wins over the Europe polygon it sits inside.
const CONTINENT_BOUNDARIES: { region: string; polygon: [number, number][] }[] = [
  {
    region: "uk",
    polygon: [
      [-11, 49], [-5.5, 49.5], [-5, 50], [1.8, 51], [1.8, 52.5], [1.5, 53], [0.5, 54], [0, 55.5],
      [-1.5, 57], [-3, 58.5], [-5, 59], [-7, 58.5], [-8.5, 57.5], [-10, 56], [-10.5, 54.5],
      [-9.5, 53], [-10, 52], [-11, 51], [-11, 49]
    ]
  },
  {
    region: "europe",
    polygon: [
      [-10, 36], [-9, 37], [-9, 38.5], [-7, 37], [-5.5, 36], [0, 36], [3, 37], [5, 43],
      [9, 41], [12, 37], [15, 36], [18, 40], [20, 36], [26, 35], [28, 36], [30, 37],
      [32, 37], [35, 36.5], [37, 37], [40, 39], [42, 42], [44, 43], [48, 44], [50, 46],
      [55, 50], [60, 55], [68, 68], [60, 70], [50, 71], [30, 71], [20, 70], [15, 69],
      [10, 64], [5, 62], [8, 58], [12, 56], [11, 54], [14, 54], [10, 54], [8, 55],
      [6, 53.5], [4, 52], [3, 51], [-1, 50], [-5, 48.5], [-2, 47], [-4.5, 44],
      [-8, 44], [-9, 41], [-10, 36]
    ]
  },
  {
    region: "north-america",
    polygon: [
      [-170, 52], [-168, 55], [-166, 60], [-162, 63], [-152, 60], [-148, 61], [-140, 60],
      [-137, 59], [-135, 57], [-133, 55], [-130, 54], [-128, 50], [-125, 48], [-124, 42],
      [-120, 35], [-117, 32], [-115, 28], [-110, 24], [-105, 20], [-97, 18], [-95, 16],
      [-88, 15], [-85, 10], [-83, 8], [-78, 8],
      [-75, 10], [-70, 12], [-65, 18], [-60, 14], [-60, 20], [-65, 20], [-70, 22],
      [-75, 23], [-80, 25], [-82, 27], [-80, 30], [-75, 35], [-70, 40], [-67, 45],
      [-65, 45], [-60, 47], [-52, 47], [-55, 50],
      [-45, 60], [-43, 65], [-35, 66], [-22, 70], [-18, 76], [-20, 82], [-35, 83],
      [-55, 83], [-70, 80], [-75, 78], [-80, 76], [-95, 75], [-110, 73],
      [-130, 72], [-145, 70], [-155, 71], [-165, 68], [-168, 65], [-170, 60], [-170, 52]
    ]
  },
  {
    region: "south-america",
    polygon: [
      [-78, 10], [-75, 11], [-72, 12], [-70, 12], [-67, 11], [-65, 10], [-62, 10],
      [-60, 9], [-58, 7], [-55, 6], [-52, 5], [-50, 4], [-50, 2], [-48, 0],
      [-45, -2], [-42, -3], [-38, -5], [-35, -8], [-35, -12], [-37, -15], [-38, -18],
      [-40, -22], [-45, -24], [-48, -26], [-50, -28], [-53, -32], [-57, -35],
      [-60, -38], [-63, -40], [-65, -46], [-68, -50], [-72, -52], [-75, -52],
      [-74, -48], [-73, -44], [-72, -40], [-71, -35], [-70, -30], [-70, -25],
      [-70, -18], [-75, -15], [-77, -12], [-80, -8], [-81, -5], [-80, -2],
      [-80, 1], [-78, 4], [-77, 7], [-78, 10]
    ]
  },
  {
    region: "africa",
    polygon: [
      [-17, 21], [-17, 25], [-13, 28], [-10, 32], [-6, 35], [-2, 36], [5, 37], [10, 37],
      [11, 34], [15, 32], [20, 32], [25, 32], [30, 31], [33, 30], [35, 28], [37, 25],
      [40, 20], [43, 12], [47, 8], [51, 11], [51, 5], [48, 0], [45, -5], [42, -10],
      [40, -15], [38, -20], [35, -26], [32, -28], [28, -33], [25, -34], [20, -35],
      [17, -33], [15, -28], [12, -18], [14, -12], [12, -6], [10, -2], [8, 4], [5, 5],
      [2, 6], [-2, 5], [-5, 5], [-8, 4], [-10, 6], [-15, 11], [-17, 14], [-17, 21]
    ]
  },
  {
    region: "asia",
    polygon: [
      [35, 37], [36, 35], [35, 32], [34, 30], [34, 28], [35, 25], [38, 20], [42, 15],
      [43, 12], [45, 12], [48, 15], [52, 17], [55, 22], [57, 25],
      [60, 22], [63, 22], [68, 24], [72, 20], [77, 8], [80, 6], [85, 8], [88, 15],
      [92, 16], [95, 10],
      [98, 5], [100, 2], [104, 1], [106, -2], [108, -6], [112, -8], [117, -8],
      [120, -10], [125, -8], [127, -5], [130, -3], [135, -5], [140, -5], [142, -8],
      [145, 0], [145, 15], [140, 20], [130, 25],
      [128, 32], [130, 35], [135, 36], [140, 38], [142, 40], [145, 42], [146, 45],
      [150, 50], [155, 55], [160, 60], [170, 65], [180, 68],
      [180, 72], [170, 72], [160, 73], [140, 75], [120, 75], [100, 78], [80, 75],
      [70, 72], [68, 68], [60, 55],
      [55, 50], [50, 46], [48, 44], [44, 43], [42, 42], [40, 39], [38, 38], [35, 37]
    ]
  },
  {
    region: "oceania",
    polygon: [
      [140, -2], [145, -2], [150, -5], [155, -6], [160, -8], [165, -10], [170, -15],
      [175, -20], [180, -25], [180, -35], [175, -40], [170, -45], [168, -47],
      [165, -47], [173, -40], [178, -37], [180, -35],
      [155, -40], [150, -38], [145, -40], [140, -38], [137, -35], [130, -32],
      [125, -33], [118, -35], [115, -34], [113, -25], [115, -20], [120, -18],
      [128, -15], [135, -12], [140, -10], [140, -2]
    ]
  },
]

function pointInPolygon(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  return inside
}

function getRegionForPoint(lng: number, lat: number): string | null {
  for (const boundary of CONTINENT_BOUNDARIES) {
    if (pointInPolygon(lng, lat, boundary.polygon)) {
      return boundary.region
    }
  }
  return null
}

interface Dot {
  x: number
  y: number
  region: string | null
}

export default function ArtistMap({ artists }: ArtistMapProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>()
  const litRef = useRef<Map<number, number>>(new Map())

  // Group artists by region; fall back to placeholder data if prop is empty.
  const sourceArtists =
    artists && artists.length > 0 ? artists : FALLBACK_ARTISTS

  const regionData: Record<string, string[]> = {}
  sourceArtists.forEach((a) => {
    if (!regionData[a.region]) regionData[a.region] = []
    if (!regionData[a.region].includes(a.name)) {
      regionData[a.region].push(a.name)
    }
  })
  // Sort each region's artist names alphabetically for stable tooltips
  Object.values(regionData).forEach((list) => list.sort((a, b) => a.localeCompare(b)))

  const counts = Object.values(regionData).map((a) => a.length)
  const maxCount = counts.length > 0 ? Math.max(...counts) : 1

  const buildDots = useCallback(
    async (width: number, height: number) => {
      if (width <= 0 || height <= 0) return

      const isMobile = width < 600
      const DOT_SPACING = isMobile ? 4 : 6

      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
          { cache: 'force-cache' }
        )
        const geojson = await res.json()

        const project = (lng: number, lat: number): [number, number] => [
          ((lng + 180) / 360) * width,
          ((90 - lat) / 180) * height,
        ]

        const crossesAntimeridian = (coords: number[][]): boolean => {
          for (let i = 1; i < coords.length; i++) {
            if (Math.abs(coords[i][0] - coords[i - 1][0]) > 180) return true
          }
          return false
        }

        const drawRing = (ctx: CanvasRenderingContext2D, coords: number[][]) => {
          if (coords.length < 3 || crossesAntimeridian(coords)) return
          ctx.moveTo(...project(coords[0][0], coords[0][1]))
          for (let i = 1; i < coords.length; i++) {
            ctx.lineTo(...project(coords[i][0], coords[i][1]))
          }
          ctx.closePath()
        }

        const offscreen = document.createElement("canvas")
        offscreen.width = width
        offscreen.height = height
        const octx = offscreen.getContext("2d")!
        octx.fillStyle = "#000"
        octx.fillRect(0, 0, width, height)

        type GeoFeature = {
          properties?: Record<string, unknown>
          geometry: { type: string; coordinates: number[][][] | number[][][][] }
        }

        const features: GeoFeature[] = geojson.features ?? []
        const skipCountries = ["Antarctica"]

        octx.fillStyle = "#fff"
        features.forEach((feature) => {
          const name = (feature.properties?.NAME || feature.properties?.name || feature.properties?.ADMIN || "") as string
          if (skipCountries.some(c => name?.includes(c))) return

          const { type, coordinates } = feature.geometry
          if (type === "Polygon") {
            octx.beginPath()
            ;(coordinates as number[][][]).forEach((ring) => drawRing(octx, ring))
            octx.fill()
          } else if (type === "MultiPolygon") {
            ;(coordinates as number[][][][]).forEach((polygon) => {
              octx.beginPath()
              polygon.forEach((ring) => drawRing(octx, ring))
              octx.fill()
            })
          }
        })

        const imageData = octx.getImageData(0, 0, width, height)
        const data = imageData.data

        const toLngLat = (px: number, py: number): [number, number] => {
          const lng = (px / width) * 360 - 180
          const lat = 90 - (py / height) * 180
          return [lng, lat]
        }

        const dots: Dot[] = []
        const maxY = Math.floor(height * 0.83) // Exclude Antarctica latitude

        for (let py = 0; py < maxY; py += DOT_SPACING) {
          for (let px = 0; px < width; px += DOT_SPACING) {
            const idx = (py * width + px) * 4
            const isLand = data[idx] > 128

            if (isLand) {
              const [lng, lat] = toLngLat(px, py)
              const region = getRegionForPoint(lng, lat)
              dots.push({ x: px, y: py, region })
            }
          }
        }

        dotsRef.current = dots
        litRef.current = new Map(dots.map((_, i) => [i, 0]))
      } catch (error) {
        console.error("Map fetch error:", error)
      }
    },
    []
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      const h = w * 0.5
      const dpr = window.devicePixelRatio
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      buildDots(w, h)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [buildDots])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const dpr = window.devicePixelRatio

    const draw = () => {
      const w = canvas.width / dpr
      const isMobile = w < 600
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const RADIUS = isMobile ? 60 : 100

      dotsRef.current.forEach((dot, i) => {
        const region = dot.region
        const count = region ? (regionData[region]?.length ?? 0) : 0
        const baseIntensity = count > 0 ? 0.15 + (count / maxCount) * 0.55 : 0.05

        const dx = dot.x - mx
        const dy = dot.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        const prev = litRef.current.get(i) ?? 0
        const target = dist < RADIUS ? 1 - dist / RADIUS : 0
        const next = prev + (target - prev) * (target > prev ? 0.15 : 0.05)
        litRef.current.set(i, next)

        const intensity = Math.min(1, baseIntensity + next * 0.7)
        const r = Math.round(78 * intensity)
        const g = Math.round(125 * intensity)
        const b = Math.round(254 * intensity)
        const baseRadius = isMobile ? 1 : 1.5
        const dotR = baseRadius + next * (isMobile ? 1 : 1.5)

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fill()
      })

      ctx.restore()
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [regionData, maxCount])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseRef.current = { x, y }
    setTooltipPos({ x: e.clientX, y: e.clientY })

    let nearest: string | null = null
    let nearestDist = 40
    dotsRef.current.forEach((dot) => {
      if (!dot.region) return
      const dx = dot.x - x
      const dy = dot.y - y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < nearestDist) { nearestDist = d; nearest = dot.region }
    })
    setHoveredRegion(nearest)
  }

  const handleMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 }
    setHoveredRegion(null)
  }

  return (
    <section className="relative w-full bg-black flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center mb-10">
        <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#4E7DFE" }}>
          Global Roster
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-balance">
          Artists Worldwide
        </h2>
        <p className="text-sm mt-4 font-mono" style={{ color: "#444" }}>
          Brighter regions indicate more artists — hover to explore.
        </p>
      </div>

      <div ref={containerRef} className="relative w-full" style={{ maxWidth: "1400px" }}>
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {hoveredRegion && regionData[hoveredRegion] && (
          <div
            className="fixed pointer-events-none z-50"
            style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 10 }}
          >
            <div
              className="border px-4 py-3"
              style={{ background: "#050505", borderColor: "#222", minWidth: "180px" }}
            >
              <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "#4E7DFE" }}>
                {REGION_LABELS[hoveredRegion]} — {regionData[hoveredRegion].length} {regionData[hoveredRegion].length === 1 ? "artist" : "artists"}
              </p>
              <div className="flex flex-col gap-0.5">
                {regionData[hoveredRegion].slice(0, 8).map((artist) => (
                  <span key={artist} className="font-mono text-xs" style={{ color: "#666" }}>
                    {artist}
                  </span>
                ))}
                {regionData[hoveredRegion].length > 8 && (
                  <span className="font-mono text-xs" style={{ color: "#4E7DFE" }}>
                    +{regionData[hoveredRegion].length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-8">
        <span className="font-mono text-xs" style={{ color: "#333" }}>Fewer</span>
        <div
          className="h-1.5 w-32"
          style={{ background: "linear-gradient(to right, rgb(8,13,26), rgb(78,125,254))" }}
        />
        <span className="font-mono text-xs" style={{ color: "#4E7DFE" }}>More</span>
      </div>
    </section>
  )
}