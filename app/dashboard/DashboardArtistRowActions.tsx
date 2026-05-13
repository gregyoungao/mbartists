'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

export default function DashboardArtistRowActions({
  artistId,
  artistName,
  archived,
  isPrimary,
}: {
  artistId: string
  artistName: string
  archived: boolean
  isPrimary: boolean
}) {
  const router = useRouter()

  const handleArchive = async (action: 'archive' | 'restore') => {
    const res = await fetch('/api/agent/archive-artist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistId, action }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      alert(json.error || 'Action failed')
      return
    }
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/dashboard/artists/${artistId}/edit`}
        className="flex-1 text-center font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
        style={{ borderColor: '#222', color: '#888' }}
      >
        Edit
      </Link>
      {/* Only primary agent can archive/restore */}
      {isPrimary && (
        archived ? (
          <button
            onClick={() => handleArchive('restore')}
            className="flex-1 font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
            style={{ borderColor: '#222', color: '#888' }}
          >
            Restore
          </button>
        ) : (
          <ConfirmDeleteModal
            title={`Archive ${artistName}?`}
            message="This will hide the artist from the public site. You can restore them later from the Archive tab."
            confirmLabel="Archive"
            onConfirm={() => handleArchive('archive')}
            trigger={(open) => (
              <button
                onClick={open}
                className="flex-1 font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#ff4444] hover:text-[#ff4444]"
                style={{ borderColor: '#222', color: '#666' }}
              >
                Archive
              </button>
            )}
          />
        )
      )}
    </div>
  )
}
