// =========================================================
// Role definitions, labels, and sorting for agents
// =========================================================

export const AGENT_ROLES = [
  { value: 'managing_director', label: 'Managing Director', order: 1 },
  { value: 'academy_director', label: 'Academy Director', order: 2 },
  { value: 'senior_agent', label: 'Senior Agent', order: 3 },
  { value: 'agent', label: 'Agent', order: 4 },
  { value: 'senior_coordinator', label: 'Senior Coordinator', order: 5 },
  { value: 'coordinator', label: 'Coordinator', order: 6 },
  { value: 'senior_assistant', label: 'Senior Assistant', order: 7 },
  { value: 'assistant', label: 'Assistant', order: 8 },
] as const

export type AgentRoleValue = (typeof AGENT_ROLES)[number]['value']

export function getRoleLabel(value: string | null | undefined): string {
  if (!value) return '—'
  const found = AGENT_ROLES.find((r) => r.value === value)
  return found ? found.label : value
}

/**
 * Compute the canonical role_order for a given role string.
 *
 * role_order is a denormalized column on the agents table — it has to stay
 * in sync with the `role` column or the /agents page will show people in
 * the wrong group. ALWAYS call this whenever you write to `agents.role`,
 * and include the result in the same insert/update payload.
 *
 * Returns null when role is null/empty/unknown so the DB stays consistent.
 */
export function getRoleOrder(value: string | null | undefined): number | null {
  if (!value) return null
  const found = AGENT_ROLES.find((r) => r.value === value)
  return found ? found.order : null
}