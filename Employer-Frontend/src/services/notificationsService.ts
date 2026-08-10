import { mockResolve } from '../lib/api'
import { NOTIFICATIONS } from '../data/mock'
import type { AppNotification } from '../types'

const store: AppNotification[] = [...NOTIFICATIONS]

export function listNotifications() {
  return mockResolve([...store])
}

export function markAsRead(id: string) {
  const idx = store.findIndex((n) => n.id === id)
  if (idx !== -1) store[idx] = { ...store[idx]!, unread: false }
  return mockResolve(true, 200)
}

export function markAllRead() {
  for (let i = 0; i < store.length; i++) store[i] = { ...store[i]!, unread: false }
  return mockResolve(true, 300)
}
