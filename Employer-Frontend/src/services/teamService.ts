import { mockResolve } from '../lib/api'
import { TEAM } from '../data/mock'
import type { TeamMember, TeamRole } from '../types'
import { initialsOf } from '../lib/utils'

const store: TeamMember[] = [...TEAM]
let seq = store.length + 1

export function listTeam() {
  return mockResolve([...store])
}

export function inviteMember(input: { name: string; email: string; role: TeamRole }) {
  const member: TeamMember = {
    id: `TM-${seq++}`,
    name: input.name,
    initials: initialsOf(input.name),
    role: input.role,
    email: input.email,
    status: 'invited',
    lastActive: 'Never',
    joinedOn: new Date().toISOString().slice(0, 10),
  }
  store.unshift(member)
  return mockResolve(member, 550)
}

export function updateMemberRole(id: string, role: TeamRole) {
  const idx = store.findIndex((m) => m.id === id)
  if (idx === -1) return mockResolve(null)
  store[idx] = { ...store[idx]!, role }
  return mockResolve(store[idx], 350)
}

export function removeMember(id: string) {
  const idx = store.findIndex((m) => m.id === id)
  if (idx !== -1) store.splice(idx, 1)
  return mockResolve(true, 400)
}
