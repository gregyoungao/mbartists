'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
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

      {/* Logo canvas — background layer */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full h-full">
          <LogoSymbolCanvas />
        </div>
      </div>

      {/* Overlay content — heading + CTAs */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
              style={{ color: '#fff' }}
            >
              Giving artists the
              <br />
              <span style={{ color: '#fff' }}>MAXIMUM</span>
            </h1>
            <p
              className="text-base md:text-lg max-w-xl mb-10"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Offering the hottest talent the global music scene has to offer.
              Securing the future of artists worldwide.
            </p>

            <div className="flex flex-wrap gap-4 pointer-events-auto">
              <Link
                href="/artists"
                className="font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-200"
                style={{
                  background: '#4E7DFE',
                  color: '#000',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6B92FF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4E7DFE'
                }}
              >
                View Our Roster
              </Link>
              <Link
                href="/agents"
                className="font-mono text-xs uppercase tracking-widest px-6 py-3 border transition-all duration-200"
                style={{
                  borderColor: '#fff',
                  color: '#fff',
                  cursor: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.color = '#000'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#fff'
                }}
              >
                View Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
