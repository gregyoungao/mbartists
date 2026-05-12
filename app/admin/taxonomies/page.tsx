// =========================================================
// /admin/taxonomies — manage genres + locations
// =========================================================

import { getServiceClient } from '@/lib/supabase'
import TaxonomyEditor from './TaxonomyEditor'

export const dynamic = 'force-dynamic'

export default async function TaxonomiesPage() {
  const supabase = getServiceClient()
  const [{ data: genres }, { data: locations }] = await Promise.all([
    supabase.from('genres').select('*').order('name'),
    supabase.from('locations').select('*').order('name'),
  ])

  return (
    <section className="px-6 md:px-12 py-12 pt-20 md:pt-12">
      <p
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: '#4E7DFE' }}
      >
        {'// Taxonomies'}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
        Tags
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <TaxonomyEditor
          title="Genres"
          taxonomy="genres"
          items={genres || []}
        />
        <TaxonomyEditor
          title="Locations"
          taxonomy="locations"
          items={locations || []}
        />
      </div>
    </section>
  )
}
