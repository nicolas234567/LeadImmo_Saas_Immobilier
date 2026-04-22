export type LeadStatus = 'nouveau' | 'En contact' | 'visite' | 'offre'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: LeadStatus
  propertyId: string
  propertyTitle: string
  createdAt: string
  budget?: number
  source?: string
  notes?: string
  visitDate?: string
}
