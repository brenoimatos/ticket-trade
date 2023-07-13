import React from 'react'
import api from '../api'
import {
  useLoaderData,
  useNavigation,
  Form,
  useActionData,
  Link,
  redirect,
} from 'react-router-dom'
import { publishEvent } from '../hooks/customEvent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export function loader({ request }) {
  return new URL(request.url).searchParams.get('message')
}

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const pathname = new URL(request.url).searchParams.get('redirectTo') || '/'
  try {
    await api.login(email, password)
    const myUser = await api.getMyUser()
    const userFullNameValue = myUser.first_name + ' ' + myUser.last_name

    // Criar um objeto para armazenar as informações do usuário
    const userObject = {
      id: myUser.id,
      fullName: userFullNameValue,
    }

    // Converter o objeto para uma string JSON e armazená-lo no localStorage
    const key = 'user'
    const newValue = JSON.stringify(userObject)
    localStorage.setItem(key, newValue)

    // Publicar o objeto completo do usuário
    publishEvent('login', { key, newValue })

    return redirect(pathname)
  } catch (err) {
    return err.message
  }
}

export default function Login() {
  const errorMessage = useActionData()
  const message = useLoaderData()
  const navigation = useNavigation()

  return (
    <Container component="main" maxWidth="xs">
      <Form method="post" className="login-form" replace>
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: '50px',
          }}
        >
          {message && <h3 className="red">{message}</h3>}
          {errorMessage && <h3 className="red">{errorMessage}</h3>}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Conecte-se com sua conta
          </Typography>
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={navigation.state === 'submitting'}
            >
              {navigation.state === 'submitting' ? 'Entrando...' : 'Entrar'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password" variant="body2">
                  Esqueceu sua senha?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2">
                  {'Criar nova conta'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Form>
    </Container>
  )
}
