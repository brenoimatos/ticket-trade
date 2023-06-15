import { Link } from 'react-router-dom'
import { createEvent } from '../api/events'
import { useNavigation, Form, redirect, useActionData } from 'react-router-dom'

export async function action({ request }) {
  const formData = await request.formData()
  const name = formData.get('name')
  const location = formData.get('location')
  const date = formData.get('date')
  const ticket_url = formData.get('ticket_url')
  try {
    const data = await createEvent({ name, location, date, ticket_url })
    return redirect(`/events/${data.id}`)
  } catch (err) {
    return err.message
  }
}

function EventCreate() {
  const errorMessage = useActionData()
  const navigation = useNavigation()

  return (
    <div className="event-create-container">
      <h1>Adicionar novo evento</h1>
      {errorMessage && <h3 className="red">{errorMessage}</h3>}

      <Form method="post" className="ticket-form">
        <label>
          Nome:
          <input
            name="name"
            type="text"
            placeholder="Ex: Festa de Ano Novo"
            required
          />
        </label>
        <label>
          Local:
          <input
            name="location"
            type="text"
            placeholder="Rio de Janeiro"
            required
          />
        </label>
        <label>
          Data:
          <input name="date" type="datetime-local" required />
        </label>
        <label>
          Link da bilheteria oficial:
          <input
            name="ticket_url"
            type="text"
            placeholder="Ex: www.bilheteriaoficial.com/evento"
          />
        </label>
        <button
          className="custom-button"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Criando...' : 'Criar'}
        </button>
        <Link to="/" className="back-button">
          Voltar
        </Link>
      </Form>
    </div>
  )
}

export default EventCreate
