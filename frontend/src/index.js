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
import TicketList, {
  loader as ticketListLoader,
  action as ticketListAction,
} from './components/TicketList'
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
import EventDetail, {
  loader as eventDetailLoader,
} from './components/EventDetail'

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
          element={<EventDetail />}
          loader={eventDetailLoader}
        >
          <Route
            index
            element={<TicketList />}
            loader={ticketListLoader}
            action={ticketListAction}
          />
          <Route
            path="create"
            element={<TicketCreate />}
            loader={async ({ request }) => await requireAuth(request)}
            action={ticketCreateAction}
          />
          <Route
            path=":ticketId"
            element={<TicketDetail />}
            loader={ticketDetailLoader}
          />
        </Route>
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