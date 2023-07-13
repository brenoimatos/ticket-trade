import React from 'react'
import { useParams } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import { useNavigation, Form, redirect, useActionData } from 'react-router-dom'
import { createTicket } from '../api/tickets'
import {
  Container,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
} from '@mui/material'

export async function action({ params, request }) {
  const eventId = params.eventId
  const formData = await request.formData()
  const price = formData.get('price')
  const isForSale = formData.get('transactionType') === 'venda' ? true : false
  try {
    await createTicket(eventId, price, isForSale)
    return redirect(`/events/${eventId}/tickets`)
  } catch (err) {
    return err.message
  }
}

function TicketCreate() {
  const errorMessage = useActionData()
  const navigation = useNavigation()
  const { eventId } = useParams()
  return (
    <Container
      sx={{
        width: { sm: '60%' },
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        fontWeight="bold"
      >
        Criar oferta
      </Typography>
      {errorMessage && (
        <Typography variant="h6" color="error">
          {errorMessage}
        </Typography>
      )}

      <Form method="post">
        <TextField
          name="price"
          type="number"
          placeholder="Preço"
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <Select name="transactionType" defaultValue="venda" required>
            <MenuItem value="venda">Venda</MenuItem>
            <MenuItem value="compra">Compra</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={navigation.state === 'submitting'}
            mb={3}
            sx={{ width: '100%', maxWidth: '300px' }}
          >
            {navigation.state === 'submitting' ? 'Criando...' : 'Criar'}
          </Button>
          <Button
            variant="text"
            color="primary"
            component={RouterLink}
            to={`/events/${eventId}/tickets`}
            mt={3}
            sx={{ width: '100%', maxWidth: '300px' }}
          >
            Voltar
          </Button>
        </Box>
      </Form>
    </Container>
  )
}

export default TicketCreate
