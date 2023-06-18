import { getTickets, createTicket, deleteTicket } from './tickets'
import {
  getMyUser,
  updateUser,
  deleteUser,
  validateUser,
  getUserById,
} from './users'
import { getEventById, createEvent } from './events'
import { logout, login } from './auth'

export default {
  getTickets,
  createTicket,
  deleteTicket,
  getUserById,
  getMyUser,
  validateUser,
  updateUser,
  deleteUser,
  getEventById,
  createEvent,
  logout,
  login,
}
