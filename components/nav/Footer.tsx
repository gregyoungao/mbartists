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
                href="https://facebook.com"
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
                href="https://instagram.com"
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
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="transition-colors duration-200"
                style={{ color: "#aaa" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
              >
                <svg width="22" height="22" viewBox="0 0 449.69 449.7" fill="currentColor" fillRule="evenodd">
                  <path d="M325.27,334.09c.39.52.75,1.07,1.29,1.86-.8.05-1.29.1-1.78.11-11.28,0-22.58-.02-33.86.02-1.21,0-1.98-.37-2.72-1.36-13.63-18.28-27.3-36.54-40.96-54.81-12.42-16.61-24.83-33.22-37.25-49.83-17.83-23.82-35.65-47.62-53.48-71.44-10.69-14.28-21.38-28.57-32.07-42.87-.28-.38-.5-.83-.87-1.46.78-.04,1.28-.09,1.77-.09,11.18-.01,22.37.02,33.55-.04,1.41,0,2.27.49,3.09,1.59,9.35,12.57,18.74,25.11,28.13,37.67,9.27,12.38,18.54,24.76,27.8,37.15,10.35,13.83,20.68,27.67,31.03,41.5,13.26,17.73,26.54,35.44,39.8,53.16,12.18,16.28,24.36,32.56,36.53,48.84Z" />
                  <path d="M224.84,0C100.66,0,0,100.67,0,224.85s100.66,224.85,224.84,224.85,224.85-100.67,224.85-224.85S349.02,0,224.84,0ZM359.93,353.84c-25.69,0-51.37-.02-77.06.05-1.87,0-2.98-.6-4.09-2.09-11.88-15.98-23.85-31.9-35.78-47.86-12.3-16.44-24.59-32.89-36.9-49.34-.39-.53-.84-1-1.38-1.64-2.16,2.31-4.21,4.48-6.24,6.68-12.91,13.93-25.8,27.87-38.71,41.81-15.89,17.16-31.78,34.32-47.7,51.46-.44.47-1.21.89-1.83.9-7.25.06-14.5.03-21.75.03-.2,0-.41-.05-.89-.13.38-.55.62-1.02.97-1.4,12.68-13.71,25.38-27.41,38.07-41.12,10.37-11.2,20.73-22.42,31.1-33.63,11.43-12.34,22.87-24.67,34.3-37.01,1.95-2.1,1.97-2.1.3-4.34-12.61-16.86-25.23-33.71-37.84-50.58-12.98-17.35-25.95-34.72-38.94-52.07-8.64-11.56-17.3-23.11-25.95-34.66-.46-.61-.89-1.25-1.53-2.15.76-.1,1.28-.22,1.8-.22,26.1,0,52.2,0,78.3-.01,1.07,0,1.8.27,2.48,1.18,11.93,16.02,23.9,32,35.87,47.99,10.38,13.87,20.75,27.76,31.15,41.63,1.76,2.34,1.41,2.41,3.46.2,19.36-20.94,38.74-41.86,58.12-62.78,8.29-8.96,16.62-17.9,24.88-26.89.89-.97,1.79-1.35,3.1-1.34,6.62.06,13.25.02,19.88.03.59.01,1.18.09,2.18.17-1.44,1.59-2.59,2.89-3.76,4.16-9.51,10.25-19.01,20.49-28.5,30.74-15.2,16.4-30.38,32.81-45.57,49.21-6.72,7.25-13.42,14.53-20.17,21.74-.99,1.06-.94,1.78-.1,2.9,18.77,25.04,37.49,50.11,56.25,75.17,15.25,20.38,30.51,40.74,45.77,61.11l7.71,10.32c.32.44.59.91,1.16,1.78h-2.16Z" />
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
            href="#"
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