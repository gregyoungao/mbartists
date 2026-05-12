'use client'

import { useState } from 'react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => Promise<void> | void
  trigger: (open: () => void) => React.ReactNode
}

export default function ConfirmDeleteModal({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <>
      {trigger(() => setOpen(true))}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => !confirming && setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full p-8 border"
            style={{ borderColor: '#ff4444', background: '#0a0000' }}
          >
            <p
              className="font-mono text-xs tracking-widest uppercase mb-3"
              style={{ color: '#ff6666' }}
            >
              {'// Confirm Delete'}
            </p>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="mb-8" style={{ color: '#aaa' }}>
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={confirming}
                className="flex-1 font-mono text-xs uppercase tracking-widest py-3 border transition-colors disabled:opacity-50"
                style={{ borderColor: '#444', color: '#888' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 font-mono text-xs uppercase tracking-widest py-3 transition-colors disabled:opacity-50"
                style={{ background: '#ff4444', color: '#000' }}
              >
                {confirming ? 'Deleting...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
