'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

export default function ArtistRowActions({
  artistId,
  artistName,
  archived,
}: {
  artistId: string
  artistName: string
  archived: boolean
}) {
  const router = useRouter()

  const handleArchive = async (action: 'archive' | 'restore' | 'hard_delete') => {
    const res = await fetch('/api/admin/delete-artist', {
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
        href={`/admin/artists/${artistId}/edit`}
        className="flex-1 text-center font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
        style={{ borderColor: '#222', color: '#888' }}
      >
        Edit
      </Link>
      {archived ? (
        <>
          <button
            onClick={() => handleArchive('restore')}
            className="flex-1 font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
            style={{ borderColor: '#222', color: '#888' }}
          >
            Restore
          </button>
          <ConfirmDeleteModal
            title={`Permanently delete ${artistName}?`}
            message="This will delete the artist and all data forever. This cannot be undone."
            confirmLabel="Delete forever"
            onConfirm={() => handleArchive('hard_delete')}
            trigger={(open) => (
              <button
                onClick={open}
                className="font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#ff4444] hover:text-[#ff4444]"
                style={{ borderColor: '#222', color: '#666' }}
                aria-label="Permanently delete"
                title="Permanently delete"
              >
                ✕
              </button>
            )}
          />
        </>
      ) : (
        <ConfirmDeleteModal
          title={`Archive ${artistName}?`}
          message="This will hide the artist from the public site. You can restore them later."
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
      )}
    </div>
  )
}
