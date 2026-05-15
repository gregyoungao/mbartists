import Image from "next/image"
import Link from "next/link"

const ACCENT = "#4E7DFE"

export default function BuildingCareers() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: ACCENT }}
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — heading */}
          <div>
            <p
              className="font-mono text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              {"// Building"}
            </p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-12 leading-[0.95]"
              style={{ color: "#fff" }}
            >
              Building
              <br />
              Careers
            </h2>

            {/* Concert image — below heading on mobile, beside it on larger screens */}
            <div
              className="relative aspect-[16/9] overflow-hidden mb-8 lg:mb-0"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=1200&q=80"
                alt="Concert crowd"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle blue overlay to harmonize with section */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(78,125,254,0.2), transparent 60%)",
                }}
              />
            </div>
          </div>

          {/* Right — body copy + CTA */}
          <div className="lg:pt-12">
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              MB Artists represents a dynamic roster of exceptional talent at
              the forefront of the music industry. MB Artists is driven by a
              clear ethos: to nurture, elevate, and champion every artist we
              work with. Our goal is to help them build sustainable, successful
              careers while maximising every opportunity and experience that
              comes with life as a professional performer.
            </p>
            <p
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Founded to expertly manage artists&apos; schedules and
              itineraries, MB Artists combines strategic career development
              with a deep understanding of the ever-evolving music landscape.
            </p>

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
    </section>
  )
}
