// TicketList.js
import { Link, useLoaderData, Form, useNavigation } from 'react-router-dom'
import moment from 'moment'
import { useAuth } from '../hooks/useAuth'
import Modal from 'react-modal'
import { useState } from 'react'

Modal.setAppElement('#root')

function TicketList() {
  const { user } = useAuth()
  const { tickets } = useLoaderData()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null)
  const navigation = useNavigation()

  const openModal = (ticketId) => {
    setModalIsOpen(true)
    setTicketIdToDelete(ticketId)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setTicketIdToDelete(null)
  }

  const renderTickets = (isForSale) =>
    tickets
      .filter((ticket) => ticket.is_for_sale === isForSale)
      .map((ticket) => (
        <Link
          to={`/tickets/${ticket.id}`}
          className="ticket-card"
          key={ticket.id}
        >
          <div>
            <h3>R$ {ticket.price.toFixed(0)}</h3>
            <small>
              Última atualização:{' '}
              {moment(ticket.updated_at).format('HH:mm [de] DD/MM/YYYY')}
            </small>
          </div>
          <div className="card-actions">
            {/* Apenas mostrar o botão de delete se o usuário é o dono do ticket */}
            {ticket.user_id === user && (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  openModal(ticket.id)
                }}
              >
                X
              </button>
            )}
          </div>
        </Link>
      ))

  function CreateTicketButton() {
    return (
      <div className="create-ticket">
        <Link to="create-ticket" className="custom-link-button">
          Criar oferta de venda ou compra
        </Link>
      </div>
    )
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmar Exclusão"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirmar exclusão</h2>
        <p>Você realmente deseja excluir esse ticket?</p>
        <Form method="delete" replace onSubmit={() => closeModal()}>
          <input name="ticketId" defaultValue={ticketIdToDelete} hidden />
          <button type="submit">Confirmar</button>
          <button onClick={closeModal}>Cancelar</button>
        </Form>
      </Modal>
    </div>
  )
}
export default TicketList
