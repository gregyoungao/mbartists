// =========================================================
// app/admin/[secret]/page.tsx
// Simple moderation page. Visit /admin/<your-secret-from-env>
// to approve or reject pending submissions.
// Replace this with proper auth (Supabase Auth or NextAuth)
// before going to production.
// =========================================================

import { notFound } from 'next/navigation'
import { getServiceClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic' // never cache the admin view

export default async function AdminPage({
  params,
}: {
  params: Promise<{ secret: string }>
}) {
  const { secret } = await params
  if (secret !== process.env.ADMIN_SECRET) notFound()

  const supabase = getServiceClient()
  const { data: pending } = await supabase
    .from('artists')
    .select('id, slug, name, small_bio, image_url, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  async function approve(formData: FormData) {
    'use server'
    const id = String(formData.get('id'))
    const supabase = getServiceClient()
    await supabase.from('artists').update({ status: 'published' }).eq('id', id)
    revalidatePath('/artists')
    revalidatePath(`/admin/${process.env.ADMIN_SECRET}`)
  }

  async function reject(formData: FormData) {
    'use server'
    const id = String(formData.get('id'))
    const supabase = getServiceClient()
    await supabase.from('artists').update({ status: 'rejected' }).eq('id', id)
    revalidatePath(`/admin/${process.env.ADMIN_SECRET}`)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
          {'// Admin'}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">Pending</h1>

        {!pending || pending.length === 0 ? (
          <p className="font-mono text-sm" style={{ color: '#666' }}>
            No pending submissions.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((p) => (
              <div key={p.id} className="border p-6 flex gap-6 items-center" style={{ borderColor: '#222' }}>
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="w-20 h-20 object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-xl">{p.name}</p>
                  <p className="font-mono text-xs" style={{ color: '#666' }}>{p.slug}</p>
                  {p.small_bio && (
                    <p className="text-sm mt-2" style={{ color: '#aaa' }}>{p.small_bio}</p>
                  )}
                </div>
                <form action={approve}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="font-mono text-xs uppercase tracking-widest px-4 py-2"
                    style={{ background: '#4E7DFE', color: '#000' }}
                  >
                    Approve
                  </button>
                </form>
                <form action={reject}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="font-mono text-xs uppercase tracking-widest px-4 py-2 border"
                    style={{ borderColor: '#444', color: '#888' }}
                  >
                    Reject
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
