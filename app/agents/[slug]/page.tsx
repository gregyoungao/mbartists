'use client'

import Navigation from '@/components/nav/Navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'

// Sample agent data with roster - will be replaced with WordPress fetch
const SAMPLE_AGENTS: Record<string, {
  name: string
  photo: string
  email: string
  roles: string[]
  bio: string
  instagram?: string
  linkedin?: string
  roster: Array<{ slug: string; name: string; image: string; genres: string[] }>
}> = {
  'alex-thompson': {
    name: 'Alex Thompson',
    photo: '/placeholder-artist.jpg',
    email: 'alex@mbartists.co.uk',
    roles: ['Managing Director', 'Senior Agent'],
    bio: 'Alex Thompson founded MB Artists with a vision to create a boutique agency that truly understands and supports its artists. With over 15 years of experience in the electronic music industry, Alex has built relationships with promoters, festivals, and venues worldwide.\n\nHis approach combines strategic career development with a deep understanding of the ever-evolving electronic music landscape. Under his leadership, MB Artists has grown to represent some of the most exciting talent in dubstep, drum & bass, and beyond.',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    roster: [
      { slug: 'barely-alive', name: 'Barely Alive', image: '/placeholder-artist.jpg', genres: ['Dubstep', 'Heavy Bass'] },
      { slug: 'excision', name: 'Excision', image: '/placeholder-artist.jpg', genres: ['Dubstep'] },
      { slug: 'virtual-riot', name: 'Virtual Riot', image: '/placeholder-artist.jpg', genres: ['Dubstep', 'Complextro'] },
      { slug: 'zomboy', name: 'Zomboy', image: '/placeholder-artist.jpg', genres: ['Dubstep', 'Electro'] },
      { slug: 'must-die', name: 'MUST DIE!', image: '/placeholder-artist.jpg', genres: ['Dubstep', 'Trap'] },
      { slug: 'eptic', name: 'Eptic', image: '/placeholder-artist.jpg', genres: ['Dubstep', 'Heavy Bass'] },
    ],
  },
}

export default function AgentPage() {
  const params = useParams()
  const slug = params.slug as string
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${e.clientX}px`
        spotlightRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Get agent data - fallback to sample if not found
  const agent = SAMPLE_AGENTS[slug] || SAMPLE_AGENTS['alex-thompson']

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        className="fixed pointer-events-none z-10 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(78, 125, 254, 0.12) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <Navigation />

      <main className="relative z-20">
        {/* Header */}
        <section className="pt-32 pb-12 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo */}
              <div
                className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 overflow-hidden"
                style={{ border: '2px solid #4E7DFE' }}
              >
                <Image
                  src={agent.photo}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#4E7DFE' }} />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#4E7DFE' }} />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#4E7DFE' }} />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#4E7DFE' }} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {agent.roles.map((role) => (
                    <span
                      key={role}
                      className="font-mono text-[10px] px-3 py-1 uppercase tracking-wider"
                      style={{ background: 'rgba(78, 125, 254, 0.2)', color: '#4E7DFE' }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                  {agent.name}
                </h1>

                {/* Contact button */}
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center gap-3 font-mono text-sm px-6 py-3 border transition-all duration-200"
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
                  <span>{agent.email}</span>
                  <span>{'>'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#4E7DFE' }}>
              {'// About'}
            </h2>
            <div className="space-y-4 max-w-3xl" style={{ color: '#aaa' }}>
              {agent.bio.split('\n\n').map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Social links */}
            {(agent.instagram || agent.linkedin) && (
              <div className="flex gap-4 mt-8">
                {agent.instagram && (
                  <a
                    href={agent.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-4 py-2 border transition-all duration-200"
                    style={{ borderColor: '#222', color: '#666' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4E7DFE'
                      e.currentTarget.style.color = '#4E7DFE'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#222'
                      e.currentTarget.style.color = '#666'
                    }}
                  >
                    Instagram
                  </a>
                )}
                {agent.linkedin && (
                  <a
                    href={agent.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-4 py-2 border transition-all duration-200"
                    style={{ borderColor: '#222', color: '#666' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4E7DFE'
                      e.currentTarget.style.color = '#4E7DFE'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#222'
                      e.currentTarget.style.color = '#666'
                    }}
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Roster */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#4E7DFE' }}>
                  {'// Roster'}
                </h2>
                <p className="text-2xl font-bold">{agent.roster.length} Artists</p>
              </div>
              <Link
                href="/artists"
                className="font-mono text-xs transition-colors duration-200 hover:text-[#4E7DFE]"
                style={{ color: '#666' }}
              >
                View All {'>'} 
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {agent.roster.map((artist, index) => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="group relative aspect-square overflow-hidden"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover transition-all duration-300"
                    style={{
                      filter: hoveredIndex === index ? 'brightness(0.6)' : 'brightness(0.4)',
                    }}
                  />

                  {/* Blue glow */}
                  {hoveredIndex === index && (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(78, 125, 254, 0.2) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  {/* Name */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <h3
                      className="font-bold text-sm truncate transition-colors duration-300"
                      style={{ color: hoveredIndex === index ? '#4E7DFE' : '#fff' }}
                    >
                      {artist.name}
                    </h3>
                    <div
                      className="flex gap-1 mt-1 transition-all duration-300"
                      style={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(8px)',
                      }}
                    >
                      {artist.genres.slice(0, 1).map((genre) => (
                        <span
                          key={genre}
                          className="font-mono text-[8px] uppercase tracking-wider"
                          style={{ color: '#4E7DFE' }}
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
                      borderTop: `1px solid ${hoveredIndex === index ? '#4E7DFE' : 'transparent'}`,
                      borderRight: `1px solid ${hoveredIndex === index ? '#4E7DFE' : 'transparent'}`,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Back link */}
        <section className="px-6 md:px-12 py-12 border-t" style={{ borderColor: '#1a1a1a' }}>
          <div className="max-w-5xl mx-auto">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 font-mono text-xs transition-colors duration-200"
              style={{ color: '#666' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#4E7DFE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
            >
              <span>{'<'}</span>
              <span>Back to All Agents</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
