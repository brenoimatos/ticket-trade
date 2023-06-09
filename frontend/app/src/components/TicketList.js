// TicketList.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { BASE_URL } from '../api/apiConfig';
import moment from 'moment';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const { eventId } = useParams();

  useEffect(() => {
    fetch(`${BASE_URL}/tickets/?event_id=${eventId}`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error(err));
  }, [eventId]);

  const renderTickets = (isForSale) => (
    tickets
      .filter(ticket => ticket.is_for_sale === isForSale)
      .map(ticket => (
        <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="ticket-card">
          <div>
            <h3>R$ {ticket.price.toFixed(0)}</h3>
            <small>Última atualização: {moment(ticket.updated_at).format('HH:mm [de] DD/MM/YYYY')}</small>
          </div>
        </Link>
      ))
  );
  function CreateTicketButton() {
    return (
      <div className="create-ticket">
        <Link to={`create-ticket`} className="custom-link-button">
          Criar oferta de venda ou compra
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CreateTicketButton />
    <div className="ticket-list">
      <div className="sell-tickets">
        <h2>Vendedores</h2>
        {renderTickets(true)}
      </div>
      <div className="separator"></div>
      <div className="buy-tickets">
        <h2>Compradores</h2>
        {renderTickets(false)}
      </div>
    </div>
    </div>
  );
}
  


export default TicketList;
