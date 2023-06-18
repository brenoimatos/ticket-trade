// TicketDetail.js
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { requireAuth } from '../api/auth'
import api from '../api'

export async function loader({ params, request }) {
  await requireAuth(request)
  return {
    event: await api.getEventById(params.eventId),
    ticket: await api.getTicketById(params.ticketId),
  }
}

function TicketDetail() {
  const { event, ticket } = useLoaderData()

  return (
    <div className="ticket-detail-container">
      <h2 className="ticket-detail-title">Ticket #{ticket.id}</h2>
      <div className="ticket-detail-content">
        <p>
          <strong>Nome: </strong>
          {ticket.user.first_name} {ticket.user.last_name}
        </p>
        <p>
          <strong>Email: </strong>
          {ticket.user.email}
        </p>
        <p>
          <strong>Telefone: </strong>
          {ticket.user.phone}
        </p>
        <p>
          <strong>Preço: </strong>R$ {ticket.price.toFixed(0)}
        </p>
        <p>
          <strong>Anunciado em: </strong>
          {new Date(ticket.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Atualizado em: </strong>
          {new Date(ticket.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default TicketDetail
