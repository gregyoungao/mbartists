'use client'

import { useState } from 'react'

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords don\'t match.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/agent/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Could not change password')

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 border" style={{ borderColor: '#ff4444', background: '#1a0000' }}>
          <p className="font-mono text-sm" style={{ color: '#ff6666' }}>{error}</p>
        </div>
      )}
      {success && (
        <div
          className="p-4 border"
          style={{ borderColor: '#4E7DFE', background: 'rgba(78, 125, 254, 0.08)' }}
        >
          <p className="font-mono text-sm" style={{ color: '#4E7DFE' }}>
            Password changed successfully.
          </p>
        </div>
      )}

      <Field label="Current Password">
        <input
          required
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <Field label="New Password" hint="At least 8 characters.">
        <input
          required
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          minLength={8}
          className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <Field label="Confirm New Password">
        <input
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors disabled:opacity-50"
        style={{ background: '#4E7DFE', color: '#000' }}
      >
        {submitting ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-xs tracking-widest uppercase mb-2 block" style={{ color: '#4E7DFE' }}>
        {label}
      </label>
      {hint && <p className="font-mono text-xs mb-3" style={{ color: '#555' }}>{hint}</p>}
      {children}
    </div>
  )
}
