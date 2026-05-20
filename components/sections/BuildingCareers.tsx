"use client"

import Image from "next/image"
import Link from "next/link"

const ACCENT = "#4E7DFE"
// Two images — both currently the same placeholder. Swap one for variety.
const IMAGE_1 =
  "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80"
const IMAGE_2 =
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80"

export default function BuildingCareers() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: ACCENT }}
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {/* Layout: title on the left, two alternating rows on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 lg:gap-16">
          {/* Left — title only */}
          <div>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95]"
              style={{ color: "#fff" }}
            >
              Building
              <br />
              Careers
            </h2>
          </div>

          {/* Right — two rows */}
          <div className="space-y-10 lg:space-y-14">
            {/* Row 1: paragraph (left) + image (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                MB Artists represents a dynamic roster of exceptional talent at
                the forefront of the music industry. MB Artists is driven by a
                clear ethos: to nurture, elevate, and champion every artist we
                work with. Our goal is to help them build sustainable,
                successful careers while maximising every opportunity and
                experience that comes with life as a professional performer.
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
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Row 2: image (left) + paragraph (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div
                className="relative aspect-[4/3] overflow-hidden md:order-1 order-1"
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
              <p
                className="text-sm md:text-base leading-relaxed md:order-2 order-2"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                Founded to expertly manage artists&apos; schedules and
                itineraries, MB Artists combines strategic career development
                with a deep understanding of the ever-evolving music landscape.
                Every booking, every tour, every collaboration is approached
                with the same focus: building careers that last.
              </p>
            </div>

            {/* Contact CTA */}
            <div>
              <Link
                href="/book"
                className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest px-6 py-3 transition-all duration-200"
                style={{
                  background: "#000",
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.color = "#000"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#000"
                  e.currentTarget.style.color = "#fff"
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