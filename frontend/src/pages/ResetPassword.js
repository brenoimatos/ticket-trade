// ResetPassword.js
import React from 'react'
import api from '../api'
import {
  useNavigation,
  Form,
  useLoaderData,
  useActionData,
  redirect,
} from 'react-router-dom'
import { Button, TextField, Container, Typography } from '@mui/material'

export async function loader({ request }) {
  const urlParams = new URL(request.url).searchParams
  return {
    user_name: urlParams.get('user_name'),
  }
}

export async function action({ request }) {
  const token = new URL(request.url).searchParams.get('token')
  const formData = await request.formData()
  const password = formData.get('password')
  const passwordConfirmation = formData.get('passwordConfirmation')
  let message = ''
  if (password !== passwordConfirmation) {
    message = 'As senhas não são iguais.'
    return message
  }
  try {
    const response = await api.resetPassword(password, token)
    if (response.status === 200) {
      return redirect('/login?message=Senha redefinida com sucesso.')
    } else {
      message = 'Ocorreu um erro ao tentar redefinir a senha.'
    }
  } catch (error) {
    message = 'Ocorreu um erro ao tentar redefinir a senha.'
  }
  return message
}

function ResetPassword() {
  const navigation = useNavigation()
  const { user_name } = useLoaderData()
  const message = useActionData()

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Redefinição de Senha
      </Typography>
      <Typography variant="h5" align="center" sx={{ mt: 2, mb: 2 }}>
        Olá, {user_name}!
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 2, mb: 2 }}>
        Por favor, insira sua nova senha abaixo:
      </Typography>

      <Form method="post">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="passwordConfirmation"
          label="Confirmar nova senha"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: '20px' }}
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting'
            ? 'Redefinindo...'
            : 'Redefinir senha'}
        </Button>
      </Form>
      {message && (
        <Typography
          variant="body1"
          align="center"
          color="error"
          sx={{ marginTop: '20px' }}
        >
          {message}
        </Typography>
      )}
    </Container>
  )
}

export default ResetPassword
