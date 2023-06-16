// Tickets.js
import React from 'react'
import TicketList from '../components/TicketList'
import EventDetail from '../components/EventDetail'
import api from '../api'

export async function loader({ params }) {
  return {
    events: await api.getEventById(params.eventId),
    tickets: await api.getTickets(params.eventId),
  }
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const id = formData.get('ticketId')
  return await api.deleteTicket(id)
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
