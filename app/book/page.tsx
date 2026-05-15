// =========================================================
// /book — public "Book An Artist" page (light theme)
// =========================================================

import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'
import EnquiryForm from '@/components/enquiry/EnquiryForm'
import { getServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getArtists() {
  const supabase = getServiceClient()
  const { data } = await supabase
    .from('artists')
    .select('id, name')
    .eq('archived', false)
    .order('name', { ascending: true })
  return data || []
}

export default async function BookPage() {
  const artists = await getArtists()

  return (
    <main className="min-h-screen" style={{ background: '#ffffff', color: '#0a0a0a' }}>
      <Navigation />

      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left column — heading + contact info */}
            <div>
              <p
                className="font-mono text-xs tracking-widest uppercase mb-4"
                style={{ color: '#4E7DFE' }}
              >
                Contact Us
              </p>
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                style={{ color: '#0a0a0a' }}
              >
                Book An Artist
              </h1>
              <p className="text-lg mb-12" style={{ color: '#666' }}>
                You&apos;re one step closer to an unforgettable moment.
              </p>

              <div className="space-y-8">
                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-2"
                    style={{ color: '#4E7DFE' }}
                  >
                    General Enquiries
                  </p>
                  <a
                    href="mailto:support@mbartists.com"
                    className="font-mono text-sm transition-colors hover:text-[#4E7DFE]"
                    style={{ color: '#0a0a0a' }}
                  >
                    SUPPORT@MBARTISTS.COM
                  </a>
                </div>

                <div>
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-3"
                    style={{ color: '#4E7DFE' }}
                  >
                    Follow Us
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: '#0a0a0a' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: '#0a0a0a' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="transition-colors duration-200 hover:text-[#4E7DFE]"
                      style={{ color: '#0a0a0a' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — the form (light theme) */}
            <div>
              <EnquiryForm artists={artists} theme="light" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}