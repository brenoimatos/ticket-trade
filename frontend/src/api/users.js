import { apiBaseUrl } from './apiConfig'

export const getUserById = async (id) => {
  const res = await fetch(`${apiBaseUrl}/users/${id}`)
  return await res.json()
}

export const getMyUser = async () => {
  const res = await fetch(`${apiBaseUrl}/users/me`, { credentials: 'include' })
  return res.json()
}

const transformPhone = (phone) => {
  // Check if phone is a string before applying replace function
  return typeof phone === 'string' ? Number(phone.replace(/\D/g, '')) : phone
}

export const updateMyUser = async (userData) => {
  // Transforms the phone number
  const transformedData = {
    ...userData,
    phone: transformPhone(userData.phone),
  }

  const res = await fetch(`${apiBaseUrl}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData),
  })

  return res.json()
}

export async function validateUser() {
  return fetch(`${apiBaseUrl}/users/validate`, {
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

export async function validateSuperUser() {
  return fetch(`${apiBaseUrl}/users/validate/super-user`, {
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
  const res = await fetch(`${apiBaseUrl}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
  return await res.json()
}

export const deleteUser = async (id) => {
  const res = await fetch(`${apiBaseUrl}/users/${id}`, {
    method: 'DELETE',
  })
  return await res.json()
}

export async function getDashUsersStats() {
  return fetch(`${apiBaseUrl}/users/dash/stats`, { credentials: 'include' })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export async function getDashUsers(skip, limit) {
  return fetch(`${apiBaseUrl}/users/dash?skip=${skip}&limit=${limit}`, {
    credentials: 'include',
  })
    .then(async (res) => {
      const totalCount = res.headers.get('Content-Range') // Extract total count from the headers
      const data = await res.json()
      return { data, totalCount: parseInt(totalCount.split('/')[1], 10) } // Extract and return both data and totalCount
    })
    .catch((err) => console.error(err))
}
