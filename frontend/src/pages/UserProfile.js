import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import api from '../api'
import { useLocalStorage } from '../hooks/useLocalStorage'

const UserProfile = () => {
  const [user, setUser] = useLocalStorage('user', null)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    if (user) {
      // call your api to fetch user data
      const fetchData = async () => {
        const response = await api.getMyUser() // replace with your actual api method
        setUserData(response)
      }
      fetchData()
    }
  }, [user])

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const formatPhone = (value) => {
    value = value ? value.toString() : ''
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
    value = value.replace(/(\d)(\d{4})$/, '$1-$2')
    return value
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // call your api to update user data
    const response = await api.updateMyUser(userData) // replace with your actual api method
    if (response) {
      setUser((prevUser) => ({
        ...prevUser,
        fullName: `${response.first_name} ${response.last_name}`,
      }))
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="my-3">Seu Perfil</h2>
          {user && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>Primeiro Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={userData.first_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Sobrenome</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={userData.last_name || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={userData.phone ? formatPhone(userData.phone) : ''}
                  onChange={handleChange}
                  placeholder="(xx) xxxxx-xxxx"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="update-button">
                Atualizar Perfil
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default UserProfile
