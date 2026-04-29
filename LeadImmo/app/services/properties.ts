import { Platform } from 'react-native'
import { apiFetch } from '../constants/api'
import type { Property } from '../types/property'

type ImageInput = { uri: string; mimeType: string; fileName: string }

function dataURItoBlob(uri: string): Blob {
  const [header, data] = uri.split(',')
  const mime = header.match(/:(.*?);/)![1]
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

async function appendImage(form: FormData, image: ImageInput) {
  if (Platform.OS === 'web') {
    const blob = image.uri.startsWith('data:')
      ? dataURItoBlob(image.uri)
      : await fetch(image.uri).then(r => r.blob())
    form.append('image', blob, image.fileName)
  } else {
    form.append('image', { uri: image.uri, type: image.mimeType, name: image.fileName } as unknown as Blob)
  }
}

export function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>('/properties')
}

export function getProperty(id: string): Promise<Property> {
  return apiFetch<Property>(`/properties/${id}`)
}

export async function createProperty(
  data: { title: string; address: string; price: number; status: string },
  image?: ImageInput
): Promise<Property> {
  if (image) {
    const form = new FormData()
    form.append('title',   data.title)
    form.append('address', data.address)
    form.append('price',   String(data.price))
    form.append('status',  data.status)
    await appendImage(form, image)
    return apiFetch<Property>('/properties', { method: 'POST', body: form })
  }
  return apiFetch<Property>('/properties', { method: 'POST', body: data })
}

export async function updateProperty(
  id: string,
  data: { title: string; address: string; price: number; status: string },
  image?: ImageInput
): Promise<Property> {
  if (image) {
    const form = new FormData()
    form.append('title',   data.title)
    form.append('address', data.address)
    form.append('price',   String(data.price))
    form.append('status',  data.status)
    await appendImage(form, image)
    return apiFetch<Property>(`/properties/${id}`, { method: 'PATCH', body: form })
  }
  return apiFetch<Property>(`/properties/${id}`, { method: 'PATCH', body: data })
}

export function deleteProperty(id: string): Promise<unknown> {
  return apiFetch<unknown>(`/properties/${id}`, { method: 'DELETE' })
}
