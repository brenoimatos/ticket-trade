import React, { useState, useEffect } from 'react'
import { apiBaseUrl } from '../api/apiConfig'
import EventList from './EventList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Box, InputBase, IconButton, Container } from '@mui/material'

function EventSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(delayTimer)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm.length === 0) {
      fetch(
        `${apiBaseUrl}/events/?search=${debouncedSearchTerm}&sort=["name", "ASC"]&range=[0, 5]`
      )
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => console.error(err))
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchTerm])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <Container sx={{ width: { sm: '70%', xs: '90%' } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { sm: '80%', xs: '90%' },
            marginTop: 2,
            borderRadius: '20px',
            border: '2px solid #ccc',
            position: 'relative',
          }}
        >
          <InputBase
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pesquisar eventos"
            sx={{
              height: '40px',
              paddingLeft: 3,
              paddingRight: 1,
              border: 'none',
              fontSize: '16px',
              outline: 'none',
              width: '100%',
            }}
          />
          <IconButton size="small" sx={{ marginRight: '10px' }}>
            <FontAwesomeIcon icon={faSearch} />
          </IconButton>
        </Box>
        {searchResults && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <EventList events={searchResults} />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default EventSearch
