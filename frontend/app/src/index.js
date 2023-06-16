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
import { getFromLocalStorage } from './hooks/useLocalStorage'
import Login, {
  loader as loginLoader,
  action as loginAction,
} from './pages/Login'
import { requireAuth } from './api/auth'
import Register, { action as registerAction } from './pages/Register'
import { AuthProvider, useAuth } from './hooks/useAuth'
import TicketDetail from './pages/TicketDetail'

export default function App() {
  const { login, user } = useAuth()
  console.log('index user', user)
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={<Login />}
          loader={loginLoader}
          action={loginAction(login)}
        />
        <Route path="register" element={<Register />} action={registerAction} />
        <Route
          path="events/:eventId"
          element={<Tickets />}
          loader={ticketLoader}
          action={ticketAction}
        />
        <Route
          path="events/:eventId/create-ticket"
          element={<TicketCreate />}
          loader={async ({ request }) => await requireAuth(request, user)}
          action={ticketCreateAction}
        />
        <Route path="tickets/:ticketId" element={<TicketDetail />} />
        <Route
          path="events/create"
          element={<EventCreate />}
          loader={async ({ request }) => await requireAuth(request, user)}
          action={eventCreateAction}
        />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}
const userData = getFromLocalStorage('user')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider storedUserData={userData}>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
