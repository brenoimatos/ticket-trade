import { register } from '../api/auth'
import { useState } from 'react'

import { useNavigation, Form, redirect, useActionData } from 'react-router-dom'

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const first_name = formData.get('first_name')
  const last_name = formData.get('last_name')
  const phone = formData.get('phone')

  try {
    await register(email, password, first_name, last_name, phone)
    return redirect('/login')
  } catch (err) {
    return JSON.stringify(err.message)
  }
}

export default function Register() {
  const errorMessage = useActionData()
  const navigation = useNavigation()
  const [phone, setPhone] = useState('')

  const handlePhoneChange = (event) => {
    let value = event.target.value
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
    value = value.replace(/(\d)(\d{4})$/, '$1-$2')
    setPhone(value)
  }

  return (
    <div className="register-container">
      <h1>Cadastre-se</h1>
      {errorMessage && <h3 className="red">{errorMessage}</h3>}

      <Form method="post" className="register-form" replace>
        <div className="input-group">
          <input name="first_name" type="text" placeholder="Nome" required />
          <input
            name="last_name"
            type="text"
            placeholder="Sobrenome"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Celular"
          value={phone}
          onChange={handlePhoneChange}
          required
        />{' '}
        <input
          name="password"
          type="password"
          placeholder="Senha"
          autoComplete="current-password"
          required
        />
        <button
          className="custom-button"
          disabled={navigation.state === 'submitting'}
        >
          {navigation.state === 'submitting' ? 'Registrando...' : 'Registrar'}
        </button>
      </Form>
    </div>
  )
}
