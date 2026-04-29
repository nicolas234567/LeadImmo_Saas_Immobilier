import { apiFetch } from '../constants/api'
import type { Property } from '../types/property'

export function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>('/properties')
}

export function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`)
}

export function createProperty(
  data: { title: string; address: string; price: number; status: string },
  image?: { uri: string; mimeType: string; fileName: string }
): Promise<Property> {
  if (image) {
    const form = new FormData()
    form.append('title',   data.title)
    form.append('address', data.address)
    form.append('price',   String(data.price))
    form.append('status',  data.status)
    form.append('image', { uri: image.uri, type: image.mimeType, name: image.fileName } as unknown as Blob)
    return apiFetch<Property>('/properties', { method: 'POST', body: form })
  }
  return apiFetch<Property>('/properties', { method: 'POST', body: data })
}

export function updateProperty(
  id: string,
  data: { title: string; address: string; price: number; status: string },
  image?: { uri: string; mimeType: string; fileName: string }
): Promise<Property> {
  if (image) {
    const form = new FormData()
    form.append('title',   data.title)
    form.append('address', data.address)
    form.append('price',   String(data.price))
    form.append('status',  data.status)
    form.append('image', { uri: image.uri, type: image.mimeType, name: image.fileName } as unknown as Blob)
    return apiFetch<Property>(`/properties/${id}`, { method: 'PATCH', body: form })
  }
  return apiFetch<Property>(`/properties/${id}`, { method: 'PATCH', body: data })
}

export function deleteProperty(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/properties/${id}`, { method: 'DELETE' })
}
