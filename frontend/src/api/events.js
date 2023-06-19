import { BASE_URL } from '../api/apiConfig'

export async function getEventById(eventId) {
  return fetch(`${BASE_URL}/events/?event_id=${eventId}`)
    .then((res) => res.json())
    .then((data) => data[0])
    .catch((err) => console.error(err))
}

export async function createEvent(eventData) {
  const res = await fetch(`${BASE_URL}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) {
    throw {
      message: data.detail,
      statusText: res.statusText,
      status: res.status,
    }
  }
  return data
}
