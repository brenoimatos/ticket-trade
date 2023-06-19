import React from 'react'
import { Link } from 'react-router-dom'

function EventList({ events }) {
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}/tickets`}
          className="event-link"
        >
          <div className="event-card">
            <div className="event-date">
              <span className="date-icon">📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
            <h4>{event.name}</h4>
            <h5 className="event-location">📍 {event.location}</h5>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default EventList
