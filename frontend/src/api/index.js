import {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
  getDashTicketsStats,
} from './tickets'
import {
  getMyUser,
  updateUser,
  deleteUser,
  validateUser,
  getUserById,
  updateMyUser,
  getDashUsersStats,
  getDashUsers,
} from './users'
import { getEventById, createEvent, getEvents } from './events'
import { logout, login, forgotPassword, resetPassword } from './auth'

const api = {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
  getDashTicketsStats,
  getUserById,
  getMyUser,
  validateUser,
  updateUser,
  deleteUser,
  getDashUsersStats,
  getDashUsers,
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
