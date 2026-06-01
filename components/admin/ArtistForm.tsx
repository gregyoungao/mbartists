'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FocalPointEditor } from '@/components/admin/AgentForm'

interface ArtistFormInitial {
  id?: string
  name: string
  primaryAgentId: string
  secondaryAgentId: string
  smallBio: string
  largeBio: string
  academyArtist: boolean
  featuredArtist: boolean
  instagram: string
  spotify: string
  soundcloud: string
  facebook: string
  tiktok: string
  spotlight1: string
  spotlight2: string
  spotlight3: string
  spotlight4: string
  imageUrl: string | null
  /** Vertical focal point 0-100 (0 = top, 50 = center, 100 = bottom) */
  imageFocusY?: number
  selectedGenres: string[]
  /** ID of the genre marked as primary. Must be one of selectedGenres. */
  primaryGenreId?: string
  selectedLocations: string[]
}

interface Props {
  initial: Partial<ArtistFormInitial>
  agents: { id: string; name: string }[]
  genres: { id: string; name: string }[]
  locations: { id: string; name: string }[]
  mode: 'create' | 'edit'
  lockPrimaryAgent?: boolean
  redirectTo?: string
}

export default function ArtistForm({
  initial,
  agents,
  genres,
  locations,
  mode,
  lockPrimaryAgent,
  redirectTo = '/admin/artists',
}: Props) {
  const router = useRouter()

  const [name, setName] = useState(initial.name || '')
  const [primaryAgentId, setPrimaryAgentId] = useState(initial.primaryAgentId || '')
  const [secondaryAgentId, setSecondaryAgentId] = useState(initial.secondaryAgentId || '')
  const [smallBio, setSmallBio] = useState(initial.smallBio || '')
  const [largeBio, setLargeBio] = useState(initial.largeBio || '')
  const [academyArtist, setAcademyArtist] = useState(initial.academyArtist || false)
  const [featuredArtist, setFeaturedArtist] = useState(initial.featuredArtist || false)
  const [instagram, setInstagram] = useState(initial.instagram || '')
  const [spotify, setSpotify] = useState(initial.spotify || '')
  const [soundcloud, setSoundcloud] = useState(initial.soundcloud || '')
  const [facebook, setFacebook] = useState(initial.facebook || '')
  const [tiktok, setTiktok] = useState(initial.tiktok || '')
  const [spotlight1, setSpotlight1] = useState(initial.spotlight1 || '')
  const [spotlight2, setSpotlight2] = useState(initial.spotlight2 || '')
  const [spotlight3, setSpotlight3] = useState(initial.spotlight3 || '')
  const [spotlight4, setSpotlight4] = useState(initial.spotlight4 || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const existingImageUrl = initial.imageUrl || null

  const [imageFocusY, setImageFocusY] = useState<number>(initial.imageFocusY ?? 50)
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(null)

  const [selectedGenres, setSelectedGenres] = useState<string[]>(initial.selectedGenres || [])
  const [primaryGenreId, setPrimaryGenreId] = useState<string>(initial.primaryGenreId || '')
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initial.selectedLocations || [])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!imageFile) {
      setNewFilePreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setNewFilePreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const previewSrc = newFilePreviewUrl || existingImageUrl

  // Keep primaryGenreId valid: if the chosen primary is removed from the
  // selected genres, clear it. If exactly one genre is selected, auto-pick it.
  useEffect(() => {
    if (selectedGenres.length === 0) {
      if (primaryGenreId) setPrimaryGenreId('')
      return
    }
    if (selectedGenres.length === 1) {
      // Auto-assign the lone genre as primary
      if (primaryGenreId !== selectedGenres[0]) setPrimaryGenreId(selectedGenres[0])
      return
    }
    // Multiple selected: if the current primary isn't among them anymore, clear it
    if (primaryGenreId && !selectedGenres.includes(primaryGenreId)) {
      setPrimaryGenreId('')
    }
  }, [selectedGenres, primaryGenreId])

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }
  const toggleLocation = (id: string) => {
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const primaryAgentName = agents.find((a) => a.id === primaryAgentId)?.name || ''

  // Genre objects matching currently-selected IDs (for primary radio)
  const selectedGenreObjects = genres.filter((g) => selectedGenres.includes(g.id))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedGenres.length === 0) {
      setError('At least one genre is required.')
      return
    }
    if (selectedLocations.length === 0) {
      setError('At least one location is required.')
      return
    }
    if (!primaryAgentId) {
      setError('Primary agent is required.')
      return
    }
    if (selectedGenres.length > 1 && !primaryGenreId) {
      setError('Please pick which genre is the artist’s primary.')
      return
    }

    setSubmitting(true)

    try {
      const fd = new FormData()
      if (initial.id) fd.append('artistId', initial.id)
      fd.append('name', name)
      fd.append('primaryAgentId', primaryAgentId)
      fd.append('secondaryAgentId', secondaryAgentId)
      fd.append('smallBio', smallBio)
      fd.append('largeBio', largeBio)
      fd.append('academyArtist', String(academyArtist))
      fd.append('featuredArtist', String(featuredArtist))
      fd.append('instagram', instagram)
      fd.append('spotify', spotify)
      fd.append('soundcloud', soundcloud)
      fd.append('facebook', facebook)
      fd.append('tiktok', tiktok)
      fd.append('spotlight1', spotlight1)
      fd.append('spotlight2', spotlight2)
      fd.append('spotlight3', spotlight3)
      fd.append('spotlight4', spotlight4)
      fd.append('imageFocusY', String(imageFocusY))
      fd.append('genres', JSON.stringify(selectedGenres))
      fd.append('primaryGenreId', primaryGenreId)
      fd.append('locations', JSON.stringify(selectedLocations))
      if (imageFile) fd.append('image', imageFile)

      const res = await fetch('/api/admin/save-artist', { method: 'POST', body: fd })

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

      setSaved(true)
      setSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
      setSubmitting(false)
    }
  }

  if (saved) {
    const backLabel = redirectTo.includes('dashboard') ? 'My Roster' : 'Artists'
    return (
      <div className="max-w-3xl">
        <div
          className="p-8 border mb-6"
          style={{ borderColor: '#4E7DFE', background: 'rgba(78, 125, 254, 0.08)' }}
        >
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: '#4E7DFE' }}
          >
            {'// Success'}
          </p>
          <h2 className="text-2xl font-bold mb-2">
            {mode === 'create' ? 'Artist created' : 'Changes saved'}
          </h2>
          <p style={{ color: '#888' }}>
            {mode === 'create'
              ? `${name} has been added to the roster.`
              : `Your changes to ${name} have been saved.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={redirectTo}
            className="flex-1 text-center font-mono text-xs uppercase tracking-widest px-6 py-4 transition-colors"
            style={{ background: '#4E7DFE', color: '#000' }}
          >
            ← Back to {backLabel}
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 font-mono text-xs uppercase tracking-widest px-6 py-4 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
            style={{ borderColor: '#222', color: '#888' }}
          >
            {mode === 'create' ? 'Add Another' : 'Edit Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="p-4 border" style={{ borderColor: '#ff4444', background: '#1a0000' }}>
          <p className="font-mono text-sm" style={{ color: '#ff6666' }}>{error}</p>
        </div>
      )}

      <Field label="Artist Name *">
        <Input value={name} onChange={setName} required />
      </Field>

      <Field
        label={mode === 'create' ? 'Image *' : 'Image'}
        hint={mode === 'edit' && existingImageUrl ? 'Leave empty to keep existing image.' : undefined}
      >
        <input
          type="file"
          accept="image/*"
          required={mode === 'create'}
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="font-mono text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#4E7DFE] file:text-black file:font-mono file:text-xs file:uppercase file:tracking-wider cursor-pointer mb-4"
          style={{ color: '#888' }}
        />

        {previewSrc && (
          <FocalPointEditor
            src={previewSrc}
            value={imageFocusY}
            onChange={setImageFocusY}
            label="hero crop preview"
          />
        )}
      </Field>

      <Field label="Primary Agent *" hint={lockPrimaryAgent ? "You are assigned as the primary agent for artists you create." : undefined}>
        {lockPrimaryAgent ? (
          <div
            className="p-3 border font-mono text-sm"
            style={{ borderColor: '#222', background: '#0a0a0a', color: '#4E7DFE' }}
          >
            {primaryAgentName || '(you)'}
          </div>
        ) : (
          <Select value={primaryAgentId} onChange={setPrimaryAgentId} options={agents} placeholder="Select an agent" required />
        )}
      </Field>

      <Field label="Secondary Agent">
        <Select value={secondaryAgentId} onChange={setSecondaryAgentId} options={agents} placeholder="(Optional)" />
      </Field>

      <Field label="Genres *" hint="Tap to add genres this artist plays.">
        <ChipPicker options={genres} selected={selectedGenres} onToggle={toggleGenre} />
      </Field>

      {/* Primary Genre — only shown when 2+ genres are selected.
          When exactly 1 is selected, it auto-becomes primary. */}
      {selectedGenres.length > 1 && (
        <Field
          label="Primary Genre *"
          hint="Pick which of the genres above is the artist’s strongest fit. Used for filtering and as the headline tag on their profile."
        >
          <div className="flex flex-wrap gap-2">
            {selectedGenreObjects.map((g) => {
              const isPrimary = primaryGenreId === g.id
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setPrimaryGenreId(g.id)}
                  className="font-mono text-xs px-3 py-1.5 border transition-all"
                  style={{
                    borderColor: isPrimary ? '#4E7DFE' : '#222',
                    background: isPrimary ? '#4E7DFE' : 'transparent',
                    color: isPrimary ? '#000' : '#888',
                  }}
                >
                  {g.name}
                </button>
              )
            })}
          </div>
        </Field>
      )}

      <Field label="Locations *">
        <ChipPicker options={locations} selected={selectedLocations} onToggle={toggleLocation} />
      </Field>

      <Field label="Small Bio *" hint="One-line summary, shown in cards.">
        <Textarea value={smallBio} onChange={setSmallBio} required rows={2} />
      </Field>

      <Field label="Large Bio *" hint="Full bio. Use blank lines between paragraphs.">
        <Textarea value={largeBio} onChange={setLargeBio} required rows={8} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Toggle label="Academy Artist" checked={academyArtist} onChange={setAcademyArtist} />
        <Toggle label="Featured Artist" checked={featuredArtist} onChange={setFeaturedArtist} />
      </div>

      <div>
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
          {'// Socials'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UrlInput placeholder="Instagram URL" value={instagram} onChange={setInstagram} />
          <UrlInput placeholder="Spotify URL" value={spotify} onChange={setSpotify} />
          <UrlInput placeholder="SoundCloud URL" value={soundcloud} onChange={setSoundcloud} />
          <UrlInput placeholder="Facebook URL" value={facebook} onChange={setFacebook} />
          <UrlInput placeholder="TikTok URL" value={tiktok} onChange={setTiktok} />
        </div>
      </div>

      <div>
        <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
          {'// Spotlight Tracks'}
        </p>
        <div className="space-y-3">
          <UrlInput placeholder="Spotlight 1 (URL)" value={spotlight1} onChange={setSpotlight1} />
          <UrlInput placeholder="Spotlight 2 (URL)" value={spotlight2} onChange={setSpotlight2} />
          <UrlInput placeholder="Spotlight 3 (URL)" value={spotlight3} onChange={setSpotlight3} />
          <UrlInput placeholder="Spotlight 4 (URL)" value={spotlight4} onChange={setSpotlight4} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full font-mono text-xs uppercase tracking-widest py-4 transition-colors disabled:opacity-50"
        style={{ background: '#4E7DFE', color: '#000' }}
      >
        {submitting ? 'Saving...' : mode === 'create' ? 'Create Artist' : 'Save Changes'}
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

function Input({ value, onChange, required, type = 'text' }: { value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-transparent border-b-2 py-3 px-0 font-bold text-2xl outline-none"
      style={{ borderColor: '#222', color: '#fff' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
    />
  )
}

function Textarea({ value, onChange, required, rows }: { value: string; onChange: (v: string) => void; required?: boolean; rows: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rows={rows}
      className="w-full bg-transparent border p-4 outline-none resize-none"
      style={{ borderColor: '#222', color: '#fff' }}
    />
  )
}

function UrlInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border p-3 font-mono text-sm outline-none"
      style={{ borderColor: '#222', color: '#fff' }}
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  value: string
  onChange: (v: string) => void
  options: { id: string; name: string }[]
  placeholder?: string
  required?: boolean
}) {
  return (
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border p-3 font-mono text-sm outline-none"
      style={{ borderColor: '#222', color: '#fff' }}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  )
}

function ChipPicker({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; name: string }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.id)
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            className="font-mono text-xs px-3 py-1.5 border transition-all"
            style={{
              borderColor: active ? '#4E7DFE' : '#222',
              background: active ? '#4E7DFE' : 'transparent',
              color: active ? '#000' : '#666',
            }}
          >
            {o.name}
          </button>
        )
      })}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between p-4 border transition-colors"
      style={{ borderColor: checked ? '#4E7DFE' : '#222' }}
    >
      <span className="font-mono text-xs uppercase tracking-wider" style={{ color: checked ? '#4E7DFE' : '#888' }}>
        {label}
      </span>
      <span className="w-10 h-5 rounded-full relative transition-colors" style={{ background: checked ? '#4E7DFE' : '#222' }}>
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </span>
    </button>
  )
}