'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AGENT_ROLES } from '@/lib/roles'

export interface AgentFormValues {
  id?: string
  name: string
  loginEmail: string
  contactEmail: string
  password?: string
  bio: string
  role: string
  instagram: string
  linkedin: string
  photoUrl: string | null
}

interface Props {
  initial?: Partial<AgentFormValues>
  mode: 'create' | 'edit'
}

export default function AgentForm({ initial = {}, mode }: Props) {
  const router = useRouter()

  const [name, setName] = useState(initial.name || '')
  const [loginEmail, setLoginEmail] = useState(initial.loginEmail || '')
  const [contactEmail, setContactEmail] = useState(initial.contactEmail || '')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState(initial.bio || '')
  const [role, setRole] = useState(initial.role || '')
  const [instagram, setInstagram] = useState(initial.instagram || '')
  const [linkedin, setLinkedin] = useState(initial.linkedin || '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [existingPhotoUrl] = useState(initial.photoUrl || null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('loginEmail', loginEmail)
      fd.append('contactEmail', contactEmail)
      fd.append('bio', bio)
      fd.append('role', role)
      fd.append('instagram', instagram)
      fd.append('linkedin', linkedin)
      if (password) fd.append('password', password)
      if (photoFile) fd.append('photo', photoFile)
      if (initial.id) fd.append('agentId', initial.id)

      const endpoint = mode === 'create' ? '/api/admin/create-agent' : '/api/admin/update-agent'
      const res = await fetch(endpoint, { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')

      if (mode === 'create') {
        router.push('/admin/agents')
        router.refresh()
      } else {
        setSuccess('Saved.')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div
          className="p-4 border"
          style={{ borderColor: '#ff4444', background: '#1a0000' }}
        >
          <p className="font-mono text-sm" style={{ color: '#ff6666' }}>{error}</p>
        </div>
      )}
      {success && (
        <div
          className="p-4 border"
          style={{ borderColor: '#4E7DFE', background: 'rgba(78, 125, 254, 0.08)' }}
        >
          <p className="font-mono text-sm" style={{ color: '#4E7DFE' }}>{success}</p>
        </div>
      )}

      <Field label="Name *">
        <Input value={name} onChange={setName} required />
      </Field>

      <Field label="Login Email *" hint="Used for signing in. Cannot be changed after creation.">
        <Input
          value={loginEmail}
          onChange={setLoginEmail}
          type="email"
          required
          disabled={mode === 'edit'}
        />
      </Field>

      <Field label="Public Contact Email" hint="Shown on the public agent page. Can be the same as login email or different.">
        <Input value={contactEmail} onChange={setContactEmail} type="email" />
      </Field>

      {mode === 'create' && (
        <Field label="Password *" hint="Set an initial password. The agent can change it later.">
          <Input value={password} onChange={setPassword} type="text" required minLength={8} />
        </Field>
      )}

      <Field label="Role *">
        <select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-black border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        >
          <option value="">Select a role...</option>
          {AGENT_ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </Field>

      <Field
        label={mode === 'create' ? 'Photo *' : 'Photo'}
        hint={mode === 'edit' && existingPhotoUrl ? 'Leave empty to keep existing photo.' : undefined}
      >
        {existingPhotoUrl && mode === 'edit' && (
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
          required={mode === 'create'}
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="font-mono text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#4E7DFE] file:text-black file:font-mono file:text-xs file:uppercase file:tracking-wider cursor-pointer"
          style={{ color: '#888' }}
        />
      </Field>

      <Field label="Bio *">
        <textarea
          required
          rows={6}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full bg-transparent border p-4 outline-none resize-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
      </Field>

      <Field label="Instagram">
        <Input value={instagram} onChange={setInstagram} type="url" placeholder="https://instagram.com/..." />
      </Field>

      <Field label="LinkedIn">
        <Input value={linkedin} onChange={setLinkedin} type="url" placeholder="https://linkedin.com/in/..." />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full font-mono text-xs uppercase tracking-widest py-4 transition-colors disabled:opacity-50"
        style={{ background: '#4E7DFE', color: '#000' }}
      >
        {submitting ? 'Saving...' : mode === 'create' ? 'Create Agent' : 'Save Changes'}
      </button>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="font-mono text-xs tracking-widest uppercase mb-2 block"
        style={{ color: '#4E7DFE' }}
      >
        {label}
      </label>
      {hint && <p className="font-mono text-xs mb-3" style={{ color: '#555' }}>{hint}</p>}
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  type = 'text',
  required,
  disabled,
  placeholder,
  minLength,
}: {
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  minLength?: number
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      minLength={minLength}
      className="w-full bg-transparent border-b-2 py-3 px-0 font-bold outline-none transition-colors disabled:opacity-50"
      style={{ borderColor: '#222', color: '#fff' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
    />
  )
}
