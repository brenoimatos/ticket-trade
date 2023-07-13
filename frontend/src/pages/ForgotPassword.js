// ForgotPassword.js
import React, { useState } from 'react'
import api from '../api'
import { useNavigation, Form, useActionData } from 'react-router-dom'
import { Button, TextField, Container, Typography } from '@mui/material'

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  let message = ''
  try {
    const response = await api.forgotPassword(email)
    if (response.status === 202) {
      message =
        'Um e-mail de redefinição de senha foi enviado, caso corresponda a uma conta existente.'
    } else {
      message = 'Ocorreu um erro ao tentar redefinir a senha.'
    }
  } catch (error) {
    message = 'Ocorreu um erro ao tentar redefinir a senha.'
  }
  return message
}

function ForgotPassword() {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const message = useActionData()

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" sx={{ mt: 2, mb: 2 }}>
        Esqueceu sua senha?
      </Typography>
      <Form method="post">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: '20px' }}
          disabled={navigation.state === 'submitting' || message != null}
        >
          {navigation.state === 'submitting'
            ? 'Redefinindo...'
            : 'Redefinir senha'}
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </Container>
  )
}

export default ForgotPassword
