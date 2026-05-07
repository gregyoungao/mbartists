'use client'

import Navigation from '@/components/nav/Navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Sample agents data - will be replaced with WordPress fetch
const SAMPLE_AGENTS = [
  {
    slug: 'alex-thompson',
    name: 'Alex Thompson',
    photo: '/placeholder-artist.jpg',
    email: 'alex@mbartists.co.uk',
    roles: ['Managing Director', 'Senior Agent'],
    bio: 'Leading the MB Artists team with over 15 years of experience in artist management and booking.',
    rosterCount: 12,
  },
  {
    slug: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    photo: '/placeholder-artist.jpg',
    email: 'sarah@mbartists.co.uk',
    roles: ['Senior Agent'],
    bio: 'Specializing in electronic and bass music talent across Europe and North America.',
    rosterCount: 18,
  },
  {
    slug: 'james-wilson',
    name: 'James Wilson',
    photo: '/placeholder-artist.jpg',
    email: 'james@mbartists.co.uk',
    roles: ['Agent'],
    bio: 'Focused on developing emerging talent in the dubstep and drum & bass scenes.',
    rosterCount: 8,
  },
  {
    slug: 'emma-davis',
    name: 'Emma Davis',
    photo: '/placeholder-artist.jpg',
    email: 'emma@mbartists.co.uk',
    roles: ['Academy Director', 'Agent'],
    bio: 'Running the MB Academy program and nurturing the next generation of electronic music artists.',
    rosterCount: 15,
  },
  {
    slug: 'david-chen',
    name: 'David Chen',
    photo: '/placeholder-artist.jpg',
    email: 'david@mbartists.co.uk',
    roles: ['Coordinator'],
    bio: 'Supporting the team with logistics and artist coordination across global tours.',
    rosterCount: 6,
  },
]

export default function AgentsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
            {'// The Team'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Our Agents
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#666' }}>
            Meet the dedicated team behind MB Artists, working tirelessly to support and elevate our roster.
          </p>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="px-6 md:px-12 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_AGENTS.map((agent, index) => (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="group relative overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="p-6 border transition-all duration-300"
                  style={{
                    borderColor: hoveredIndex === index ? '#4E7DFE' : '#1a1a1a',
                    background: hoveredIndex === index ? '#0a0a0a' : '#050505',
                    boxShadow: hoveredIndex === index ? '0 0 40px rgba(78, 125, 254, 0.1)' : 'none',
                  }}
                >
                  {/* Photo and name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="relative w-16 h-16 overflow-hidden flex-shrink-0"
                      style={{
                        border: `2px solid ${hoveredIndex === index ? '#4E7DFE' : '#222'}`,
                      }}
                    >
                      <Image
                        src={agent.photo}
                        alt={agent.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-lg mb-1 transition-colors duration-300"
                        style={{ color: hoveredIndex === index ? '#4E7DFE' : '#fff' }}
                      >
                        {agent.name}
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {agent.roles.map((role) => (
                          <span
                            key={role}
                            className="font-mono text-[9px] uppercase tracking-wider"
                            style={{ color: '#666' }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: '#888' }}
                  >
                    {agent.bio}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#1a1a1a' }}>
                    <span className="font-mono text-xs" style={{ color: '#444' }}>
                      {agent.rosterCount} artists
                    </span>
                    <span
                      className="font-mono text-xs flex items-center gap-1 transition-all duration-300"
                      style={{
                        color: '#4E7DFE',
                        transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      View Profile {'>'}
                    </span>
                  </div>

                  {/* Corner accent */}
                  <div
                    className="absolute top-3 right-3 w-3 h-3 transition-all duration-300"
                    style={{
                      borderTop: `1px solid ${hoveredIndex === index ? '#4E7DFE' : 'transparent'}`,
                      borderRight: `1px solid ${hoveredIndex === index ? '#4E7DFE' : 'transparent'}`,
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-6 md:px-12 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#666' }}>
            {'// Get in Touch'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Interested in working with us?
          </h2>
          <a
            href="mailto:info@mbartists.co.uk"
            className="inline-flex items-center gap-2 font-mono text-sm px-8 py-3 border transition-all duration-200"
            style={{ borderColor: '#4E7DFE', color: '#4E7DFE' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4E7DFE'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#4E7DFE'
            }}
          >
            <span>Contact Us</span>
            <span>{'>'}</span>
          </a>
        </div>
      </section>
    </main>
  )
}
