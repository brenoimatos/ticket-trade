import {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
} from './tickets'
import {
  getMyUser,
  updateUser,
  deleteUser,
  validateUser,
  getUserById,
  updateMyUser,
} from './users'
import { getEventById, createEvent, getEvents } from './events'
import { logout, login, forgotPassword, resetPassword } from './auth'

const api = {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
  getUserById,
  getMyUser,
  validateUser,
  updateUser,
  deleteUser,
  getEventById,
  createEvent,
  getEvents,
  logout,
  login,
  forgotPassword,
  resetPassword,
  updateMyUser,
}

export default api
