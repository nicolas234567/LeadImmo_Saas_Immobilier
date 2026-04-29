import { apiFetch } from '../constants/api'
import type { Lead } from '../types/lead'

export function getLeads(): Promise<Lead[]> {
  return apiFetch<Lead[]>('/leads')
}

export function getLead(id: string): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${id}`)
}

export function createLead(data: {
  property_id: string | null
  name: string
  email: string
  phone: string
  status: string
  budget?: number
  notes?: string
}): Promise<Lead> {
  return apiFetch<Lead>('/leads', { method: 'POST', body: data })
}

export function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${id}`, { method: 'PATCH', body: data })
}

export function deleteLead(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/leads/${id}`, { method: 'DELETE' })
}
