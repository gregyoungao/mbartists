'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Initial {
  name: string
  contactEmail: string
  bio: string
  instagram: string
  linkedin: string
  photoUrl: string | null
}

export default function ProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter()

  const [name, setName] = useState(initial.name)
  const [contactEmail, setContactEmail] = useState(initial.contactEmail)
  const [bio, setBio] = useState(initial.bio)
  const [instagram, setInstagram] = useState(initial.instagram)
  const [linkedin, setLinkedin] = useState(initial.linkedin)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const existingPhotoUrl = initial.photoUrl

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('contactEmail', contactEmail)
      fd.append('bio', bio)
      fd.append('instagram', instagram)
      fd.append('linkedin', linkedin)
      if (photoFile) fd.append('photo', photoFile)

      const res = await fetch('/api/agent/update-profile', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')

      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
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
          <p className="font-mono text-sm" style={{ color: '#4E7DFE' }}>Profile saved.</p>
        </div>
      )}

      <Field label="Name *">
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border-b-2 py-3 px-0 font-bold text-xl outline-none transition-colors"
          style={{ borderColor: '#222', color: '#fff' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
        />
      </Field>

      <Field label="Public Contact Email" hint="Shown on your public profile.">
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full bg-transparent border-b-2 py-3 px-0 font-bold outline-none transition-colors"
          style={{ borderColor: '#222', color: '#fff' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
        />
      </Field>

      <Field label="Photo" hint="Leave empty to keep your existing photo.">
        {existingPhotoUrl && (
          <img
            src={existingPhotoUrl}
            alt="Current"
            className="w-24 h-24 object-cover mb-3 border"
            style={{ borderColor: '#222' }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="font-mono text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#4E7DFE] file:text-black file:font-mono file:text-xs file:uppercase file:tracking-wider cursor-pointer"
          style={{ color: '#888' }}
        />
      </Field>

      <Field label="Bio">
        <textarea
          rows={6}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full bg-transparent border p-4 outline-none resize-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <Field label="Instagram">
        <input
          type="url"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="https://instagram.com/..."
          className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <Field label="LinkedIn">
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="https://linkedin.com/in/..."
          className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full font-mono text-xs uppercase tracking-widest py-4 transition-colors disabled:opacity-50"
        style={{ background: '#4E7DFE', color: '#000' }}
      >
        {submitting ? 'Saving...' : 'Save Profile'}
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
