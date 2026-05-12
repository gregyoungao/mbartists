// =========================================================
// Auth helpers for server components and route handlers.
//
// Role hierarchy:
//   - 'admin'  : has a row in `admins`
//   - 'agent'  : has a row in `agents` with matching auth_user_id
//   - 'none'   : authenticated but no role (shouldn't happen, but handled)
//   - null     : not logged in
//
// Use:
//   getCurrentUser()    -> Supabase auth user or null
//   getCurrentRole()    -> 'admin' | 'agent' | 'none' | null
//   requireAdmin()      -> redirects to /login or /no-access if not admin
//   requireAgent()      -> redirects if not agent
//   requireAuthenticated() -> redirects if not logged in
// =========================================================

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './supabase-server'

export type Role = 'admin' | 'agent' | 'none' | null

export interface CurrentUser {
  id: string
  email: string
  role: Role
  // If role === 'agent', this is their agent record id
  agentId?: string
  agentName?: string
  // If role === 'admin', this is their admin record id
  adminId?: string
}

/**
 * Returns the current user with role, or null if not logged in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Check if they're an admin
  const { data: adminRow } = await supabase
    .from('admins')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (adminRow) {
    return {
      id: user.id,
      email: user.email || '',
      role: 'admin',
      adminId: adminRow.id,
    }
  }

  // Check if they're an agent
  const { data: agentRow } = await supabase
    .from('agents')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (agentRow) {
    return {
      id: user.id,
      email: user.email || '',
      role: 'agent',
      agentId: agentRow.id,
      agentName: agentRow.name,
    }
  }

  // Authenticated but no role — shouldn't happen normally
  return {
    id: user.id,
    email: user.email || '',
    role: 'none',
  }
}

/**
 * Redirects to /login if not authenticated.
 * Redirects to /no-access if authenticated but has no role.
 * Returns the current user otherwise.
 */
export async function requireAuthenticated(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role === 'none') redirect('/no-access')
  return user
}

/**
 * Redirects unless user is an admin.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireAuthenticated()
  if (user.role !== 'admin') redirect('/no-access')
  return user
}

/**
 * Redirects unless user is an agent.
 */
export async function requireAgent(): Promise<CurrentUser> {
  const user = await requireAuthenticated()
  if (user.role !== 'agent') redirect('/no-access')
  return user
}

/**
 * Returns true if the current user can edit a given artist.
 * (admin OR primary agent OR secondary agent)
 */
export async function canEditArtist(artistId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role !== 'agent' || !user.agentId) return false

  const supabase = await createSupabaseServerClient()
  const { data: artist } = await supabase
    .from('artists')
    .select('primary_agent_id, secondary_agent_id')
    .eq('id', artistId)
    .maybeSingle()

  if (!artist) return false
  return (
    artist.primary_agent_id === user.agentId ||
    artist.secondary_agent_id === user.agentId
  )
}
