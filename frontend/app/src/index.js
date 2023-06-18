import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import Home from './pages/Home'
import Tickets, {
  loader as ticketLoader,
  action as ticketAction,
} from './pages/Tickets'
import Layout from './components/Layout'
import EventCreate, { action as eventCreateAction } from './pages/EventCreate'
import TicketCreate, {
  action as ticketCreateAction,
} from './pages/TicketCreate'
import Login, {
  loader as loginLoader,
  action as loginAction,
} from './pages/Login'
import { requireAuth } from './api/auth'
import Register, { action as registerAction } from './pages/Register'
import TicketDetail, {
  loader as ticketDetailLoader,
} from './pages/TicketDetail'

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={<Login />}
          loader={loginLoader}
          action={loginAction}
        />
        <Route path="register" element={<Register />} action={registerAction} />
        <Route
          path="events/create"
          element={<EventCreate />}
          loader={async ({ request }) => await requireAuth(request)}
          action={eventCreateAction}
        />
        <Route
          path="events/:eventId/tickets"
          element={<Tickets />}
          loader={ticketLoader}
          action={ticketAction}
        />
        <Route
          path="events/:eventId/tickets/create"
          element={<TicketCreate />}
          loader={async ({ request }) => await requireAuth(request)}
          action={ticketCreateAction}
        />
        <Route
          path="events/:eventId/tickets/:ticketId"
          element={<TicketDetail />}
          loader={ticketDetailLoader}
        />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
