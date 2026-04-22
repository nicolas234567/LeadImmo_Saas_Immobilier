import { mockLeads } from '../constants/mockData'
import type { Lead } from '../types/lead'

// Pour passer à une vraie API : remplacer le corps de chaque fonction
// par un appel fetch, ex: return fetch('/api/leads').then(r => r.json())

export function getLeads(): Lead[] {
  return mockLeads
}

export function getLead(id: string): Lead | undefined {
  return mockLeads.find(l => l.id === id)
}
