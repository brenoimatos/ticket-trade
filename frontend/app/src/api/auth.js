import queryString from 'query-string'
import { redirect } from 'react-router-dom'
import { validateUser } from './users'

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
  return null
}

export const logout = async () => {
  const res = await fetch(`${apiBaseURL}auth/jwt/logout`, {
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

export async function requireAuth(request) {
  const pathname = new URL(request.url).pathname
  const isUserValid = await validateUser()
  console.log('isUserValid', isUserValid)
  if (!isUserValid) {
    throw redirect(
      `/login?message=Você precisa estar logado para acessar esta página.&redirectTo=${pathname}`
    )
  }
  return null
}
