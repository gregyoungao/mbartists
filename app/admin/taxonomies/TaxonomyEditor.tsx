'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TaxItem {
  id: string
  slug: string
  name: string
}

export default function TaxonomyEditor({
  title,
  taxonomy,
  items,
}: {
  title: string
  taxonomy: 'genres' | 'locations'
  items: TaxItem[]
}) {
  const router = useRouter()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const call = async (action: string, body: any) => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/manage-taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taxonomy, action, ...body }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await call('create', { name: newName.trim() })
    setNewName('')
  }

  const handleSave = async (id: string) => {
    if (!editingName.trim()) return
    await call('update', { id, name: editingName.trim() })
    setEditingId(null)
    setEditingName('')
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Artists using this tag will lose it.`)) return
    await call('delete', { id })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {error && (
        <div className="p-3 border mb-4" style={{ borderColor: '#ff4444', background: '#1a0000' }}>
          <p className="font-mono text-xs" style={{ color: '#ff6666' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${title.toLowerCase().slice(0, -1)}...`}
          className="flex-1 bg-transparent border p-3 font-mono text-sm outline-none"
          style={{ borderColor: '#222', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={busy || !newName.trim()}
          className="font-mono text-xs uppercase tracking-widest px-6 transition-colors disabled:opacity-50"
          style={{ background: '#4E7DFE', color: '#000' }}
        >
          Add
        </button>
      </form>

      <div className="border" style={{ borderColor: '#1a1a1a' }}>
        {items.length === 0 ? (
          <p className="p-6 font-mono text-xs text-center" style={{ color: '#666' }}>
            No {title.toLowerCase()} yet.
          </p>
        ) : (
          items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-3 border-b"
              style={{
                borderColor: i === items.length - 1 ? 'transparent' : '#1a1a1a',
              }}
            >
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-transparent border p-2 font-mono text-sm outline-none"
                    style={{ borderColor: '#4E7DFE', color: '#fff' }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(item.id)}
                    disabled={busy}
                    className="font-mono text-xs uppercase tracking-widest px-3 py-2"
                    style={{ background: '#4E7DFE', color: '#000' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditingName('')
                    }}
                    className="font-mono text-xs uppercase tracking-widest px-3 py-2 border"
                    style={{ borderColor: '#444', color: '#888' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="font-mono text-[10px]" style={{ color: '#444' }}>
                      {item.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(item.id)
                      setEditingName(item.name)
                    }}
                    className="font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
                    style={{ borderColor: '#222', color: '#888' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={busy}
                    className="font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#ff4444] hover:text-[#ff4444] disabled:opacity-50"
                    style={{ borderColor: '#222', color: '#666' }}
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
