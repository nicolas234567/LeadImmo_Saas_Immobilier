import { mockPropertiesDetail } from '../constants/mockData'
import type { Property } from '../types/property'

// Pour passer à une vraie API : remplacer le corps de chaque fonction
// par un appel fetch, ex: return fetch('/api/properties').then(r => r.json())

export function getProperties(): Property[] {
  return mockPropertiesDetail
}

export function getProperty(id: string): Property | undefined {
  return mockPropertiesDetail.find(p => p.id === id)
}
