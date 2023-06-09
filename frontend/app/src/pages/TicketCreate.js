import React, { useState } from 'react';
import { BASE_URL } from '../api/apiConfig';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function TicketCreate() {
  const { eventId } = useParams();

  const [ticketData, setTicketData] = useState({
    event_id: Number(eventId),
    price: 0,
    is_for_sale: true
  });

  const handleOptionChange = (e) => {
    const { value } = e.target;
    console.log(ticketData.is_for_sale)
    setTicketData(prevData => ({
      ...prevData,
      is_for_sale: value === "venda" ? true : false,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTicketData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(ticketData)

    try {
      const response = await fetch(`${BASE_URL}/tickets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData),
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Ticket created successfully');
        window.location.href = `/events/${eventId}`
      } else {
        console.error('Failed to create ticket');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ticket-create-container">
      <h2>Criar oferta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="price">Preço:</label>
          <input type="number" name="price" value={ticketData.price} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="is_for_sale">Ordem:</label>
          <select name="is_for_sale" onChange={handleOptionChange} required>
            <option value="venda">Venda</option>
            <option value="compra">Compra</option>
          </select>
        </div>
        <button className='custom-button' type="submit">Criar</button>
        <Link to={`/events/${eventId}`} className="back-button">Voltar</Link>
      </form>
    </div>
  );
}

export default TicketCreate;
