// =========================================================
// /book — public "Book An Artist" page
// Server component: fetches artist list, renders the enquiry form.
// =========================================================

import Navigation from '@/components/nav/Navigation'
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
    <main className="min-h-screen bg-black text-white">
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
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Book An Artist
              </h1>
              <p className="text-lg mb-12" style={{ color: '#666' }}>
                You're one step closer to an unforgettable moment.
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
                    style={{ color: '#888' }}
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
                      className="font-mono text-xs transition-colors hover:text-[#4E7DFE]"
                      style={{ color: '#666' }}
                    >
                      Facebook
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs transition-colors hover:text-[#4E7DFE]"
                      style={{ color: '#666' }}
                    >
                      Instagram
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs transition-colors hover:text-[#4E7DFE]"
                      style={{ color: '#666' }}
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — the form */}
            <div>
              <EnquiryForm artists={artists} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
