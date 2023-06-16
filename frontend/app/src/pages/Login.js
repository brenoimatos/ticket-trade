import { login as loginApi } from '../api/auth'
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  useLoaderData,
  useNavigation,
  Form,
  redirect,
  useActionData,
  Link,
  Navigate,
} from 'react-router-dom'

export function loader({ request }) {
  return new URL(request.url).searchParams.get('message')
}

export const action = function (login) {
  return async function ({ request }) {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const pathname = new URL(request.url).searchParams.get('redirectTo') || '/'

    try {
      await loginApi(email, password)
      await login()
      return redirect(pathname)
    } catch (err) {
      return err.message
    }
  }
}

export default function Login() {
  const { user } = useAuth()

  const errorMessage = useActionData()
  const message = useLoaderData()
  const navigation = useNavigation()
  if (user) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="login-container">
      <h1>Conecte-se com sua conta</h1>
      {message && <h3 className="red">{message}</h3>}
      {errorMessage && <h3 className="red">{errorMessage}</h3>}

      <Form method="post" className="login-form" replace>
        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
        />
        <button
          className="custom-button"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Entrando...' : 'Entrar'}
        </button>
        <hr className="login-separator" />
        <Link to="/register" className="register-button">
          Criar nova conta
        </Link>
      </Form>
    </div>
  )
}
