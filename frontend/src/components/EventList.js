import React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Box } from '@mui/material'
import { styled } from '@mui/system'
import { getLocationDisplay } from '../utils'

const EventCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.4, 0),
  borderRadius: '5px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
}))

const EventList = ({ events }) => {
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Box sx={{ width: 1 }}>
      {events.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}/tickets`}
          className="event-link"
        >
          <EventCard
            sx={{
              pl: 0,
              pr: 0,
              pb: 1,
              pt: 1,
              mb: { xs: 1, sm: 0.7 },
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginBottom: '3px',
                color: 'red',
                fontSize: '1rem',
                pl: '10px',
              }}
            >
              <span role="img" aria-label="date-icon">
                📅{' '}
              </span>
              {formatDate(event.date)}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                marginBottom: '3px',
                fontWeight: 'bold',
                fontSize: '18px',
                lineHeight: '18px',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                pl: '10px',
              }}
            >
              {event.name}
            </Typography>
            <Typography
              variant="subtitle1"
              className="event-location"
              sx={{ fontSize: '14px', color: '#333', pl: '10px' }}
            >
              <span role="img" aria-label="location-icon">
                📍{' '}
              </span>
              {getLocationDisplay(event)}
            </Typography>
          </EventCard>
        </Link>
      ))}
    </Box>
  )
}

export default EventList
