import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigation, Form, redirect, useActionData } from 'react-router-dom'
import { createTicket } from '../api/tickets'

export async function action({ params, request }) {
  const eventId = params.eventId
  const formData = await request.formData()
  const price = formData.get('price')
  const isForSale = formData.get('transactionType') === 'venda' ? true : false
  try {
    await createTicket(eventId, price, isForSale)
    return redirect(`/events/${eventId}`)
  } catch (err) {
    return err.message
  }
}

function TicketCreate() {
  const errorMessage = useActionData()
  const navigation = useNavigation()
  const { eventId } = useParams()
  return (
    <div className="ticket-create-container">
      <h1>Criar oferta</h1>
      {errorMessage && <h3 className="red">{errorMessage}</h3>}

      <Form method="post" className="ticket-form">
        <input name="price" type="number" placeholder="Preço" required />
        <select name="transactionType" required>
          <option value="venda">Venda</option>
          <option value="compra">Compra</option>
        </select>
        <button
          className="custom-button"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Criando...' : 'Criar'}
        </button>
        <Link to={`/events/${eventId}`} className="back-button">
          Voltar
        </Link>
      </Form>
    </div>
  )
}

export default TicketCreate
