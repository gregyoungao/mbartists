"use client"

import { useState } from "react"

interface ArtistOption {
  id: string
  name: string
}

interface Props {
  artists: ArtistOption[]
  // When set, the artist is pre-selected and locked (used on artist detail pages)
  lockedArtistId?: string
  lockedArtistName?: string
}

export default function EnquiryForm({
  artists,
  lockedArtistId,
  lockedArtistName,
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
          borderColor: "#4E7DFE",
          background: "rgba(78, 125, 254, 0.08)",
        }}
      >
        <p
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: "#4E7DFE" }}
        >
          {"// Enquiry Sent"}
        </p>
        <h3 className="text-2xl font-bold mb-2">Thank you</h3>
        <p style={{ color: "#888" }}>
          Your enquiry has been received. The artist's agent will be in touch
          with you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p
        className="font-mono text-xs tracking-widest uppercase"
        style={{ color: "#4E7DFE" }}
      >
        Your Enquiry
      </p>

      {error && (
        <div
          className="p-4 border"
          style={{ borderColor: "#ff4444", background: "#1a0000" }}
        >
          <p className="font-mono text-sm" style={{ color: "#ff6666" }}>
            {error}
          </p>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Name *">
          <TextInput value={name} onChange={setName} placeholder="Joe Bloggs" required />
        </FormField>
        <FormField label="Email *">
          <TextInput
            value={email}
            onChange={setEmail}
            placeholder="joe@acmecorp.com"
            type="email"
            required
          />
        </FormField>
      </div>

      {/* Company + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name *">
          <TextInput
            value={organization}
            onChange={setOrganization}
            placeholder="Acme Corp"
            required
          />
        </FormField>
        <FormField label="Location *">
          <TextInput
            value={eventLocation}
            onChange={setEventLocation}
            placeholder="London, United Kingdom"
            required
          />
        </FormField>
      </div>

      <Divider />

      {/* Select Acts — single artist */}
      <FormField label="Select Act *">
        {lockedArtistId ? (
          <div
            className="inline-block font-mono text-xs px-4 py-2 border"
            style={{
              borderColor: "#4E7DFE",
              background: "#4E7DFE",
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
                    borderColor: active ? "#4E7DFE" : "#222",
                    background: active ? "#4E7DFE" : "transparent",
                    color: active ? "#000" : "#666",
                  }}
                >
                  {artist.name}
                </button>
              )
            })}
            {artists.length === 0 && (
              <p className="font-mono text-xs" style={{ color: "#444" }}>
                No artists available.
              </p>
            )}
          </div>
        )}
      </FormField>

      <Divider />

      {/* Event Name + Proposed Offer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Event Name">
          <TextInput
            value={eventName}
            onChange={setEventName}
            placeholder="ABC Events"
          />
        </FormField>
        <FormField label="Proposed Offer">
          <TextInput
            value={proposedOffer}
            onChange={setProposedOffer}
            placeholder="£000.00"
          />
        </FormField>
      </div>

      {/* Ticket Price + Event Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Ticket Price">
          <TextInput
            value={ticketPrice}
            onChange={setTicketPrice}
            placeholder="£00.00"
          />
        </FormField>
        <FormField label="Event Date">
          <TextInput
            value={eventDate}
            onChange={setEventDate}
            type="date"
          />
        </FormField>
      </div>

      {/* Message */}
      <FormField label="Your Message *">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Tell us more..."
          className="w-full bg-transparent border-b py-2 outline-none transition-colors resize-none"
          style={{ borderColor: "#222", color: "#fff" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#4E7DFE")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
        />
      </FormField>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="font-mono text-xs uppercase tracking-widest px-8 py-3 transition-colors disabled:opacity-50"
          style={{ background: "#4E7DFE", color: "#000" }}
        >
          {submitting ? "Sending..." : "Submit Enquiry"}
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="font-mono text-[10px] tracking-widest uppercase mb-2 block"
        style={{ color: "#888" }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent border-b py-2 outline-none transition-colors"
      style={{ borderColor: "#222", color: "#fff" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#4E7DFE")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
    />
  )
}

function Divider() {
  return (
    <div
      className="border-t border-dotted"
      style={{ borderColor: "#333" }}
    />
  )
}
