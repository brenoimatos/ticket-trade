import { apiBaseUrl } from "./apiConfig"

export const getUserById = async (id) => {
  const res = await fetch(`${apiBaseUrl}users/${id}`)
  return await res.json()
}

export const getMyUser = async () => {
  const res = await fetch(`${apiBaseUrl}users/me`, { credentials: 'include' })
  return res.json()
}

export async function validateUser() {
  return fetch(`${apiBaseUrl}users/validate`, {
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`)
      }
      return res.json()
    })
    .catch((err) => false)
}

export const updateUser = async (id, user) => {
  const res = await fetch(`${apiBaseUrl}users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  return await res.json()
}

export const deleteUser = async (id) => {
  const res = await fetch(`${apiBaseUrl}users/${id}`, {
    method: 'DELETE',
  })
  return await res.json()
}
