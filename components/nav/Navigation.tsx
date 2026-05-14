"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/artists", label: "Artists" },
  { href: "/agents", label: "Agents" },
  { href: "/book", label: "Book an Artist" },
  { href: "/contact", label: "Contact" },
]

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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-300"
        style={{
          background: isOpen ? "#000" : "rgba(0,0,0,0.8)",
          backdropFilter: isOpen ? "none" : "blur(12px)",
          borderBottom: `1px solid ${isOpen ? "#1a1a1a" : "rgba(255,255,255,0.05)"}`,
        }}
      >
        <Link
          href="/"
          className="font-mono text-xs tracking-widest uppercase transition-colors duration-200 hover:opacity-80"
          style={{ color: "#4E7DFE" }}
        >
          MB Artists
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Make an Enquiry button */}
          <Link
            href="/book"
            className="font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200"
            style={{
              borderColor: "#4E7DFE",
              color: pathname === "/book" ? "#000" : "#4E7DFE",
              background: pathname === "/book" ? "#4E7DFE" : "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4E7DFE"
              e.currentTarget.style.color = "#000"
            }}
            onMouseLeave={(e) => {
              if (pathname !== "/book") {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#4E7DFE"
              }
            }}
          >
            Make an Enquiry
          </Link>

          {/* Menu toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: isOpen ? "#4E7DFE" : "#fff" }}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span>{isOpen ? "Close" : "Menu"}</span>
            <div className="relative w-5 h-3 flex flex-col justify-between">
              <span
                className="block w-full h-[1.5px] transition-all duration-300 origin-center"
                style={{
                  background: isOpen ? "#4E7DFE" : "#fff",
                  transform: isOpen ? "translateY(5.25px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-full h-[1.5px] transition-all duration-300"
                style={{
                  background: isOpen ? "#4E7DFE" : "#fff",
                  opacity: isOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-full h-[1.5px] transition-all duration-300 origin-center"
                style={{
                  background: isOpen ? "#4E7DFE" : "#fff",
                  transform: isOpen ? "translateY(-5.25px) rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Expanding menu panel */}
      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{
          height: menuHeight,
          background: "#000",
        }}
      >
        <div ref={menuContentRef} className="px-6 md:px-12 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Navigation links */}
            <div className="md:col-span-1">
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-6"
                style={{ color: "#666" }}
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
                        transform: isOpen ? "translateY(0)" : "translateY(20px)",
                        opacity: isOpen ? 1 : 0,
                        transition: `all 0.4s ease-out ${index * 0.05 + 0.1}s`,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center gap-4 text-2xl md:text-3xl font-bold transition-colors duration-200"
                        style={{ color: isActive ? "#4E7DFE" : "#fff" }}
                      >
                        <span
                          className="font-mono text-xs transition-all duration-200"
                          style={{
                            color: "#4E7DFE",
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "translateX(0)" : "translateX(-10px)",
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
                style={{ color: "#666" }}
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
                  href="mailto:info@mbartists.co.uk"
                  className="block font-mono text-sm transition-colors duration-200 hover:text-[#4E7DFE]"
                  style={{ color: "#888" }}
                >
                  info@mbartists.co.uk
                </a>
                <p className="font-mono text-sm" style={{ color: "#444" }}>
                  London, UK
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="md:col-span-1">
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-6"
                style={{ color: "#666" }}
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
                  style={{ color: "#888" }}
                >
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/company/mbartists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider transition-colors duration-200 hover:text-[#4E7DFE]"
                  style={{ color: "#888" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Bottom border accent */}
          <div
            className="mt-8 md:mt-12 pt-6 border-t flex items-center justify-between"
            style={{
              borderColor: "#1a1a1a",
              transform: isOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isOpen ? 1 : 0,
              transition: "all 0.4s ease-out 0.3s",
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#333" }}>
              Artist Management Agency
            </p>
            <p className="font-mono text-[10px]" style={{ color: "#4E7DFE" }}>
              Est. 2024
            </p>
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      <div
        className="fixed inset-0 -z-10 transition-opacity duration-500"
        style={{
          background: "rgba(0,0,0,0.8)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={() => setIsOpen(false)}
      />
    </nav>
  )
}