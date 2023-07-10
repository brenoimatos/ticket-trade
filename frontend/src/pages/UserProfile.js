import React, { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import api from '../api'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material'

const UserProfile = () => {
  const [user, setUser] = useLocalStorage('user', null)
  const [userData, setUserData] = useState({})
  const [updateMessage, setUpdateMessage] = useState(null)
  const [alertSeverity, setAlertSeverity] = useState('success')

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const response = await api.getMyUser()
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
    setUpdateMessage(null)
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
    const response = await api.updateMyUser(userData)
    if (response) {
      setUser((prevUser) => ({
        ...prevUser,
        fullName: `${response.first_name} ${response.last_name}`,
      }))
      setAlertSeverity('success')
      setUpdateMessage('Perfil atualizado com sucesso!')
    } else {
      setAlertSeverity('error')
      setUpdateMessage('Houve um erro ao atualizar o perfil.')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        width: { sm: '60%' },
        maxWidth: '100%',
      }}
    >
      <Card
        sx={{
          backgroundColor: '#FFFFFF', // Use a cor que você preferir
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom component="div">
            Seu Perfil
          </Typography>
          {user && (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Primeiro Nome"
                    name="first_name"
                    value={userData.first_name || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sobrenome"
                    name="last_name"
                    value={userData.last_name || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    type="tel"
                    name="phone"
                    value={userData.phone ? formatPhone(userData.phone) : ''}
                    onChange={handleChange}
                    placeholder="(xx) xxxxx-xxxx"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">
                    Atualizar Perfil
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
      {updateMessage && (
        <Alert severity={alertSeverity} sx={{ marginTop: 2 }}>
          {updateMessage}
        </Alert>
      )}
    </Box>
  )
}

export default UserProfile
