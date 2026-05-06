import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { API_URL } from '../constants/config'

const TOKEN_KEY = 'auth_token'

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const text = await res.text()
  let data: any = {}
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Erreur serveur (${res.status})`)
  }

  if (!res.ok) {
    throw new Error(data.error ?? 'Erreur de connexion')
  }

  await deleteToken()
  await saveToken(data.token)

  return data.token
}

export async function register(email: string, password: string, agencyName: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/createAccountAgency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, agency_name: agencyName }),
  })

  const text = await res.text()
  let data: any = {}
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Erreur serveur (${res.status})`)
  }

  if (!res.ok) {
    throw new Error(data.error ?? 'Erreur lors de la création du compte')
  }
}

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
  }
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return sessionStorage.getItem(TOKEN_KEY)
  }
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function deleteToken(): Promise<void> {
  if (Platform.OS === 'web') {
    sessionStorage.removeItem(TOKEN_KEY)
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  }
}
