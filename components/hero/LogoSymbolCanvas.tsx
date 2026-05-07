'use client'

import { useEffect, useRef, useCallback } from 'react'

const ARTISTS = [
  'ADELE', 'ARCTIC MONKEYS', 'BICEP', 'BILLIE EILISH', 'BLOC PARTY',
  'BURIAL', 'CARIBOU', 'CAROLINE POLACHEK', 'CHROMATICS', 'CONFIDENCE MAN',
  'DAFT PUNK', 'DANIEL AVERY', 'DISCLOSURE', 'DJ KOZE', 'DJ SHADOW',
  'DRAIN GANG', 'FLOATING POINTS', 'FOUR TET', 'FRED AGAIN', 'GEORGE FITZGERALD',
  'GOLDIE', 'HELEN MONEY', 'HERBIE HANCOCK', 'HOOKWORMS', 'JAMIE XX',
  'JOHN TALABOT', 'JOHN GRANT', 'JON HOPKINS', 'JULIO BASHMORE', 'KELLY LEE OWENS',
  'KIASMOS', 'KID HARPOON', 'KINDNESS', 'KORELESS', 'LANTERNS ON THE LAKE',
  'LORDE', 'LOW', 'LUCY DACUS', 'MARCUS MARR', 'MARIBOU STATE', 'MODERAT',
  'MOUNT KIMBIE', 'NIGHT SLUGS', 'OBJEKT', 'OLIVER COATES', 'OVERMONO',
  'PANDA BEAR', 'PARIAH', 'PEGGY GOU', 'POLO PAN', 'PORTISHEAD', 'PREFUSE',
  'PRINCESS NOKIA', 'RADIO SLAVE', 'RIVAL CONSOLES', 'ROBERT GLASPER',
  'ROSS FROM FRIENDS', 'RUSTIE', 'SHACKLETON', 'SHLOHMO', 'SKREAM', 'SLOWDIVE',
  'SOPHIE', 'SQUID', 'STERLING VOID', 'THE XX', 'THOM YORKE', 'TIRZAH',
  'TOM MISCH', 'VARG', 'VESSEL', 'WARMDUSCHER', 'WEYES BLOOD', 'WARPAINT',
  'YOUNG FATHERS', 'YVES TUMOR', 'FOUR TET', 'JON HOPKINS', 'FRED AGAIN',
]

// Build a continuous string of artist names with separators for sequential placement
// Each name is separated by a bullet point to visually distinguish them
const ARTIST_STRING = ARTISTS.join(' · ')
const ARTIST_CHARS = ARTIST_STRING.split('')

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

  // Build grid from logo image
  const buildGrid = useCallback((canvas: HTMLCanvasElement) => {
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
      // Draw logo centered and scaled on the offscreen canvas
      const logoAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = cols / rows

      let drawW = cols * 0.98
      let drawH = drawW / logoAspect

      if (drawH > rows * 0.98) {
        drawH = rows * 0.98
        drawW = drawH * logoAspect
      }

      const ox = (cols - drawW) / 2
      const oy = (rows - drawH) / 2

      // White background for threshold
      octx.fillStyle = '#000'
      octx.fillRect(0, 0, cols, rows)
      // Draw white logo on black bg
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
            // This pixel is part of the logo
            const alpha = Math.min(1, brightness / 255)
            cells.push({
              char: ARTIST_CHARS[charIndex % ARTIST_CHARS.length],
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
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    buildGrid(canvas)

    const handleResize = () => buildGrid(canvas)
    window.addEventListener('resize', handleResize)

    const BLUE = '#4E7DFE'
    const WHITE = '#ffffff'
    const RADIUS = 90
    const GLOW_RADIUS = 50

    const draw = () => {
      const { w, h, dpr } = sizeRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)

      // Draw glow circle under symbols
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

        // Compute distance from mouse
        const dx = cell.x - mx
        const dy = cell.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Target lit value based on mouse proximity
        cell.target = dist < RADIUS ? Math.pow(1 - dist / RADIUS, 1.4) : 0

        // Smooth lerp
        const speed = cell.target > cell.lit ? 0.22 : 0.06
        cell.lit += (cell.target - cell.lit) * speed

        const lit = cell.lit

        // Interpolate color: dim white → bright blue
        let fillStyle: string
        let alpha: number
        if (lit > 0.01) {
          // Blend toward blue
          const r = Math.round(255 + (78 - 255) * lit)
          const g = Math.round(255 + (125 - 255) * lit)
          const b = Math.round(255 + (254 - 255) * lit)
          alpha = cell.baseAlpha + lit * (1 - cell.baseAlpha)
          fillStyle = `rgb(${r},${g},${b})`
        } else {
          fillStyle = WHITE
          alpha = cell.baseAlpha
        }

        ctx.globalAlpha = alpha
        ctx.fillStyle = fillStyle

        // Slight scale up on lit cells
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
      className="w-full h-full block"
      aria-label="MB Studio logo rendered in code symbols"
      role="img"
    />
  )
}
