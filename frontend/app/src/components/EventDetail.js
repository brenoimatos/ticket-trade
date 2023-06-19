import { useLoaderData } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import api from '../api'

export async function loader({ params }) {
  return {
    event: await api.getEventById(params.eventId),
  }
}

function EventDetail() {
  const { event } = useLoaderData()

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTicketURL = (url) => {
    if (!url.startsWith('http')) {
      url = `http://${url}`
    }
    return url
  }

  return (
    <div>
      <div className="event-detail-card">
        <h2>{event.name}</h2>
        <div className="event-details">
          <div className="event-detail-date">📅 {formatDate(event.date)}</div>
          <div className="event-detail-location">📍 {event.location}</div>
        </div>
        <a
          href={formatTicketURL(event.ticket_url)}
          className="ticket-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bilheteria Oficial
        </a>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default EventDetail
