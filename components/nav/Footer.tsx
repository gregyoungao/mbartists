"use client"

import Link from "next/link"
import Image from "next/image"

const ACCENT = "#4E7DFE"
const FOOTER_BG = "#272727"
const SUPPORT_EMAIL = "support@mbartists.co.uk"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ background: FOOTER_BG, borderColor: "#1a1a1a" }}
    >
      {/* Watermark — large MB logo, anchored to the left, faded, partially cropped */}
      <div
        className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="relative"
          style={{
            width: "min(700px, 80vw)",
            aspectRatio: "1864 / 1356",
            opacity: 0.08,
            transform: "translate(-15%, 10%)",
          }}
        >
          <Image
            src="/images/mb-logo.png"
            alt=""
            fill
            className="object-contain"
            sizes="700px"
            priority={false}
          />
        </div>
      </div>

      {/* Content layer — sits on top of watermark */}
      <div className="relative z-10 px-4 md:px-8 py-12 max-w-7xl mx-auto">
        {/* Contact + Follow row — centered, on top */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="text-center">
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2"
              style={{ color: ACCENT }}
            >
              Contact Us
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-mono text-sm transition-colors duration-200 hover:text-[#4E7DFE]"
              style={{ color: "#aaa" }}
            >
              {SUPPORT_EMAIL.toUpperCase()}
            </a>
          </div>

          <div className="text-center">
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-3"
              style={{ color: ACCENT }}
            >
              Follow Us
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.facebook.com/MBartistsUK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-colors duration-200"
                style={{ color: "#aaa" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
              >
                <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                  <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM300.49,127.54h-26.48c-14.64,0-29.98,9.06-29.98,25.1v43.21h54.37l-9.06,57.16h-45.31v141.5h-61.34v-141.5h-51.58v-57.16h51.58v-42.52c0-42.52,25.1-78.07,70.41-75.28l47.39,2.09v47.4Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mbartistsagency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-colors duration-200"
                style={{ color: "#aaa" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
              >
                <svg width="22" height="22" viewBox="0 0 449.7 449.7" fill="currentColor" fillRule="evenodd">
                  <path d="M276.59,224.85c0,14.39-5.83,27.41-15.16,36.84-9.34,9.42-22.19,15.25-36.24,15.25h-.68c-28.1,0-51.4-23.31-51.4-52.09,0-14.05,5.83-26.9,15.16-36.24,9.34-9.34,22.19-15.16,36.24-15.16h.68c28.1,0,51.4,23.3,51.4,51.4Z" />
                  <path d="M290.3,106.29h-130.9c-29.46,0-53.45,23.99-53.45,53.46v130.21c0,29.46,23.99,53.45,53.45,53.45h130.9c29.47,0,53.45-23.99,53.45-53.45v-130.21c0-29.47-23.98-53.46-53.45-53.46ZM280.19,280.11c-14.22,14.13-33.75,22.87-55,22.87h-.68c-42.49,0-77.44-34.95-77.44-78.13,0-21.24,8.74-40.78,22.79-54.99,14.04-14.22,33.4-23.13,54.65-23.13h.68c42.49,0,78.13,35.63,78.13,78.12,0,21.59-8.91,41.12-23.13,55.26ZM313.52,159.66c-3,3-7.12,4.88-11.57,4.88-4.79,0-8.91-1.88-11.82-4.88-2.91-2.99-4.63-7.11-4.63-11.56s1.72-8.57,4.63-11.57c2.91-3,7.03-4.88,11.82-4.88,8.91,0,16.45,7.54,16.45,16.45,0,4.45-1.88,8.57-4.88,11.56Z" />
                  <path d="M224.85,0C100.67,0,0,100.67,0,224.85s100.67,224.85,224.85,224.85,224.85-100.67,224.85-224.85S349.03,0,224.85,0ZM368.42,290.64c0,42.49-34.95,77.44-77.44,77.44h-132.26c-42.49,0-77.44-34.95-77.44-77.44v-131.58c0-42.49,34.95-77.44,77.44-77.44h132.26c42.49,0,77.44,34.95,77.44,77.44v131.58Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright | privacy | designed by */}
        <div
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "#3a3a3a" }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-wider order-2 md:order-1"
            style={{ color: "#888" }}
          >
            All Rights Reserved MB Artists Ltd {year}
          </p>

          <Link
            href="/privacy"
            className="font-mono text-[10px] uppercase tracking-wider transition-colors hover:text-[#4E7DFE] order-1 md:order-2"
            style={{ color: "#888" }}
          >
            Privacy Policy
          </Link>

          <p
            className="font-mono text-[10px] uppercase tracking-wider order-3"
            style={{ color: "#888" }}
          >
            Designed by{" "}
            <a
              href="https://anti-ordinary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#4E7DFE]"
              style={{ color: ACCENT }}
            >
              Anti-Ordinary
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}