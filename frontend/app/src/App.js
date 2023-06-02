import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home'
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TicketsPage from './pages/Tickets';
import TicketSellPage from './pages/TicketSell';
import Layout from './components/Layout/Layout.js';



export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element = {<Layout/>}>
        <Route path='/' element = {<HomePage/>} />
        <Route path='/login' element = {<LoginPage/>} />
        <Route path='/register' element = {<RegisterPage/>} />
        <Route path='/ticket-sell' element = {<TicketSellPage/>} />
        <Route path='/tickets' element = {<TicketsPage/>} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
};