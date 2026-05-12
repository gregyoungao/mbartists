'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

export default function AgentRowActions({
  agentId,
  agentName,
}: {
  agentId: string
  agentName: string
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const res = await fetch('/api/admin/delete-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      alert(json.error || 'Could not delete agent')
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/agents/${agentId}/edit`}
        className="font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#4E7DFE] hover:text-[#4E7DFE]"
        style={{ borderColor: '#222', color: '#888' }}
      >
        Edit
      </Link>
      <ConfirmDeleteModal
        title={`Delete ${agentName}?`}
        message="This will permanently remove the agent and their login. Their artists will become orphaned (no agent assigned). This cannot be undone."
        onConfirm={handleDelete}
        trigger={(open) => (
          <button
            onClick={open}
            className="font-mono text-xs uppercase tracking-widest px-3 py-2 border transition-colors hover:border-[#ff4444] hover:text-[#ff4444]"
            style={{ borderColor: '#222', color: '#666' }}
          >
            Delete
          </button>
        )}
      />
    </div>
  )
}
