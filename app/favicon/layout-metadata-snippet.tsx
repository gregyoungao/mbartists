// =========================================================
// app/layout.tsx — add or update this `metadata` export
// =========================================================
// Drop this `metadata` block into your existing root layout file.
// (Keep all your other layout code — html tag, body, fonts, etc.
//  This block goes alongside, not as a replacement for the file.)
// =========================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  // Title template — child pages can set their own `title` and it
  // gets formatted as e.g. "SVDKO | MB Artists Agency".
  // If a page doesn't set a title, the default kicks in.
  title: {
    default: 'MB Artists Agency',
    template: '%s | MB Artists',
  },

  description:
    'MB Artists Agency — global booking agency representing emerging and established electronic music artists. Tech house, deep house, techno, bass and more.',

  // Used by social shares and search engines
  openGraph: {
    title: 'MB Artists Agency',
    description:
      'Global booking agency representing electronic music artists worldwide.',
    siteName: 'MB Artists',
    url: 'https://mbartists.vercel.app',
    type: 'website',
  },

  // Twitter / X share card (compatible with X)
  twitter: {
    card: 'summary',
    title: 'MB Artists Agency',
    description:
      'Global booking agency representing electronic music artists worldwide.',
  },

  // Tells search engines the canonical base URL
  metadataBase: new URL('https://mbartists.vercel.app'),
}
