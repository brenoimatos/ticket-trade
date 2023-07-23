import { apiBaseUrl } from './apiConfig'

export async function getEventById(eventId) {
  return fetch(`${apiBaseUrl}/events/?event_id=${eventId}`)
    .then((res) => res.json())
    .then((data) => data[0])
    .catch((err) => console.error(err))
}

export async function createEvent(eventData) {
  const res = await fetch(`${apiBaseUrl}/events/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(
      JSON.stringify({
        message: data.detail,
        statusText: res.statusText,
        status: res.status,
      })
    )
  }
  return data
}

export async function getEvents(debouncedSearchTerm, setSearchResults) {
  fetch(
    `${apiBaseUrl}/events/?search=${debouncedSearchTerm}&sort=["date", "ASC"]&range=[0, 5]`
  )
    .then((res) => res.json())
    .then((data) => setSearchResults(data))
    .catch((err) => console.error(err))
}
