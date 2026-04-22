export type PropertyStatus = 'available' | 'under_offer' | 'sold'

export interface Property {
  id: string
  title: string
  address: string
  price: number
  status: PropertyStatus
  leadsCount: number
  image?: any
  surface?: number
  rooms?: number
  description?: string
  type?: string
}
