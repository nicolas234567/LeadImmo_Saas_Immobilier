export type LeadStatus = 'new' | 'contacted' | 'visiting' | 'offer'

export interface Lead {
  id: string
  agency_id: string
  property_id: string
  property_title?: string
  name: string
  email: string
  phone: string
  status: LeadStatus
  created_at: string
  budget?: number
  source?: string
  notes?: string
  visit_date?: string
}

export const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new',       label: 'Nouveau'    },
  { value: 'contacted', label: 'En contact' },
  { value: 'visiting',  label: 'Visite'     },
  { value: 'offer',     label: 'Offre'      },
]
