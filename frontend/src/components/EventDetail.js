import { useLoaderData } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import api from '../api'
import { Typography, Button, Box, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import eventBackgroundImage from '../assets/eventBackground.jpg'
import { getLocationDisplay } from '../utils'

export async function loader({ params }) {
  return {
    event: await api.getEventById(params.eventId),
  }
}

function EventDetail() {
  const { event } = useLoaderData()
  const theme = useTheme()

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTicketURL = (url) => {
    if (!url.startsWith('http')) {
      url = `https://${url}`
    }
    return url
  }
  const locationDisplay = getLocationDisplay(event)
  return (
    <div>
      <Paper
        style={{
          position: 'relative',
          minHeight: '30vh',
          backgroundImage: `url(${eventBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          padding: theme.spacing(4),
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            padding: theme.spacing(4),
          }}
        />
        <Box
          display="flex"
          justifyContent="center"
          style={{ width: '100%', zIndex: 1, textAlign: 'center' }}
        >
          <Typography
            variant="h2"
            style={{
              wordWrap: 'break-word',
              fontSize: '3rem',
              textShadow: '2px 2px 4px #000000',
            }}
          >
            {event.name}
          </Typography>
        </Box>
        <Typography
          variant="h5"
          style={{
            marginTop: theme.spacing(1),
            zIndex: 1,
            fontSize: '1.5rem',
            textShadow: '1px 1px 3px #000000',
          }}
        >
          📅 {formatDate(event.date)}
        </Typography>
        <Typography
          variant="h5"
          style={{
            marginTop: theme.spacing(1),
            zIndex: 1,
            fontSize: '1.5rem',
            wordWrap: 'break-word',
            textShadow: '1px 1px 3px #000000',
          }}
        >
          📍 {locationDisplay}
        </Typography>

        <Button
          variant="contained"
          style={{
            marginTop: theme.spacing(2),
            zIndex: 1,
            color: 'black',
            backgroundColor: 'white',
          }}
          href={formatTicketURL(event.ticket_url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Bilheteria Oficial
        </Button>
      </Paper>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default EventDetail
