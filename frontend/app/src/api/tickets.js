import { BASE_URL } from '../api/apiConfig'

export async function getTickets(eventId) {
  return fetch(`${BASE_URL}/tickets/info?event_id=${eventId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export async function createTicket(event_id, price, is_for_sale) {
  const res = await fetch(`${BASE_URL}/tickets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_id, price, is_for_sale }),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    throw {
      message: data.detail || 'An error occurred while creating the ticket.',
      statusText: res.statusText,
      status: res.status,
    }
  }
  return data
}

export const deleteTicket = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json() // ou apenas "return response;" se sua API não retornar JSON
  } catch (error) {
    console.error(error)
  }
}
