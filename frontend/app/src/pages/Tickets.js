// Tickets.js
import React from 'react';
import TicketList from '../components/TicketList';
import EventDetail from '../components/EventDetail'

function Tickets() {
  return (
    <div>
      <EventDetail />
      <TicketList />
    </div>
  );
}

export default Tickets;
