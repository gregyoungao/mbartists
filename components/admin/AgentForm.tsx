'use client'

import { useState, useEffect } from 'react'
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
  /** Vertical focal point 0-100 (0 = top, 50 = center, 100 = bottom) */
  photoFocusY?: number
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

  // Focal point (vertical): 0 = top, 50 = center, 100 = bottom. Default 50.
  const [photoFocusY, setPhotoFocusY] = useState<number>(initial.photoFocusY ?? 50)

  // Local URL for new file preview (revoked on cleanup)
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Build/cleanup blob URL when a new file is selected
  useEffect(() => {
    if (!photoFile) {
      setNewFilePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(photoFile)
    setNewFilePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photoFile])

  // The image src for the focal-point preview: new file > existing photo > none
  const previewSrc = newFilePreviewUrl || existingPhotoUrl

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
      fd.append('photoFocusY', String(photoFocusY))
      if (password) fd.append('password', password)
      if (photoFile) fd.append('photo', photoFile)
      if (initial.id) fd.append('agentId', initial.id)

      const endpoint = mode === 'create' ? '/api/admin/create-agent' : '/api/admin/update-agent'
      const res = await fetch(endpoint, { method: 'POST', body: fd })

      // Read as text first so we can show server errors gracefully
      const responseText = await res.text()
      if (!res.ok) {
        let msg = 'Save failed'
        try {
          const json = JSON.parse(responseText)
          if (json?.error) msg = json.error
        } catch {
          if (responseText && responseText.length < 200) msg = responseText
        }
        throw new Error(msg)
      }

      if (mode === 'create') {
        router.push('/admin/agents')
        router.refresh()
      } else {
        setSuccess('Saved.')
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
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
        <input
          type="file"
          accept="image/*"
          required={mode === 'create'}
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="font-mono text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#4E7DFE] file:text-black file:font-mono file:text-xs file:uppercase file:tracking-wider cursor-pointer mb-4"
          style={{ color: '#888' }}
        />

        {previewSrc && (
          <FocalPointEditor
            src={previewSrc}
            value={photoFocusY}
            onChange={setPhotoFocusY}
            label="hero crop preview"
          />
        )}
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

/**
 * Live preview + slider for vertical focal point.
 *
 * The slider sits directly above the preview frame so its position visually
 * "controls" the image. Dragging the thumb to the RIGHT pushes the image
 * DOWNWARD in the frame (revealing more of the top of the photo).
 *
 * Internally we still store value as 0-100 where 0 = top of image, 100 =
 * bottom of image (the natural "% from top" convention). The slider input
 * value is the inverse so the visual direction matches the image movement.
 */
export function FocalPointEditor({
  src,
  value,
  onChange,
  label = 'focal point',
}: {
  src: string
  value: number
  onChange: (v: number) => void
  label?: string
}) {
  // Slider thumb position: LEFT = 0 (image up / show bottom),
  //                       RIGHT = 100 (image down / show top)
  const sliderPosition = 100 - value

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#555' }}>
        {`// ${label}`}
      </p>

      {/* Slider — connected directly to the top of the image preview */}
      <input
        type="range"
        min={0}
        max={100}
        value={sliderPosition}
        onChange={(e) => onChange(100 - parseInt(e.target.value, 10))}
        className="w-full block cursor-pointer accent-[#4E7DFE]"
        aria-label="Drag right to push image down, drag left to push image up"
      />

      {/* Preview frame — same aspect (16/9) as the hero on the public page */}
      <div
        className="relative w-full overflow-hidden border"
        style={{ aspectRatio: '16 / 9', borderColor: '#222' }}
      >
        <img
          src={src}
          alt="Focal point preview"
          className="w-full h-full object-cover transition-[object-position] duration-100"
          style={{ objectPosition: `center ${value}%` }}
        />
      </div>

      <p className="font-mono text-[10px]" style={{ color: '#555' }}>
        Drag the slider right to push the image down (focus on top). Drag left to push the image up (focus on bottom).
        {value === 50
          ? ' Currently centered.'
          : value < 50
            ? ' Currently focused on the upper part.'
            : ' Currently focused on the lower part.'}
      </p>
    </div>
  )
}