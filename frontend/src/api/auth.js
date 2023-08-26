import queryString from 'query-string'
import { redirect } from 'react-router-dom'
import { validateSuperUser, validateUser } from './users'
import { apiBaseUrl } from './apiConfig'

export const login = async (username, password) => {
  const res = await fetch(`${apiBaseUrl}/auth/jwt/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString.stringify({ username, password }),
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(
      JSON.stringify({
        message: data.detail,
        statusText: res.statusText,
        status: res.status,
      })
    )
  }
  return null
}

export const logout = async () => {
  const res = await fetch(`${apiBaseUrl}/auth/jwt/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  return res
}

export const register = async (
  email,
  password,
  first_name,
  last_name,
  raw_phone
) => {
  const phone = Number(raw_phone.replace(/\D/g, ''))
  const res = await fetch(`${apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      first_name,
      last_name,
      phone,
    }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(
      JSON.stringify({
        message: data.detail,
        statusText: res.statusText,
        status: res.status,
      })
    )
  }

  return console.log('Registered')
}

export const forgotPassword = async (email) => {
  const res = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return res
}

export const resetPassword = async (password, token) => {
  const res = await fetch(`${apiBaseUrl}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  })
  return res
}

export async function requireAuth(request) {
  const pathname = new URL(request.url).pathname
  const isUserValid = await validateUser()
  if (!isUserValid) {
    throw redirect(
      `/login?message=Você precisa estar logado para acessar esta página.&redirectTo=${pathname}`
    )
  }
  return null
}

export async function requireSuperAuth(request) {
  const pathname = new URL(request.url).pathname
  const isUserValid = await validateSuperUser()
  if (!isUserValid) {
    throw redirect(
      `/login?message=Você precisa estar logado como admin para acessar esta página.&redirectTo=${pathname}`
    )
  }
  return null
}
