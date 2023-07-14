import React, { useState } from 'react'
import {
  Link as RouterLink,
  useLoaderData,
  Form,
  useParams,
} from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import api from '../api'
import { requireAuth } from '../api/auth'
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  CardActionArea,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import moment from 'moment'
import 'moment/locale/pt-br'
import { formatName } from '../utils'

export async function loader({ params, request }) {
  return {
    tickets: await api.getTickets(params.eventId),
    message: new URL(request.url).searchParams.get('message'),
  }
}

export const action = async ({ request }) => {
  await requireAuth(request)
  const formData = await request.formData()
  const id = formData.get('ticketId')
  return await api.deleteTicket(id)
}

function TicketList() {
  const [user, setUser] = useLocalStorage('user', null)
  const { eventId } = useParams()
  const { tickets, message } = useLoaderData()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null)

  const openModal = (ticketId) => {
    setModalIsOpen(true)
    setTicketIdToDelete(ticketId)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setTicketIdToDelete(null)
  }
  const renderTickets = (isForSale) => {
    const filteredTickets = tickets.filter(
      (ticket) => ticket.is_for_sale === isForSale
    )
    const sortedTickets = filteredTickets.sort((a, b) => {
      if (isForSale) {
        return a.price - b.price // Ascendente para compradores
      } else {
        return b.price - a.price // Descendente para vendedores
      }
    })

    if (sortedTickets.length === 0) {
      if (isForSale) {
        return (
          <Typography variant="body2" color="text.secondary" align="center">
            Não há vendedores até o momento.
          </Typography>
        )
      } else {
        return (
          <Typography variant="body2" color="text.secondary" align="center">
            Não há compradores até o momento.
          </Typography>
        )
      }
    }

    return sortedTickets.map((ticket) => (
      <Grid item xs={12} sm={12} key={ticket.id}>
        <CardActionArea
          component={RouterLink}
          to={`/events/${eventId}/tickets/${ticket.id}`}
        >
          <Card
            variant="outlined"
            sx={{
              textDecoration: 'none',
              mb: '10px',
            }}
          >
            <CardHeader
              action={
                ticket.user.id === user.id && (
                  <IconButton
                    aria-label="settings"
                    onClick={(event) => {
                      event.stopPropagation()
                      event.preventDefault()
                      openModal(ticket.id)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
              title={
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold' }}
                >{`R$ ${ticket.price.toFixed(0)}`}</Typography>
              }
              subheader={
                <Typography variant="h6" color="text.primary">
                  {formatName(ticket.user.first_name, ticket.user.last_name)}
                </Typography>
              }
              sx={{
                paddingBottom: '0.3px',
                pt: 1,
                pl: 1.5,
                pr: 1.5,
              }} // Reduz o espaço entre o header e o content
            />
            <CardContent
              sx={{ pt: 0, pl: 1.5, pb: 0, '&:last-child': { pb: 1 } }} // Reduz a altura do CardContent
            >
              <Typography
                variant="caption text"
                color="text.secondary"
                sx={{ fontSize: '0.8rem', mb: '0px', pb: 0 }}
              >
                Criado {moment(ticket.updated_at).locale('pt-br').fromNow()}
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    ))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: '20px',
      }}
    >
      {message && <h3 className="red">{message}</h3>}
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="create"
        sx={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        Criar oferta de venda ou compra
      </Button>
      <Grid
        container
        spacing={{ sm: 2, xs: 1 }}
        sx={{ width: { sm: '60%' }, maxWidth: '100%' }}
      >
        <Grid item xs={6} sm={6}>
          <Typography variant="h5" align="center" sx={{ mb: '0.8rem' }}>
            Vendedores
          </Typography>
          {renderTickets(true)}
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography variant="h5" align="center" sx={{ mb: '0.8rem' }}>
            Compradores
          </Typography>
          {renderTickets(false)}
        </Grid>
      </Grid>

      <Dialog open={modalIsOpen} onClose={closeModal}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você realmente deseja excluir esse ticket?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cancelar
          </Button>
          <Form method="delete" replace onSubmit={() => closeModal()}>
            <input name="ticketId" defaultValue={ticketIdToDelete} hidden />
            <Button color="primary" type="submit">
              Confirmar
            </Button>
          </Form>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TicketList
