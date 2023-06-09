import React, { useState } from 'react';
import { BASE_URL } from '../api/apiConfig';
import { Link } from 'react-router-dom';

function EventCreate() {
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    date: '',
    ticket_url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/events/${data.id}`;
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="event-create-container">
      <h2>Adicionar novo evento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome:</label>
          <input type="text" name="name" value={eventData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="location">Local:</label>
          <input type="text" name="location" value={eventData.location} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="date">Data:</label>
          <input type="datetime-local" name="date" value={eventData.date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="ticket_url">Link da bilheteria oficial:</label>
          <input type="text" name="ticket_url" value={eventData.ticket_url} onChange={handleChange} required />
        </div>
        <button className='custom-button' type="submit">Criar evento </button>
        <Link to="/" className="back-button">Voltar</Link>
      </form>
    </div>
  );
}

export default EventCreate;
