"use client"

import Image from "next/image"
import Link from "next/link"

const ACCENT = "#4E7DFE"
const IMAGE_1 =
  "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80"
const IMAGE_2 =
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80"

export default function BuildingCareers() {
  return (
    <section
      className="relative py-24 md:py-28 overflow-hidden"
      style={{ background: ACCENT }}
    >
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,3.2fr)] gap-x-12 gap-y-12 md:gap-y-16">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] md:self-end md:col-start-1 md:row-start-1"
            style={{ color: "#fff" }}
          >
            Building
            <br />
            Careers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] gap-8 md:gap-10 md:items-end md:col-start-2 md:row-start-1">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              MB Artists represents a dynamic roster of exceptional talent at
              the forefront of the music industry. MB Artists is driven by a
              clear ethos: to nurture, elevate, and champion every artist we
              work with. Our goal is to help them build sustainable, successful
              careers while maximising every opportunity and experience that
              comes with life as a professional performer.
            </p>
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <Image
                src={IMAGE_1}
                alt="Concert crowd"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 md:items-start md:col-start-2 md:row-start-2">
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <Image
                src={IMAGE_2}
                alt="Festival performance"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="flex flex-col gap-7">
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                Founded to expertly manage artists&apos; schedules and
                itineraries, MB Artists combines strategic career development
                with a deep understanding of the ever-evolving music landscape.
                Every booking, every tour, every collaboration is approached
                with the same focus: building careers that last.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-3 self-start font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-200"
                style={{
                  background: "#fff",
                  color: "#000",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#000"
                  e.currentTarget.style.color = ACCENT
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.color = "#000"
                }}
              >
                <span>Contact Us</span>
                <span>{">"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
