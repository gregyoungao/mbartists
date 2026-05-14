"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface EnquiryData {
  id: string
  name: string
  email: string
  organization: string | null
  event_location: string | null
  event_name: string | null
  proposed_offer: string | null
  ticket_price: string | null
  event_date: string | null
  message: string
  status: string
  created_at: string
  artistName: string
  agentName?: string | null
}

export default function EnquiryCard({ enquiry }: { enquiry: EnquiryData }) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isHandled = enquiry.status === "handled"

  const toggleStatus = async () => {
    setUpdating(true)
    try {
      const res = await fetch("/api/enquiries/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: enquiry.id,
          status: isHandled ? "new" : "handled",
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        alert(json.error || "Could not update status")
        return
      }
      router.refresh()
    } finally {
      setUpdating(false)
    }
  }

  const formattedDate = new Date(enquiry.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const eventDateFormatted = enquiry.event_date
    ? new Date(enquiry.event_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  // Build a mailto reply link
  const mailtoSubject = encodeURIComponent(
    `Re: Booking enquiry for ${enquiry.artistName}`
  )
  const mailtoBody = encodeURIComponent(
    `Hi ${enquiry.name},\n\nThank you for your enquiry regarding ${enquiry.artistName}.\n\n`
  )
  const mailtoLink = `mailto:${enquiry.email}?subject=${mailtoSubject}&body=${mailtoBody}`

  return (
    <div
      className="border transition-colors"
      style={{
        borderColor: isHandled ? "#1a1a1a" : "#2a3f6f",
        background: isHandled ? "#080808" : "#0a0d18",
      }}
    >
      {/* Header row — always visible */}
      <div
        className="p-5 cursor-pointer flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {!isHandled && (
              <span
                className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5"
                style={{ background: "#4E7DFE", color: "#000" }}
              >
                New
              </span>
            )}
            <h3 className="font-bold text-lg truncate">{enquiry.name}</h3>
          </div>
          <p className="font-mono text-xs" style={{ color: "#888" }}>
            {enquiry.artistName}
            {enquiry.organization && ` · ${enquiry.organization}`}
            {" · "}
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="font-mono text-xs transition-transform"
            style={{
              color: "#666",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            {">"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-5 pb-5 space-y-4 border-t"
          style={{ borderColor: "#1a1a1a" }}
        >
          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            <DetailItem label="Email" value={enquiry.email} />
            <DetailItem label="Company" value={enquiry.organization} />
            <DetailItem label="Location" value={enquiry.event_location} />
            <DetailItem label="Event Name" value={enquiry.event_name} />
            <DetailItem label="Event Date" value={eventDateFormatted} />
            <DetailItem label="Proposed Offer" value={enquiry.proposed_offer} />
            <DetailItem label="Ticket Price" value={enquiry.ticket_price} />
            {enquiry.agentName && (
              <DetailItem label="Agent" value={enquiry.agentName} />
            )}
          </div>

          {/* Message */}
          <div>
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2"
              style={{ color: "#4E7DFE" }}
            >
              Message
            </p>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "#aaa" }}
            >
              {enquiry.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={mailtoLink}
              className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 transition-colors"
              style={{ background: "#4E7DFE", color: "#000" }}
            >
              Reply by Email
            </a>
            <button
              onClick={toggleStatus}
              disabled={updating}
              className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 border transition-colors disabled:opacity-50 hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
              style={{ borderColor: "#333", color: "#888" }}
            >
              {updating
                ? "Updating..."
                : isHandled
                ? "Mark as New"
                : "Mark as Handled"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div>
      <p
        className="font-mono text-[10px] tracking-widest uppercase mb-1"
        style={{ color: "#555" }}
      >
        {label}
      </p>
      <p className="text-sm" style={{ color: value ? "#ccc" : "#444" }}>
        {value || "—"}
      </p>
    </div>
  )
}
