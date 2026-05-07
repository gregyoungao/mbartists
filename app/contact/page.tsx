'use client'

import Navigation from '@/components/nav/Navigation'
import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Background spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(78, 125, 254, 0.06), transparent 40%)`,
        }}
      />

      {/* Content */}
      <section className="pt-32 pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
            {'// Get in Touch'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Contact
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* General enquiries */}
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#666' }}>
                General Enquiries
              </h2>
              <a
                href="mailto:info@mbartists.co.uk"
                className="text-2xl font-bold transition-colors duration-200 hover:text-[#4E7DFE]"
              >
                info@mbartists.co.uk
              </a>
            </div>

            {/* Booking */}
            <div>
              <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#666' }}>
                Bookings
              </h2>
              <a
                href="mailto:bookings@mbartists.co.uk"
                className="text-2xl font-bold transition-colors duration-200 hover:text-[#4E7DFE]"
              >
                bookings@mbartists.co.uk
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="mt-16 pt-16 border-t" style={{ borderColor: '#1a1a1a' }}>
            <h2 className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#666' }}>
              Location
            </h2>
            <p className="text-lg" style={{ color: '#888' }}>
              London, United Kingdom
            </p>
          </div>

          {/* Social links */}
          <div className="mt-16">
            <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#666' }}>
              Follow Us
            </h2>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/mbartists"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm px-6 py-3 border transition-all duration-200"
                style={{ borderColor: '#222', color: '#888' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4E7DFE'
                  e.currentTarget.style.color = '#4E7DFE'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222'
                  e.currentTarget.style.color = '#888'
                }}
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/mbartists"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm px-6 py-3 border transition-all duration-200"
                style={{ borderColor: '#222', color: '#888' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4E7DFE'
                  e.currentTarget.style.color = '#4E7DFE'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222'
                  e.currentTarget.style.color = '#888'
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
