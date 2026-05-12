// =========================================================
// Role definitions, labels, and sorting for agents
// =========================================================

export const AGENT_ROLES = [
  { value: 'managing_director', label: 'Managing Director', order: 1 },
  { value: 'academy_director', label: 'Academy Director', order: 2 },
  { value: 'senior_agent', label: 'Senior Agent', order: 3 },
  { value: 'senior_coordinator', label: 'Senior Coordinator', order: 4 },
  { value: 'agent', label: 'Agent', order: 5 },
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
