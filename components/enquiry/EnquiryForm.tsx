"use client"

import { useState } from "react"

interface ArtistOption {
  id: string
  name: string
}

interface Props {
  artists: ArtistOption[]
  lockedArtistId?: string
  lockedArtistName?: string
  // 'dark' = white text on dark bg (default), 'light' = dark text on light bg
  theme?: "light" | "dark"
}

export default function EnquiryForm({
  artists,
  lockedArtistId,
  lockedArtistName,
  theme = "dark",
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [artistId, setArtistId] = useState(lockedArtistId || "")
  const [eventName, setEventName] = useState("")
  const [proposedOffer, setProposedOffer] = useState("")
  const [ticketPrice, setTicketPrice] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [message, setMessage] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  // Theme-aware colors
  const isLight = theme === "light"
  const c = {
    label: isLight ? "#666" : "#888",
    inputText: isLight ? "#0a0a0a" : "#fff",
    inputBorder: isLight ? "#ccc" : "#222",
    divider: isLight ? "#d4cfc6" : "#333",
    chipBorder: isLight ? "#ccc" : "#222",
    chipText: isLight ? "#444" : "#666",
    errorBg: isLight ? "#ffeded" : "#1a0000",
    accent: "#4E7DFE",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!artistId) {
      setError("Please select an artist.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          name,
          email,
          organization,
          eventLocation,
          eventName,
          proposedOffer,
          ticketPrice,
          eventDate: eventDate || null,
          message,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not send enquiry")

      setSent(true)
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  // Success state
  if (sent) {
    return (
      <div
        className="p-8 border"
        style={{
          borderColor: c.accent,
          background: "rgba(78, 125, 254, 0.08)",
        }}
      >
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: c.accent }}
        >
          {"// Enquiry Sent"}
        </p>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: c.inputText }}
        >
          Thank you
        </h3>
        <p style={{ color: c.label }}>
          Your enquiry has been received. The artist&apos;s agent will be in
          touch with you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: c.accent }}
      >
        Your Enquiry
      </p>

      {error && (
        <div
          className="p-4 border"
          style={{ borderColor: "#ff4444", background: c.errorBg }}
        >
          <p className="font-mono text-sm" style={{ color: "#cc0000" }}>
            {error}
          </p>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Name *" labelColor={c.label}>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Joe Bloggs"
            required
            colors={c}
          />
        </FormField>
        <FormField label="Email *" labelColor={c.label}>
          <TextInput
            value={email}
            onChange={setEmail}
            placeholder="joe@acmecorp.com"
            type="email"
            required
            colors={c}
          />
        </FormField>
      </div>

      {/* Company + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name *" labelColor={c.label}>
          <TextInput
            value={organization}
            onChange={setOrganization}
            placeholder="Acme Corp"
            required
            colors={c}
          />
        </FormField>
        <FormField label="Location *" labelColor={c.label}>
          <TextInput
            value={eventLocation}
            onChange={setEventLocation}
            placeholder="London, United Kingdom"
            required
            colors={c}
          />
        </FormField>
      </div>

      <Divider color={c.divider} />

      {/* Select Acts — single artist */}
      <FormField label="Select Act *" labelColor={c.label}>
        {lockedArtistId ? (
          <div
            className="inline-block font-mono text-xs px-4 py-2 border"
            style={{
              borderColor: c.accent,
              background: c.accent,
              color: "#000",
            }}
          >
            {lockedArtistName}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => {
              const active = artistId === artist.id
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => setArtistId(artist.id)}
                  className="font-mono text-xs px-4 py-2 border transition-all duration-200"
                  style={{
                    borderColor: active ? c.accent : c.chipBorder,
                    background: active ? c.accent : "transparent",
                    color: active ? "#000" : c.chipText,
                  }}
                >
                  {artist.name}
                </button>
              )
            })}
            {artists.length === 0 && (
              <p
                className="font-mono text-xs"
                style={{ color: c.chipText }}
              >
                No artists available.
              </p>
            )}
          </div>
        )}
      </FormField>

      <Divider color={c.divider} />

      {/* Event Name + Proposed Offer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Event Name" labelColor={c.label}>
          <TextInput
            value={eventName}
            onChange={setEventName}
            placeholder="ABC Events"
            colors={c}
          />
        </FormField>
        <FormField label="Proposed Offer" labelColor={c.label}>
          <TextInput
            value={proposedOffer}
            onChange={setProposedOffer}
            placeholder="£000.00"
            colors={c}
          />
        </FormField>
      </div>

      {/* Ticket Price + Event Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Ticket Price" labelColor={c.label}>
          <TextInput
            value={ticketPrice}
            onChange={setTicketPrice}
            placeholder="£00.00"
            colors={c}
          />
        </FormField>
        <FormField label="Event Date" labelColor={c.label}>
          <TextInput
            value={eventDate}
            onChange={setEventDate}
            type="date"
            colors={c}
          />
        </FormField>
      </div>

      {/* Message */}
      <FormField label="Your Message *" labelColor={c.label}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Tell us more..."
          className="w-full bg-transparent border-b py-2 outline-none transition-colors resize-none"
          style={{ borderColor: c.inputBorder, color: c.inputText }}
          onFocus={(e) => (e.currentTarget.style.borderColor = c.accent)}
          onBlur={(e) => (e.currentTarget.style.borderColor = c.inputBorder)}
        />
      </FormField>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="font-mono text-xs uppercase tracking-widest px-8 py-3 transition-colors disabled:opacity-50"
          style={{ background: c.accent, color: "#000" }}
        >
          {submitting ? "Sending..." : "Submit Enquiry"}
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  labelColor,
  children,
}: {
  label: string
  labelColor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="font-mono text-[10px] tracking-widest uppercase mb-2 block"
        style={{ color: labelColor }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

interface ColorPalette {
  label: string
  inputText: string
  inputBorder: string
  divider: string
  chipBorder: string
  chipText: string
  errorBg: string
  accent: string
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  colors,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  colors: ColorPalette
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent border-b py-2 outline-none transition-colors"
      style={{ borderColor: colors.inputBorder, color: colors.inputText }}
      onFocus={(e) => (e.currentTarget.style.borderColor = colors.accent)}
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = colors.inputBorder)
      }
    />
  )
}

function Divider({ color }: { color: string }) {
  return (
    <div className="border-t border-dotted" style={{ borderColor: color }} />
  )
}