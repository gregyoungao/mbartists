"use client"

import Image from "next/image"
import Link from "next/link"

const ACCENT = "#4E7DFE"

// Real concert imagery — save the files to /public/images/ first.
const IMAGE_1 = "/images/concert-1.jpg"
const IMAGE_2 = "/images/concert-2.jpg"

export default function BuildingCareers() {
  return (
    <section
      className="relative py-24 md:py-28 overflow-hidden"
      style={{ background: ACCENT }}
    >
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,3.2fr)] gap-x-12 gap-y-12 md:gap-y-16">
          {/* Title — bottom-aligned with row 1 on desktop */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] md:self-end md:col-start-1 md:row-start-1"
            style={{ color: "#fff" }}
          >
            Beyond Bookings.
            <br />
            Building Careers.
          </h2>

          {/* Row 1: top text + image 1 (bottom-aligned with title) */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] gap-8 md:gap-10 md:items-end md:col-start-2 md:row-start-1">
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              At MB Artists, representation is about more than securing shows.
              We work alongside artists to develop long-term careers, create
              meaningful opportunities and navigate the ever-changing global
              music industry.
            </p>
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <Image
                src={IMAGE_1}
                alt="MB Artists festival crowd at sunset"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
          </div>

          {/* Row 2: image 2 + (bottom text → closing tagline → CTA), top-aligned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 md:items-start md:col-start-2 md:row-start-2">
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <Image
                src={IMAGE_2}
                alt="MB Artist on stage at Eternity"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {/* Right column — bottom paragraph, then closing tagline, then CTA */}
            <div className="flex flex-col gap-6">
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                Through trusted relationships with major festivals, promoters,
                brands and industry partners, we help artists expand their
                reach while staying focused on what matters most: sustainable
                growth, creative freedom and lasting success.
              </p>

              <p
                className="text-base md:text-lg leading-[1.45] font-medium"
                style={{ color: "#fff" }}
              >
                From emerging talent to established headliners, our approach
                remains the same — building careers that stand the test of
                time.
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