import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../api/apiConfig';


function EventDetail() {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams();

  useEffect(() => {
    fetch(`${BASE_URL}/events/?event_id=${eventId}`)
      .then(res => res.json())
      .then(data => setEvent(data[0]))
      .catch(err => console.error(err));
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTicketURL = (url) => {
    if (!url.startsWith('http')) {
      url = `http://${url}`;
    }
    return url;
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-detail-card">
      <h2>{event.name}</h2>
      <div className="event-details">
        <div className="event-detail-date">📅 {formatDate(event.date)}</div>
        <div className="event-detail-location">📍 {event.location}</div>
      </div>
      <a href={formatTicketURL(event.ticket_url)} className="ticket-link" target="_blank" rel="noopener noreferrer">Bilheteria Oficial</a>
      
    </div>
  );
}

export default EventDetail;
