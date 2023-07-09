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
