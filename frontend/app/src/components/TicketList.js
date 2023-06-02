import React, { useState, useEffect } from 'react';
import { getTickets } from '../api/tickets';
import Ticket from './Ticket/Ticket';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  return (
    <div>
      {tickets.map(ticket => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
