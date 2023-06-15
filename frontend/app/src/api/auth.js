import queryString from 'query-string'
import { redirect } from 'react-router-dom'

const apiBaseURL = 'http://localhost:9000/api/v1/'

export const login = async (username, password) => {
  const res = await fetch(`${apiBaseURL}auth/jwt/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryString.stringify({ username, password }),
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json()
    throw {
      message: data.detail,
      statusText: res.statusText,
      status: res.status,
    }
  }
  return console.log('Logged on')
}

export const logout = () => {
  return fetch(`${apiBaseURL}auth/jwt/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json())
}

export const register = async (
  email,
  password,
  first_name,
  last_name,
  raw_phone
) => {
  const phone = Number(raw_phone.replace(/\D/g, ''))
  console.log(email, password, first_name, last_name, phone)
  const res = await fetch(`${apiBaseURL}auth/register`, {
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
    throw {
      message: data.detail,
      statusText: res.statusText,
      status: res.status,
    }
  }

  return console.log('Registered')
}

export async function getCookieAuth() {
  const cookie = document.cookie
    .split('; ')
    .filter((row) => row.startsWith('cookie-ticket='))
    .map((c) => c.split('=')[1])[0]
  return cookie
}

export async function requireAuth(request) {
  const pathname = new URL(request.url).pathname
  const cookieAuth = getCookieAuth()
  if (!cookieAuth) {
    throw redirect(
      `/login?message=You must log in first.&redirectTo=${pathname}`
    )
  }
  return null
}

export async function requireAuthCookie() {
  const cookieAuth = getCookieAuth()
  return cookieAuth
}
