'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const LogoSymbolCanvas = dynamic(() => import('./LogoSymbolCanvas'), { ssr: false })

export default function HeroSection() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '600px', background: '#000', cursor: 'none' }}
      aria-label="Hero section"
    >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 rounded-full"
        style={{
          width: '8px',
          height: '8px',
          background: '#4E7DFE',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px 3px rgba(78,125,254,0.5)',
        }}
        aria-hidden="true"
      />

      {/* Logo rendered as code symbols — fills the entire viewport */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full h-full">
          <LogoSymbolCanvas />
        </div>
      </div>
    </section>
  )
}
