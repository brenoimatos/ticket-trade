import { apiBaseUrl } from './apiConfig'

export async function getTickets(eventId) {
  return fetch(`${apiBaseUrl}/tickets/info?event_id=${eventId}`)
    .then((res) => res.json())
    .catch((err) => console.error(err))
}

export async function getTicketById(ticketId) {
  return fetch(`${apiBaseUrl}/tickets/info?ticket_id=${ticketId}`)
    .then((res) => res.json())
    .then((data) => data[0])
    .catch((err) => console.error(err))
}

export async function createTicket(ticket) {
  const res = await fetch(`${apiBaseUrl}/tickets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticket),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    let error = new Error(
      JSON.stringify(data.detail) ||
        'An error occurred while creating the ticket.'
    )
    error.statusText = res.statusText
    error.status = res.status
    throw error
  }
  return data
}

export const deleteTicket = async (id) => {
  try {
    const response = await fetch(`${apiBaseUrl}/tickets/${id}`, {
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

export async function getDashTicketsStats() {
  return fetch(`${apiBaseUrl}/tickets/dash/stats`, { credentials: 'include' })
    .then((res) => res.json())
    .catch((err) => console.error(err))
}
