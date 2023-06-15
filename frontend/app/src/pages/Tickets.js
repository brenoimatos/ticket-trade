// Tickets.js
import React from 'react'
import TicketList from '../components/TicketList'
import EventDetail from '../components/EventDetail'
import { getEventById } from '../api/events'
import { getTickets } from '../api/tickets'

export async function loader({ params }) {
  return {
    events: await getEventById(params.eventId),
    tickets: await getTickets(params.eventId),
  }
}

function Tickets() {
  return (
    <div>
      <EventDetail />
      <TicketList />
    </div>
  )
}

export default Tickets
