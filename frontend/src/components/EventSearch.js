import React, { useState, useEffect } from 'react'
import EventList from './EventList'
import {
  Box,
  InputBase,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import api from '../api'
import homeBackgroundImage from '../assets/homeBackground.jpg'

function EventSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false) // New loading state

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 250)

    return () => clearTimeout(delayTimer)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm.length === 0) {
      setIsLoading(true) // Set loading state to true before the request
      api.getEvents(debouncedSearchTerm, (events) => {
        setSearchResults(events)
        setIsLoading(false) // Set loading state to false after the request is done
      })
    }
  }, [debouncedSearchTerm])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <Box
      sx={{
        width: { sm: '100%', xs: '100%' },
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${homeBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          pt: 2,
          pb: 3,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mt: 2,
            mb: 2,
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px #000000',
            width: { sm: '50%', xs: '80%' }, // largura do texto
            fontSize: { sm: '3rem', xs: '2.3rem' },
          }}
        >
          A maneira mais fácil de comprar e vender ingressos
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { sm: '50%', xs: '80%' }, // largura da caixa de pesquisa
            backgroundColor: 'white',
            borderRadius: '20px',
            pl: 2,
            pr: 1,
            mt: 2,
          }}
        >
          <InputBase
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pesquisar mais eventos"
            sx={{
              pl: 1,
              pr: 5,
              width: '100%', // largura do placeholder e texto do search
              color: 'black',
            }}
          />
          <IconButton type="submit" sx={{ ml: 'auto', color: 'black' }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          width: { sm: '60%', xs: '90%' },
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          mx: 'auto',
        }}
      >
        {!searchTerm && !isLoading && (
          <Typography
            variant="h2"
            align="center"
            sx={{
              mt: 2,
              mb: 2,
              color: 'black',
              fontWeight: 'bold',
              width: { sm: '100%', xs: '100%' }, // largura do texto
              fontSize: { sm: '3rem', xs: '2.3rem' },
            }}
          >
            Eventos em destaque
          </Typography>
        )}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <EventList events={searchResults} />
        )}
      </Box>
    </Box>
  )
}

export default EventSearch
