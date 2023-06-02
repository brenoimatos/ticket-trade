import React from 'react';
import './Ticket.css';

export default function Ticket({ ticket }) {
  const firstLetter = ticket.title[0];

  return (
    <div className="ticket-container">
      <div className="ticket-circle">{firstLetter}</div>
      <div className="ticket-details">
        <h2 className="ticket-title">{ticket.title}</h2>
        <p className="ticket-price">Price: {ticket.price}</p>
      </div>
    </div>
  );
}


