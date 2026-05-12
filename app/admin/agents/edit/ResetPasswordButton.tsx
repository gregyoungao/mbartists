'use client'

import { useState } from 'react'

export default function ResetPasswordButton({ agentId }: { agentId: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [customPassword, setCustomPassword] = useState('')

  const handleReset = async (mode: 'random' | 'custom') => {
    if (mode === 'custom' && customPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!confirm('Reset this agent\'s password? They will need to use the new password next time they log in.')) return

    setSubmitting(true)
    setError(null)
    setNewPassword(null)

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          customPassword: mode === 'custom' ? customPassword : undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Reset failed')
      setNewPassword(json.password)
      setCustomPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 border" style={{ borderColor: '#ff4444', background: '#1a0000' }}>
          <p className="font-mono text-sm" style={{ color: '#ff6666' }}>{error}</p>
        </div>
      )}
      {newPassword && (
        <div className="p-6 border" style={{ borderColor: '#4E7DFE', background: 'rgba(78, 125, 254, 0.05)' }}>
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: '#4E7DFE' }}
          >
            New Password (copy now — won't show again)
          </p>
          <p className="font-mono text-2xl break-all select-all" style={{ color: '#fff' }}>
            {newPassword}
          </p>
        </div>
      )}

      <div>
        <button
          onClick={() => handleReset('random')}
          disabled={submitting}
          className="font-mono text-xs uppercase tracking-widest px-6 py-3 border w-full md:w-auto transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE] disabled:opacity-50"
          style={{ borderColor: '#444', color: '#888' }}
        >
          {submitting ? 'Resetting...' : 'Generate random password'}
        </button>
      </div>

      <div className="pt-6 border-t" style={{ borderColor: '#1a1a1a' }}>
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#666' }}>
          Or set a specific password
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={customPassword}
            onChange={(e) => setCustomPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="flex-1 bg-transparent border p-3 font-mono text-sm outline-none"
            style={{ borderColor: '#222', color: '#fff' }}
          />
          <button
            onClick={() => handleReset('custom')}
            disabled={submitting || customPassword.length < 8}
            className="font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors disabled:opacity-50"
            style={{ background: '#ff4444', color: '#000' }}
          >
            {submitting ? 'Setting...' : 'Set Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
