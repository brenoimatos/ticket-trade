// TicketDetail.js
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { requireAuth } from '../api/auth'
import api from '../api'
import moment from 'moment'

export async function loader({ params, request }) {
  await requireAuth(request)
  return {
    ticket: await api.getTicketById(params.ticketId),
  }
}

function TicketDetail() {
  const { ticket } = useLoaderData()

  const formattedPhone = `(${String(ticket.user.phone).slice(0, 2)}) ${String(
    ticket.user.phone
  ).slice(2, 7)}-${String(ticket.user.phone).slice(7)}`

  // Extrai as iniciais do usuário
  const userInitials = `${ticket.user.first_name[0]}${ticket.user.last_name[0]}`

  const messageTitle = ticket.is_for_sale ? 'Para comprar' : 'Para vender'
  const userRole = ticket.is_for_sale ? 'Vendedor' : 'Comprador'

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-content-top">
        <div>
          <div className="ticket-price">R$ {ticket.price.toFixed(0)}</div>
          <div className="ticket-status">
            Última atualização:{' '}
            {moment(ticket.updated_at).format('HH:mm [de] DD/MM/YYYY')}
          </div>
        </div>
        <div className="message-box">
          <div className="message-header">
            <strong>{messageTitle}:</strong>
          </div>
          <div className="message-content">
            <span role="img" aria-label="whatsapp">
              📱
            </span>{' '}
            {formattedPhone}
          </div>
        </div>
      </div>
      <div className="ticket-detail-content-bottom">
        <div className="user-info-box">
          <div className="user-role">{userRole}</div>
          <div className="user-name-box">
            <div className="user-initials">{userInitials}</div>
            <div className="user-name">
              {ticket.user.first_name} {ticket.user.last_name}
            </div>
          </div>
          <div className="user-date">
            Usuário inscrito desde{' '}
            {new Date(ticket.user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetail
