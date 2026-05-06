import { getToken } from '../services/auth'
import { API_URL } from './config'

export { API_URL }

export async function apiFetch<T>(
  path: string,
  options?: { method?: string; body?: unknown | FormData }
): Promise<T> {
  const token = await getToken()
  const isFormData = options?.body instanceof FormData
  const hasBody = options?.body !== undefined
  const res = await fetch(`${API_URL}${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    },
    body: isFormData
      ? (options!.body as FormData)
      : hasBody
        ? JSON.stringify(options!.body)
        : undefined,
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status} sur ${path}: ${body}`)
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }
  return res.json()
}
