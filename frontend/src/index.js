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
import { requireAuth, requireSuperAuth } from './api/auth'
import Register, { action as registerAction } from './pages/Register'
import TicketDetail, {
  loader as ticketDetailLoader,
} from './pages/TicketDetail'
import EventDetail, {
  loader as eventDetailLoader,
} from './components/EventDetail'
import UserProfile from './pages/UserProfile'
import { ThemeProvider, createTheme } from '@mui/material'
import ForgotPassword, {
  action as forgotPasswordAction,
} from './pages/ForgotPassword'
import ResetPassword, {
  loader as resetPasswordLoader,
  action as resetPasswordAction,
} from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'

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
          path="forgot-password"
          element={<ForgotPassword />}
          action={forgotPasswordAction}
        />
        <Route
          path="reset-password"
          element={<ResetPassword />}
          action={resetPasswordAction}
          loader={resetPasswordLoader}
        />
        <Route
          path="account"
          element={<UserProfile />}
          loader={async ({ request }) => await requireAuth(request)}
        />
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
        <Route
          path="admin-dash"
          element={<AdminDashboard />}
          loader={async ({ request }) => await requireSuperAuth(request)}
        />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

export const theme = createTheme({
  palette: {
    background: {
      paper: '#F5F5F5',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    primary: {
      main: '#173A5E',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
