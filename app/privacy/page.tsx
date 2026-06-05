// =========================================================
// Privacy Policy Page — /privacy
// =========================================================
// UK GDPR-compliant customer privacy notice for
// Maximum Boost Agency Ltd T/A MB Artists.
// =========================================================

import Link from 'next/link'
import Navigation from '@/components/nav/Navigation'
import Footer from '@/components/nav/Footer'

const ACCENT = '#4E7DFE'
const PRIVACY_EMAIL = 'paul@mbartists.co.uk'

export const metadata = {
  title: 'Privacy Policy — MB Artists',
  description:
    'How Maximum Boost Agency Ltd T/A MB Artists collects, uses, and protects your personal information.',
}

/**
 * External link to the ICO website — opens in a new tab, marked rel=noopener,
 * styled with the accent colour so the dense legal text is still readable
 * but the references are clearly clickable.
 */
function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 transition-colors hover:opacity-80"
      style={{ color: ACCENT }}
    >
      {children}
    </a>
  )
}

/**
 * Re-usable section wrapper so each section gets consistent spacing and
 * heading treatment. Headings are bold sans-serif on a cream-on-black layout.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5" style={{ color: '#fff' }}>
        {title}
      </h2>
      <div className="space-y-4" style={{ color: '#bbb' }}>
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navigation />

      {/* Header band — same eyebrow/title pattern as the rest of the site */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto pt-16 md:pt-24 pb-10 md:pb-14">
        <p
          className="font-mono text-xs tracking-widest uppercase mb-4"
          style={{ color: ACCENT }}
        >
          Legal
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-white">
          Privacy Policy
        </h1>
        <p className="font-mono text-xs mt-6" style={{ color: '#666' }}>
          // Maximum Boost Agency Ltd T/A MB Artists — Customer privacy notice
        </p>
      </div>

      {/* Body — constrained width for readability of long-form legal text */}
      <article
        className="px-4 md:px-8 max-w-3xl mx-auto pb-24 md:pb-32 text-[15px] leading-relaxed"
        style={{ color: '#bbb' }}
      >
        <p className="mb-12 text-[15px]">
          This privacy notice tells you what to expect us to do with your personal information.
        </p>

        <Section title="Contact details">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-widest block mb-1" style={{ color: '#666' }}>
              Email
            </span>
            <a
              href={`mailto:${PRIVACY_EMAIL}`}
              className="underline underline-offset-2 transition-colors hover:opacity-80"
              style={{ color: ACCENT }}
            >
              {PRIVACY_EMAIL}
            </a>
          </p>
        </Section>

        <Section title="What information we collect, use, and why">
          <p>We collect or use the following information for service updates or marketing purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Names and contact details</li>
          </ul>

          <p className="pt-2">We collect or use the following information to comply with legal requirements:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any other personal information required to comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="Lawful bases and data protection rights">
          <p>
            Under UK data protection law, we must have a "lawful basis" for collecting and using your
            personal information. There is a list of possible{' '}
            <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/getting-started-with-gdpr/data-protection-principles-definitions-and-key-terms/#lawfulbasis">
              lawful bases
            </ExternalLink>{' '}
            in the UK GDPR. You can find out more about lawful bases on the ICO's website.
          </p>
          <p>
            Which lawful basis we rely on may affect your data protection rights which are set out
            in brief below. You can find out more about your data protection rights and the
            exemptions which may apply on the ICO's website:
          </p>

          <ul className="list-disc pl-6 space-y-3 pt-2">
            <li>
              <strong className="text-white font-semibold">Your right of access</strong> — You have
              the right to ask us for copies of your personal information. You can request other
              information such as details about where we get personal information from and who we
              share personal information with. There are some exemptions which means you may not
              receive all the information you ask for.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#roa">
                Read more about the right of access
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to rectification</strong> —
              You have the right to ask us to correct or delete personal information you think is
              inaccurate or incomplete.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtr">
                Read more about the right to rectification
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to erasure</strong> — You
              have the right to ask us to delete your personal information.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rte">
                Read more about the right to erasure
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to restriction of processing</strong> —
              You have the right to ask us to limit how we can use your personal information.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtrop">
                Read more about the right to restriction of processing
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to object to processing</strong> —
              You have the right to object to the processing of your personal data.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rto">
                Read more about the right to object to processing
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to data portability</strong> —
              You have the right to ask that we transfer the personal information you gave us to
              another organisation, or to you.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtdp">
                Read more about the right to data portability
              </ExternalLink>
              .
            </li>
            <li>
              <strong className="text-white font-semibold">Your right to withdraw consent</strong> —
              When we use consent as our lawful basis you have the right to withdraw your consent
              at any time.{' '}
              <ExternalLink href="https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/create-your-own-privacy-notice/your-data-protection-rights/#rtwc">
                Read more about the right to withdraw consent
              </ExternalLink>
              .
            </li>
          </ul>

          <p className="pt-2">
            If you make a request, we must respond to you without undue delay and in any event
            within one month.
          </p>
          <p>
            To make a data protection rights request, please contact us using the contact details
            at the top of this privacy notice.
          </p>
        </Section>

        <Section title="Our lawful bases for the collection and use of your data">
          <p>
            Our lawful bases for collecting or using personal information for service updates or
            marketing purposes are:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white font-semibold">Legal obligation</strong> — we have to
              collect or use your information so we can comply with the law. All of your data
              protection rights may apply, except the right to erasure, the right to object and
              the right to data portability.
            </li>
          </ul>

          <p className="pt-2">
            Our lawful bases for collecting or using personal information for legal requirements
            are:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white font-semibold">Legal obligation</strong> — we have to
              collect or use your information so we can comply with the law. All of your data
              protection rights may apply, except the right to erasure, the right to object and
              the right to data portability.
            </li>
          </ul>
        </Section>

        <Section title="Where we get personal information from">
          <ul className="list-disc pl-6 space-y-2">
            <li>Directly from you</li>
            <li>Publicly available sources</li>
          </ul>
        </Section>

        <Section title="How long we keep information">
          <p>We retain information for up to 2 years.</p>
        </Section>

        <Section title="How to complain">
          <p>
            If you have any concerns about our use of your personal information, you can make a
            data protection complaint to us using the contact details at the top of this notice.
          </p>
          <p>
            If you are not satisfied with our response or believe we are not processing your
            personal data in accordance with the law, you can complain to the Information
            Commissioner's Office (ICO):
          </p>
          <div className="pl-4 border-l-2 mt-3" style={{ borderColor: '#222' }}>
            <p className="font-mono text-[13px] leading-relaxed" style={{ color: '#999' }}>
              Information Commissioner's Office
              <br />
              Wycliffe House, Water Lane
              <br />
              Wilmslow, Cheshire SK9 5AF
              <br />
              Helpline: 0303 123 1113
              <br />
              Website:{' '}
              <ExternalLink href="https://ico.org.uk/make-a-complaint">
                ico.org.uk/make-a-complaint
              </ExternalLink>
            </p>
          </div>
        </Section>

        {/* Last-updated footnote */}
        <div className="pt-12 mt-12 border-t" style={{ borderColor: '#1a1a1a' }}>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#555' }}>
            Last updated: June 2026
          </p>
        </div>
      </article>

      <Footer />
    </main>
  )
}