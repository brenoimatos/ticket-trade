import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route
  } from "react-router-dom"
import Home from './pages/Home';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import Layout from './components/Layout';
import TicketDetail from './pages/TicketDetail';
import EventCreate from './pages/EventCreate';
import TicketCreate from './pages/TicketCreate';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route
        path="login"
        element={<Login />}
      />
      <Route 
        path="events/:eventId" 
        element={<Tickets />} 
      />
      <Route 
        path="events/:eventId/create-ticket" 
        element={<TicketCreate/>} 
      />
      <Route 
        path="tickets/:ticketId" 
        element={<TicketDetail />} 
      />
      <Route 
        path="events/create" 
        element={<EventCreate />} 
      />
    </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  )
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(<App />);