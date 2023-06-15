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
import Tickets, { loader as ticketLoader } from './pages/Tickets'
import Layout from './components/Layout'
import { loader as layoutLoader } from './components/Layout'
import TicketDetail from './pages/TicketDetail'
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
        path="events/:eventId"
        element={<Tickets />}
        loader={ticketLoader}
      />
      <Route
        path="events/:eventId/create-ticket"
        element={<TicketCreate />}
        loader={async ({ request }) => await requireAuth(request)}
        action={ticketCreateAction}
      />
      <Route path="tickets/:ticketId" />
      <Route
        path="events/create"
        element={<EventCreate />}
        loader={async ({ request }) => await requireAuth(request)}
        action={eventCreateAction}
      />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
