import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { requireAuth } from '../api/auth'
import api from '../api'
import moment from 'moment'
import { Box, Typography, Button, Avatar } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { formatFullName, getInitials } from '../utils'
import { FaWhatsapp } from 'react-icons/fa'

export async function loader({ params, request }) {
  await requireAuth(request)
  return {
    ticket: await api.getTicketById(params.ticketId),
  }
}

function TicketDetail() {
  const { ticket } = useLoaderData()
  const navigate = useNavigate()

  const formattedPhone = `(${String(ticket.user.phone).slice(0, 2)}) ${String(
    ticket.user.phone
  ).slice(2, 7)}-${String(ticket.user.phone).slice(7)}`

  const userRole = ticket.is_for_sale ? 'Vendedor' : 'Comprador'

  return (
    <Box
      sx={{
        width: { sm: '60%', xs: '95%' },
        margin: 'auto',
        marginTop: '25px',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Button sx={{ mb: 3 }} onClick={() => navigate(-1)}>
          <ArrowBackIosIcon sx={{ mr: 1 }} />
          Voltar
        </Button>
        <Typography
          variant="h4"
          sx={{ fontSize: 22, ml: 0.5, mb: 1, fontWeight: 'bold' }}
        >
          {ticket.quantity} {`ingresso${ticket.quantity > 1 ? 's' : ''}`}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderRadius: '5%',
          p: '20px',
          pl: '30px',
          pr: '30px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '10px',
          }}
        >
          <Typography
            variant={{ xs: 'body2', sm: 'h5' }}
            component="div"
            sx={{ fontWeight: 'bold', fontSize: 24 }}
          >
            {`R$ ${ticket.price.toFixed(0)}`}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 14, color: '#868e96', pl: 0.4 }}
          >
            /ingresso
          </Typography>
        </Box>

        {ticket.description && (
          <Typography variant="body1" sx={{ marginBottom: 1.2 }}>
            "{ticket.description}"
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            marginTop: { xs: '0px', md: '5px' },
            marginBottom: { xs: '20px', md: '0px' },
            paddingBottom: 0,
            color: '#666',
            fontSize: '0.8em',
          }}
        >
          Anúncio criado às{' '}
          {moment(ticket.created_at).format('HH:mm [de] DD/MM/YYYY')}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderRadius: '5%',
          p: '20px',
          pl: '30px',
          pr: '30px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#666',
                fontSize: '0.8em',
                marginBottom: '10px',
              }}
            >
              {userRole}
            </Typography>
            <Avatar
              sx={{
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
              }}
            >
              {getInitials(ticket.user.first_name, ticket.user.last_name)}
            </Avatar>
            <Typography variant="h6">
              {formatFullName(ticket.user.first_name)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#800080',
                color: '#fff',
                p: '5px',
                pl: 5,
                pr: 5,
                borderRadius: '5%',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 2,
                fontSize: 25,
              }}
            >
              <strong>Contato</strong>
            </Box>
            <Typography
              sx={{
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '1.2rem',
              }}
            >
              <FaWhatsapp style={{ marginRight: '5px' }} size={20} />{' '}
              {formattedPhone}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            paddingTop: '10px',
            alignSelf: 'flex-start',
            color: '#666',
            fontSize: '0.8em',
          }}
        >
          Usuário inscrito desde{' '}
          {new Date(ticket.user.created_at).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  )
}

export default TicketDetail
