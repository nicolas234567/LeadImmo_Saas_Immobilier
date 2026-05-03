import { apiFetch } from '../constants/api'
import { API_URL } from '../constants/config'
import { getToken } from './auth'
import type { Account } from '../types/account'

export async function getAccounts(): Promise<Account[]> {
  return apiFetch<Account[]>('/accounts')
}

export async function createAgencyAccount(email: string, password: string): Promise<void> {
  const token = await getToken()
  const res = await fetch(`${API_URL}/auth/createAccountAgency`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email, password }),
  })
  const text = await res.text()
  let data: any = {}
  try { data = JSON.parse(text) } catch { throw new Error(`Erreur serveur (${res.status})`) }
  if (!res.ok) throw new Error(data.error ?? 'Erreur lors de la création du compte')
}

export async function updateAccount(id: string, email: string): Promise<Account> {
  return apiFetch<Account>(`/accounts/${id}`, { method: 'PATCH', body: { email } })
}

export async function deleteAccount(id: string): Promise<void> {
  await apiFetch<unknown>(`/accounts/${id}`, { method: 'DELETE' })
}
