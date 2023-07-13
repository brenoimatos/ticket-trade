// TicketDetail.js
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { requireAuth } from '../api/auth'
import api from '../api'
import moment from 'moment'
import { Box, Typography } from '@mui/material'

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

  const messageTitle = 'Contato'
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
          display: { xs: 'block', md: 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '5%',
          padding: '30px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
        }}
      >
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography
            sx={{
              fontSize: '3em',
              textAlign: 'inherit',
              marginLeft: { ms: '10px', xs: '0' },
            }}
          >
            R$ {ticket.price.toFixed(0)}
          </Typography>
          <Typography
            sx={{
              marginTop: { xs: '0px', md: '5px' },
              marginBottom: { xs: '20px', md: '0px' },
              paddingBottom: 0,
              color: '#666',
              fontSize: '0.8em',
            }}
          >
            Última atualização:{' '}
            {moment(ticket.updated_at).format('HH:mm [de] DD/MM/YYYY')}
          </Typography>
        </Box>
        <Box
          sx={{
            boxSizing: 'border-box',
            fontSize: '1.3em',
            marginRight: { xs: '0', md: '30px' },
            marginTop: { xs: '10px', md: '0' },
            textAlign: { xs: 'center', md: 'inherit' },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#800080',
              color: '#fff',
              padding: '5px',
              borderRadius: '5%',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <strong>{messageTitle}:</strong>
          </Box>
          <Typography
            sx={{
              color: '#000000',
              fontWeight: 'bold',
              padding: '5px',
              textAlign: 'inherit',
              fontSize: { xs: '2rem', md: '1.5rem' },
            }}
          >
            <span role="img" aria-label="whatsapp">
              📱
            </span>{' '}
            {formattedPhone}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '5%',
          padding: '30px',
          backgroundColor: '#f9f9f9',
          marginBottom: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                marginLeft: '10px',
                backgroundColor: '#800080',
                color: '#fff',
                borderRadius: '50%',
                padding: '10px',
                marginRight: '10px',
              }}
            >
              {userInitials}
            </Box>
            <Typography sx={{ fontSize: '1.5em' }}>
              {ticket.user.first_name} {ticket.user.last_name}
            </Typography>
          </Box>
          <Typography
            sx={{
              marginTop: '20px',
              marginBottom: 0,
              paddingBottom: 0,
              marginLeft: '10px',
              color: '#666',
              fontSize: '0.8em',
            }}
          >
            Usuário inscrito desde{' '}
            {new Date(ticket.user.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TicketDetail
