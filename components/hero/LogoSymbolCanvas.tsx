'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Fallback list — used until the API call completes, or if the call fails.
 * Keeps the logo from flashing empty on first load.
 */
const FALLBACK_ARTISTS = [
  'ADELE', 'ARCTIC MONKEYS', 'BICEP', 'BILLIE EILISH', 'BLOC PARTY',
  'BURIAL', 'CARIBOU', 'CAROLINE POLACHEK', 'CHROMATICS', 'DAFT PUNK',
  'DISCLOSURE', 'FLOATING POINTS', 'FOUR TET', 'JAMIE XX', 'JON HOPKINS',
  'PEGGY GOU', 'PORTISHEAD', 'THE XX', 'THOM YORKE', 'YOUNG FATHERS',
]

interface Cell {
  char: string
  x: number        // canvas pixel x
  y: number        // canvas pixel y
  lit: number      // 0–1 highlight amount (animated)
  target: number   // 0 or 1
  baseAlpha: number
}

export default function LogoSymbolCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cellsRef = useRef<Cell[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, down: false })
  const rafRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })

  // Artist list — starts with fallback, replaced once API responds
  const [artists, setArtists] = useState<string[]>(FALLBACK_ARTISTS)

  // Fetch real artist names once on mount
  useEffect(() => {
    let cancelled = false
    fetch('/api/artist-names')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data?.names) && data.names.length > 0) {
          setArtists(data.names)
        }
      })
      .catch(() => {
        // Silently keep fallback list on failure
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Char string derived from current artist list
  const artistChars = artists.join(' · ').split('')

  // Build grid from logo image (rebuilds when artistChars changes)
  const buildGrid = useCallback(
    (canvas: HTMLCanvasElement) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      sizeRef.current = { w, h, dpr }

      canvas.width = w * dpr
      canvas.height = h * dpr

      // Offscreen canvas to sample logo pixels
      const CHAR_W = 12
      const CHAR_H = 14
      const cols = Math.floor(w / CHAR_W)
      const rows = Math.floor(h / CHAR_H)

      const offscreen = document.createElement('canvas')
      offscreen.width = cols
      offscreen.height = rows
      const octx = offscreen.getContext('2d')!

      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.style.width = 'auto'
      img.style.height = 'auto'
      img.src = '/logo.webp'
      img.onload = () => {
        const logoAspect = img.naturalWidth / img.naturalHeight

        let drawW = cols * 0.98
        let drawH = drawW / logoAspect

        if (drawH > rows * 0.98) {
          drawH = rows * 0.98
          drawW = drawH * logoAspect
        }

        const ox = (cols - drawW) / 2
        const oy = (rows - drawH) / 2

        octx.fillStyle = '#000'
        octx.fillRect(0, 0, cols, rows)
        octx.globalCompositeOperation = 'source-over'
        octx.drawImage(img, ox, oy, drawW, drawH)

        const imageData = octx.getImageData(0, 0, cols, rows)
        const data = imageData.data

        const cells: Cell[] = []
        let charIndex = 0
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const idx = (row * cols + col) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const brightness = (r + g + b) / 3

            if (brightness > 30) {
              const alpha = Math.min(1, brightness / 255)
              cells.push({
                char: artistChars[charIndex % artistChars.length],
                x: col * CHAR_W + CHAR_W / 2,
                y: row * CHAR_H + CHAR_H,
                lit: 0,
                target: 0,
                baseAlpha: 0.12 + alpha * 0.18,
              })
              charIndex++
            }
          }
        }

        cellsRef.current = cells
      }
    },
    // Rebuild when the underlying artist string changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [artists.join('|')]
  )

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    buildGrid(canvas)

    const handleResize = () => buildGrid(canvas)
    window.addEventListener('resize', handleResize)

    const RADIUS = 90
    const GLOW_RADIUS = 50

    const draw = () => {
      const { w, h, dpr } = sizeRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      if (mx > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_RADIUS)
        grad.addColorStop(0, 'rgba(78,125,254,0.18)')
        grad.addColorStop(1, 'rgba(78,125,254,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(mx, my, GLOW_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.font = `bold 10px "Space Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'

      const cells = cellsRef.current
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]

        const dx = cell.x - mx
        const dy = cell.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        cell.target = dist < RADIUS ? Math.pow(1 - dist / RADIUS, 1.4) : 0

        const speed = cell.target > cell.lit ? 0.22 : 0.06
        cell.lit += (cell.target - cell.lit) * speed

        const lit = cell.lit

        let fillStyle: string
        let alpha: number
        if (lit > 0.01) {
          const r = Math.round(255 + (78 - 255) * lit)
          const g = Math.round(255 + (125 - 255) * lit)
          const b = Math.round(255 + (254 - 255) * lit)
          alpha = cell.baseAlpha + lit * (1 - cell.baseAlpha)
          fillStyle = `rgb(${r},${g},${b})`
        } else {
          fillStyle = '#ffffff'
          alpha = cell.baseAlpha
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = fillStyle

        if (lit > 0.05) {
          ctx.save()
          const scale = 1 + lit * 0.4
          ctx.translate(cell.x, cell.y - 6)
          ctx.scale(scale, scale)
          ctx.fillText(cell.char, 0, 0)
          ctx.restore()
        } else {
          ctx.fillText(cell.char, cell.x, cell.y)
        }
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [buildGrid])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999
    mouseRef.current.y = -9999
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block opacity-30 md:opacity-100"
      aria-label="MB Artists logo rendered in artist names"
      role="img"
    />
  )
}