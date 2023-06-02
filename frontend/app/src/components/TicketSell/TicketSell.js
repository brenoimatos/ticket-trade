import React, { useState } from 'react';
import './TicketSell.css';
import { createTicket } from '../../api/tickets';

export default function TicketSell() {
    const [nome, setNome] = useState("Festa Arca Eden");
const [local, setLocal] = useState("Rio de Janeiro");
const [data, setData] = useState("2023-08-30");
const [hora, setHora] = useState("11:17");
const [price, setPrice] = useState("");
const [ticketshopUrl, setTicketshopUrl] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  return createTicket({
    "title": nome,
    "url": ticketshopUrl,
    "price": price
})
};

return (
  <div className="event-form-container">
    <div className="form-header">
      <h1 className="form-title">Adicionar novo evento</h1>
    </div>
    <form onSubmit={handleSubmit} data-gtm-form-interact-id="0">
      {/* Aqui você pode continuar a renderizar seus campos de formulário */}
      {/* Exemplo com o campo 'Nome oficial': */}
      <div className="form-field">
        <div>
          <span className="field-label">
            <label htmlFor="title" className="label-text">Nome oficial</label>
            <span className="field-input">
              <input
                id="title"
                aria-label="Nome oficial"
                name="title"
                placeholder="Por exemplo, Mysteryland 2019"
                className="input-text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </span>
          </span>
        </div>

        {/* Continuar com os outros campos de entrada... */}
        <div>
          <label htmlFor="local">Local do Evento</label>
          <input
            id="local"
            name="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="data">Data do Evento</label>
          <input
            id="data"
            type="date"
            name="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="hora">Hora do Evento</label>
          <input
            id="hora"
            type="time"
            name="hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Preço do Ingresso</label>
          <input
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ticketshopUrl">URL do Ticketshop</label>
          <input
            id="ticketshopUrl"
            name="ticketshopUrl"
            value={ticketshopUrl}
            onChange={(e) => setTicketshopUrl(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Enviar</button>
        </div>
      </div>
    </form>
  </div>
);

}    

