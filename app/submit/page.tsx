'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/nav/Navigation'
import { supabase, type Agent, type Genre, type Location } from '@/lib/supabase'

export default function SubmitArtistPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    primary_agent_id: '',
    secondary_agent_id: '',
    small_bio: '',
    large_bio: '',
    academy_artist: false,
    featured_artist: false,
    instagram: '',
    spotify: '',
    soundcloud: '',
    facebook: '',
    tiktok: '',
    spotlight_1: '',
    spotlight_2: '',
    spotlight_3: '',
    spotlight_4: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Load dropdown data
  useEffect(() => {
    Promise.all([
      supabase.from('agents').select('*').order('name'),
      supabase.from('genres').select('*').order('name'),
      supabase.from('locations').select('*').order('name'),
    ]).then(([a, g, l]) => {
      setAgents(a.data || [])
      setGenres(g.data || [])
      setLocations(l.data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Build multipart form data so we can include the image file
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      fd.append('genres', JSON.stringify(selectedGenres))
      fd.append('locations', JSON.stringify(selectedLocations))
      if (imageFile) fd.append('image', imageFile)

      const res = await fetch('/api/submit-artist', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navigation />
        <section className="pt-32 pb-16 px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
              {'// Submission Received'}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Thanks.</h1>
            <p className="text-lg" style={{ color: '#666' }}>
              Your artist profile is pending review. You'll hear back once it's approved.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
            {'// New Artist'}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Submit</h1>
          <p className="text-lg mb-12" style={{ color: '#666' }}>
            Fill in the artist's details. Required fields marked with *.
          </p>

          {error && (
            <div className="mb-8 p-4 border" style={{ borderColor: '#ff4444', background: '#1a0000' }}>
              <p className="font-mono text-sm" style={{ color: '#ff6666' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Artist Name */}
            <Field label="Artist Name *">
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b-2 py-3 px-0 font-bold text-2xl outline-none transition-colors"
                style={{ borderColor: '#222' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
              />
            </Field>

            {/* Image upload */}
            <Field label="Artist Image *">
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="font-mono text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#4E7DFE] file:text-black file:font-mono file:text-xs file:uppercase file:tracking-wider hover:file:bg-[#6b91ff] cursor-pointer"
                style={{ color: '#888' }}
              />
            </Field>

            {/* Primary Agent */}
            <Field label="Primary Agent *">
              <Select
                required
                value={form.primary_agent_id}
                onChange={(v) => setForm({ ...form, primary_agent_id: v })}
                options={agents.map((a) => ({ value: a.id, label: a.name }))}
                placeholder="Select an agent"
              />
            </Field>

            {/* Secondary Agent */}
            <Field label="Secondary Agent">
              <Select
                value={form.secondary_agent_id}
                onChange={(v) => setForm({ ...form, secondary_agent_id: v })}
                options={agents.map((a) => ({ value: a.id, label: a.name }))}
                placeholder="(Optional)"
              />
            </Field>

            {/* Genres */}
            <Field label="Genres *">
              <ChipPicker
                options={genres.map((g) => ({ value: g.id, label: g.name }))}
                selected={selectedGenres}
                onChange={setSelectedGenres}
              />
            </Field>

            {/* Locations */}
            <Field label="Locations *">
              <ChipPicker
                options={locations.map((l) => ({ value: l.id, label: l.name }))}
                selected={selectedLocations}
                onChange={setSelectedLocations}
              />
            </Field>

            {/* Small Bio */}
            <Field label="Small Bio *" hint="One-line summary, shown in cards.">
              <textarea
                required
                rows={2}
                value={form.small_bio}
                onChange={(e) => setForm({ ...form, small_bio: e.target.value })}
                className="w-full bg-transparent border p-4 outline-none resize-none transition-colors"
                style={{ borderColor: '#222' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
              />
            </Field>

            {/* Large Bio */}
            <Field label="Large Bio *" hint="Full bio for the artist page. Use blank lines for paragraphs.">
              <textarea
                required
                rows={8}
                value={form.large_bio}
                onChange={(e) => setForm({ ...form, large_bio: e.target.value })}
                className="w-full bg-transparent border p-4 outline-none resize-none transition-colors leading-relaxed"
                style={{ borderColor: '#222' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
              />
            </Field>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <Toggle
                label="Academy Artist"
                checked={form.academy_artist}
                onChange={(v) => setForm({ ...form, academy_artist: v })}
              />
              <Toggle
                label="Featured Artist"
                checked={form.featured_artist}
                onChange={(v) => setForm({ ...form, featured_artist: v })}
              />
            </div>

            {/* Socials */}
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
                {'// Socials'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UrlInput placeholder="Instagram URL" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />
                <UrlInput placeholder="Spotify URL" value={form.spotify} onChange={(v) => setForm({ ...form, spotify: v })} />
                <UrlInput placeholder="SoundCloud URL" value={form.soundcloud} onChange={(v) => setForm({ ...form, soundcloud: v })} />
                <UrlInput placeholder="Facebook URL" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} />
                <UrlInput placeholder="TikTok URL" value={form.tiktok} onChange={(v) => setForm({ ...form, tiktok: v })} />
              </div>
            </div>

            {/* Spotlights */}
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#4E7DFE' }}>
                {'// Spotlight Tracks (Spotify URLs)'}
              </p>
              <div className="space-y-3">
                <UrlInput placeholder="Spotlight 1" value={form.spotlight_1} onChange={(v) => setForm({ ...form, spotlight_1: v })} />
                <UrlInput placeholder="Spotlight 2" value={form.spotlight_2} onChange={(v) => setForm({ ...form, spotlight_2: v })} />
                <UrlInput placeholder="Spotlight 3" value={form.spotlight_3} onChange={(v) => setForm({ ...form, spotlight_3: v })} />
                <UrlInput placeholder="Spotlight 4" value={form.spotlight_4} onChange={(v) => setForm({ ...form, spotlight_4: v })} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-mono text-xs uppercase tracking-widest py-4 transition-colors disabled:opacity-50"
              style={{ background: '#4E7DFE', color: '#000' }}
            >
              {submitting ? 'Submitting...' : 'Submit Artist'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

// =========================================================
// SUB-COMPONENTS
// =========================================================

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-xs tracking-widest uppercase mb-3 block" style={{ color: '#4E7DFE' }}>
        {label}
      </label>
      {hint && <p className="font-mono text-xs mb-2" style={{ color: '#555' }}>{hint}</p>}
      {children}
    </div>
  )
}

function UrlInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="url"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border p-3 font-mono text-sm outline-none transition-colors"
      style={{ borderColor: '#222', color: '#fff' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = '#4E7DFE')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#222')}
    />
  )
}

function Select({ value, onChange, options, placeholder, required }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string; required?: boolean }) {
  return (
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black border p-3 font-mono text-sm outline-none transition-colors"
      style={{ borderColor: '#222', color: '#fff' }}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function ChipPicker({ options, selected, onChange }: { options: { value: string; label: string }[]; selected: string[]; onChange: (s: string[]) => void }) {
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className="font-mono text-xs px-3 py-1.5 border transition-all duration-200"
            style={{
              borderColor: active ? '#4E7DFE' : '#222',
              background: active ? '#4E7DFE' : 'transparent',
              color: active ? '#000' : '#666',
            }}
          >
            {o.label}
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
      <span
        className="w-10 h-5 rounded-full relative transition-colors"
        style={{ background: checked ? '#4E7DFE' : '#222' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-black transition-all"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </span>
    </button>
  )
}
