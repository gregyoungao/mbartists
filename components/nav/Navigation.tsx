"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/artists", label: "MB Artists" },
  { href: "/academy", label: "MB Academy" },
  { href: "/agents", label: "MB Agents" },
  { href: "/book", label: "Make An Enquiry" },
]

const ACCENT = "#4E7DFE"
const BAR_BG = "#272727"
const SUPPORT_EMAIL = "support@mbartists.co.uk"

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState(0)
  const menuContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuContentRef.current) {
      setMenuHeight(isOpen ? menuContentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-3 md:pt-4">
      {/* Outer wrapper provides edge padding; inner constrains to max width */}
      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header bar — 3 columns: logo / menu toggle / enquiry */}
          <div
            className="relative grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 py-3"
            style={{ background: BAR_BG }}
          >
            {/* Left — logo */}
            <div className="flex justify-start">
              <Link
                href="/"
                className="inline-block transition-opacity duration-200 hover:opacity-80"
                aria-label="MB Artists home"
              >
                <Image
                  src="/images/mb-logo.png"
                  alt="MB Artists"
                  width={56}
                  height={40}
                  priority
                  className="h-7 md:h-9 w-auto"
                />
              </Link>
            </div>

            {/* Center — menu toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase transition-colors duration-200"
                style={{ color: isOpen ? ACCENT : "#fff" }}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                <span>{isOpen ? "Close" : "Menu"}</span>
                <div className="relative w-5 h-3 flex flex-col justify-between">
                  <span
                    className="block w-full h-[1.5px] transition-all duration-300 origin-center"
                    style={{
                      background: isOpen ? ACCENT : "#fff",
                      transform: isOpen
                        ? "translateY(5.25px) rotate(45deg)"
                        : "none",
                    }}
                  />
                  <span
                    className="block w-full h-[1.5px] transition-all duration-300"
                    style={{
                      background: isOpen ? ACCENT : "#fff",
                      opacity: isOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="block w-full h-[1.5px] transition-all duration-300 origin-center"
                    style={{
                      background: isOpen ? ACCENT : "#fff",
                      transform: isOpen
                        ? "translateY(-5.25px) rotate(-45deg)"
                        : "none",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* Right — Make an Enquiry (hidden on mobile; still available in menu) */}
            <div className="flex justify-end">
              <Link
                href="/book"
                className="hidden md:inline-block font-mono text-[10px] md:text-xs tracking-widest uppercase px-3 md:px-4 py-2 border transition-all duration-200 whitespace-nowrap"
                style={{
                  borderColor: ACCENT,
                  color: pathname === "/book" ? "#000" : ACCENT,
                  background: pathname === "/book" ? ACCENT : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = ACCENT
                  e.currentTarget.style.color = "#000"
                }}
                onMouseLeave={(e) => {
                  if (pathname !== "/book") {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = ACCENT
                  }
                }}
              >
                Make an Enquiry
              </Link>
            </div>
          </div>

          {/* Expanding menu panel (contained, lines up with the bar) */}
          <div
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{
              height: menuHeight,
              background: BAR_BG,
            }}
          >
            <div ref={menuContentRef} className="px-4 md:px-8 py-8 md:py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Navigation links */}
                <div className="md:col-span-1">
                  <p
                    className="font-mono text-[10px] tracking-widest uppercase mb-6"
                    style={{ color: "#888" }}
                  >
                    Navigation
                  </p>
                  <ul className="space-y-4">
                    {NAV_ITEMS.map((item, index) => {
                      const isActive = pathname === item.href
                      return (
                        <li
                          key={item.href}
                          className="overflow-hidden"
                          style={{
                            transform: isOpen
                              ? "translateY(0)"
                              : "translateY(20px)",
                            opacity: isOpen ? 1 : 0,
                            transition: `all 0.4s ease-out ${
                              index * 0.05 + 0.1
                            }s`,
                          }}
                        >
                          <Link
                            href={item.href}
                            className="group flex items-center gap-4 text-2xl md:text-3xl font-bold transition-colors duration-200"
                            style={{ color: isActive ? ACCENT : "#fff" }}
                          >
                            <span
                              className="font-mono text-xs transition-all duration-200"
                              style={{
                                color: ACCENT,
                                opacity: isActive ? 1 : 0,
                                transform: isActive
                                  ? "translateX(0)"
                                  : "translateX(-10px)",
                              }}
                            >
                              {">"}
                            </span>
                            <span className="group-hover:text-[#4E7DFE] transition-colors duration-200">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Contact info */}
                <div className="md:col-span-1">
                  <p
                    className="font-mono text-[10px] tracking-widest uppercase mb-6"
                    style={{ color: "#888" }}
                  >
                    Contact
                  </p>
                  <div
                    className="space-y-3"
                    style={{
                      transform: isOpen ? "translateY(0)" : "translateY(20px)",
                      opacity: isOpen ? 1 : 0,
                      transition: "all 0.4s ease-out 0.2s",
                    }}
                  >
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="block font-mono text-sm transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: "#aaa" }}
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    <p className="font-mono text-sm" style={{ color: "#666" }}>
                      London, UK
                    </p>
                  </div>
                </div>

                {/* Social links */}
                <div className="md:col-span-1">
                  <p
                    className="font-mono text-[10px] tracking-widest uppercase mb-6"
                    style={{ color: "#888" }}
                  >
                    Follow
                  </p>
                  <div
                    className="flex gap-6"
                    style={{
                      transform: isOpen ? "translateY(0)" : "translateY(20px)",
                      opacity: isOpen ? 1 : 0,
                      transition: "all 0.4s ease-out 0.25s",
                    }}
                  >
                    <a
                      href="https://instagram.com/mbartists"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: "#aaa" }}
                    >
                      Instagram
                    </a>
                    <a
                      href="https://facebook.com/mbartists"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: "#aaa" }}
                    >
                      Facebook
                    </a>
                    <a
                      href="https://twitter.com/mbartists"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: "#aaa" }}
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom border accent — "MB ARTISTS AGENCY   EST. 2009" */}
              <div
                className="mt-8 md:mt-12 pt-6 border-t"
                style={{
                  borderColor: "#3a3a3a",
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isOpen ? 1 : 0,
                  transition: "all 0.4s ease-out 0.3s",
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: "#666" }}
                >
                  MB Artists Agency&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Est. 2009
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when menu is open — full screen, click to close */}
      <div
        className="fixed inset-0 -z-10 transition-opacity duration-500"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={() => setIsOpen(false)}
      />
    </nav>
  )
}