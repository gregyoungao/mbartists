"use client"

import { useState, useRef, useEffect, useCallback } from "react"


// Sample artist data - in production this comes from WordPress taxonomy
const SAMPLE_ARTISTS = [
  { name: "Arctic Monkeys", region: "uk" },
  { name: "Bicep", region: "uk" },
  { name: "Disclosure", region: "uk" },
  { name: "Jamie XX", region: "uk" },
  { name: "Fred Again", region: "uk" },
  { name: "Four Tet", region: "uk" },
  { name: "Floating Points", region: "uk" },
  { name: "Mount Kimbie", region: "uk" },
  { name: "Overmono", region: "uk" },
  { name: "The XX", region: "uk" },
  { name: "Thom Yorke", region: "uk" },
  { name: "Portishead", region: "uk" },
  { name: "Moderat", region: "europe" },
  { name: "Kiasmos", region: "europe" },
  { name: "Peggy Gou", region: "europe" },
  { name: "DJ Koze", region: "europe" },
  { name: "Objekt", region: "europe" },
  { name: "Nina Kraviz", region: "europe" },
  { name: "Billie Eilish", region: "north-america" },
  { name: "Panda Bear", region: "north-america" },
  { name: "Shlohmo", region: "north-america" },
  { name: "Caroline Polachek", region: "north-america" },
  { name: "Prefuse 73", region: "north-america" },
  { name: "Cornelius", region: "asia" },
  { name: "Yaeji", region: "asia" },
  { name: "Confidence Man", region: "oceania" },
  { name: "Flume", region: "oceania" },
  { name: "Pond", region: "oceania" },
  { name: "Black Coffee", region: "africa" },
  { name: "Sho Madjozi", region: "africa" },
  { name: "Arca", region: "south-america" },
  { name: "Nicola Cruz", region: "south-america" },
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

// ISO numeric country codes mapped to regions
// UK (826) is separated from Europe deliberately
const COUNTRY_REGION: Record<number, string> = {
  // UK
  826: "uk",
  // Europe
  8: "europe", 20: "europe", 40: "europe", 56: "europe", 70: "europe",
  100: "europe", 112: "europe", 191: "europe", 196: "europe", 203: "europe",
  208: "europe", 233: "europe", 246: "europe", 250: "europe", 276: "europe",
  300: "europe", 348: "europe", 352: "europe", 372: "europe", 380: "europe",
  428: "europe", 438: "europe", 440: "europe", 442: "europe", 470: "europe",
  492: "europe", 498: "europe", 499: "europe", 528: "europe", 578: "europe",
  616: "europe", 620: "europe", 642: "europe", 703: "europe", 705: "europe",
  724: "europe", 752: "europe", 756: "europe", 804: "europe", 807: "europe",
  // North America (USA, Canada, Mexico + Central America + Caribbean)
  124: "north-america", 840: "north-america", 484: "north-america",
  84: "north-america", 188: "north-america", 192: "north-america", 
  214: "north-america", 222: "north-america", 320: "north-america", 
  332: "north-america", 340: "north-america", 388: "north-america",
  558: "north-america", 591: "north-america", 630: "north-america",
  780: "north-america", 44: "north-america", 52: "north-america",
  // South America (Argentina is 32!)
  32: "south-america", 68: "south-america", 76: "south-america", 
  152: "south-america", 170: "south-america", 218: "south-america", 
  328: "south-america", 600: "south-america", 604: "south-america", 
  740: "south-america", 858: "south-america", 862: "south-america",
  // Africa
  12: "africa", 24: "africa", 72: "africa", 86: "africa", 108: "africa",
  120: "africa", 132: "africa", 140: "africa", 144: "africa", 174: "africa",
  175: "africa", 178: "africa", 180: "africa", 204: "africa", 226: "africa",
  231: "africa", 232: "africa", 260: "africa", 266: "africa", 270: "africa",
  288: "africa", 324: "africa", 384: "africa", 404: "africa", 426: "africa",
  430: "africa", 434: "africa", 450: "africa", 454: "africa", 466: "africa",
  478: "africa", 504: "africa", 508: "africa", 516: "africa", 562: "africa",
  566: "africa", 646: "africa", 678: "africa", 686: "africa", 694: "africa",
  706: "africa", 710: "africa", 716: "africa", 728: "africa", 729: "africa",
  732: "africa", 800: "africa", 818: "africa", 834: "africa", 894: "africa",
  // Asia
  4: "asia", 48: "asia", 50: "asia", 64: "asia", 96: "asia",
  104: "asia", 116: "asia", 156: "asia", 158: "asia", 162: "asia",
  356: "asia", 360: "asia", 364: "asia", 368: "asia", 376: "asia",
  392: "asia", 400: "asia", 410: "asia", 408: "asia", 414: "asia",
  417: "asia", 418: "asia", 422: "asia", 458: "asia", 462: "asia",
  496: "asia", 524: "asia", 512: "asia", 586: "asia", 608: "asia",
  634: "asia", 643: "asia", 682: "asia", 702: "asia", 704: "asia",
  760: "asia", 762: "asia", 764: "asia", 792: "asia", 795: "asia",
  784: "asia", 860: "asia", 887: "asia",
  // Oceania
  36: "oceania", 242: "oceania", 296: "oceania", 584: "oceania",
  583: "oceania", 520: "oceania", 554: "oceania", 585: "oceania",
  598: "oceania", 882: "oceania", 90: "oceania", 626: "oceania",
  548: "oceania", 776: "oceania", 798: "oceania",
}

interface Dot {
  x: number
  y: number
  region: string | null
}

export default function ArtistMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>()
  const litRef = useRef<Map<number, number>>(new Map())
  // Tracks the current viewport width category — set inside buildDots
  // and used by the draw loop to pick dot sizes.
  const isMobileRef = useRef(false)

  const regionData: Record<string, string[]> = {}
  SAMPLE_ARTISTS.forEach((a) => {
    if (!regionData[a.region]) regionData[a.region] = []
    regionData[a.region].push(a.name)
  })
  const maxCount = Math.max(...Object.values(regionData).map((a) => a.length))

  const buildDots = useCallback(
    async (width: number, height: number) => {
      // Guard against invalid dimensions
      if (width <= 0 || height <= 0) return

      // Smaller, denser dots on desktop. Slightly sparser on mobile but
      // proportionally smaller too so the map doesn't feel chunky on phones.
      const isMobile = width < 640
      isMobileRef.current = isMobile
      const DOT_SPACING = isMobile ? 5 : 6

      // Fetch world GeoJSON directly — no topojson-client needed
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      )
      const world = await res.json()

      // Manually convert TopoJSON arcs to GeoJSON-style rings
      const arcs: number[][][] = world.arcs
      const scale: [number, number] = world.transform.scale
      const translate: [number, number] = world.transform.translate

      // Decode a single arc (delta-encoded quantized coordinates)
      const decodeArc = (arcIdx: number): number[][] => {
        const reversed = arcIdx < 0
        const idx = reversed ? ~arcIdx : arcIdx
        const arc = arcs[idx]
        let x = 0, y = 0
        const pts = arc.map(([dx, dy]) => {
          x += dx; y += dy
          return [
            x * scale[0] + translate[0],
            y * scale[1] + translate[1],
          ]
        })
        return reversed ? pts.reverse() : pts
      }

      // Stitch arcs into a ring - properly join consecutive arcs
      const stitchRing = (arcIndices: number[]): number[][] => {
        const ring: number[][] = []
        arcIndices.forEach((arcIdx, idx) => {
          const decoded = decodeArc(arcIdx)
          const start = idx === 0 ? 0 : 1
          for (let i = start; i < decoded.length; i++) {
            ring.push(decoded[i])
          }
        })
        return ring
      }

      // Equirectangular projection
      const project = (lng: number, lat: number): [number, number] => [
        ((lng + 180) / 360) * width,
        ((90 - lat) / 180) * height,
      ]

      // Draw a polygon to canvas
      const drawPoly = (
        ctx: CanvasRenderingContext2D,
        rings: number[][][]
      ) => {
        ctx.beginPath()
        rings.forEach((ring) => {
          if (!ring.length) return
          const [sx, sy] = project(ring[0][0], ring[0][1])
          ctx.moveTo(sx, sy)
          for (let i = 1; i < ring.length; i++) {
            const [px, py] = project(ring[i][0], ring[i][1])
            ctx.lineTo(px, py)
          }
          ctx.closePath()
        })
        ctx.fill()
      }

      // Offscreen canvas — encode country id in pixel colour
      const offscreen = document.createElement("canvas")
      offscreen.width = width
      offscreen.height = height
      const octx = offscreen.getContext("2d")!

      const geometries = world.objects.countries.geometries as Array<{
        id: number
        type: string
        arcs: number[][][] | number[][][][]
      }>

      geometries.forEach((geo) => {
        if (!geo.arcs) return
        const id = geo.id as number
        const hi = Math.floor(id / 256)
        const lo = id % 256
        octx.fillStyle = `rgb(${hi},${lo},0)`

        if (geo.type === "Polygon") {
          const rings = (geo.arcs as number[][][]).map(stitchRing)
          drawPoly(octx, rings)
        } else if (geo.type === "MultiPolygon") {
          ;(geo.arcs as number[][][][]).forEach((polygon) => {
            const rings = polygon.map(stitchRing)
            drawPoly(octx, rings)
          })
        }
      })

      const imageData = octx.getImageData(0, 0, width, height)
      const data = imageData.data

      const dots: Dot[] = []
      for (let py = 0; py < height; py += DOT_SPACING) {
        for (let px = 0; px < width; px += DOT_SPACING) {
          const idx = (py * width + px) * 4
          const hi = data[idx]
          const lo = data[idx + 1]
          const id = hi * 256 + lo
          if (id === 0) continue
          const region = COUNTRY_REGION[id] ?? null
          dots.push({ x: px, y: py, region })
        }
      }

      dotsRef.current = dots
      litRef.current = new Map(dots.map((_, i) => [i, 0]))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Resize observer — rebuild dots on size change
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

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const dpr = window.devicePixelRatio

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const RADIUS = isMobileRef.current ? 60 : 100

      // Mobile dots are noticeably smaller so the map reads cleanly on phones
      const baseR = isMobileRef.current ? 0.8 : 1.5
      const litR = isMobileRef.current ? 0.8 : 1.5

      dotsRef.current.forEach((dot, i) => {
        const region = dot.region
        const count = region ? (regionData[region]?.length ?? 0) : 0
        const baseIntensity = region && count > 0 ? 0.15 + (count / maxCount) * 0.55 : 0.04

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
        const dotR = baseR + next * litR

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

    // Find nearest dot with a region
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
                {REGION_LABELS[hoveredRegion]} — {regionData[hoveredRegion].length} artists
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