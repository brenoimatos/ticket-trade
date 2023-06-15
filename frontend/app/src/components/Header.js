// Header.js
import React from 'react'
import {
  NavLink,
  useActionData,
  useLoaderData,
  useFetcher,
} from 'react-router-dom'
import logoImage from '../assets/banca_logo.png' // Importe a imagem do logo
import { useState, useEffect } from 'react'
import { redirect } from 'react-router-dom'

// This is an assumed function which will need to be replaced with actual authentication check
const isUserAuthenticated = () => {
  // Replace this with your actual authentication check
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cookie-ticket'))
  console.log('cookie', cookie)
  return cookie ? true : false
}

function Header() {
  const fetcher = useFetcher()
  const cookieAuth = useLoaderData(isUserAuthenticated, [])

  const logout = async () => {
    // You may need to send a request to the server to invalidate the session/cookie here
    await fetcher.submit({ method: 'post', action: '/api/logout' })
    document.cookie =
      'cookie-ticket=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  return (
    <header style={{ backgroundColor: '#744ec2' }}>
      <nav className="navbar">
        <div className="logo-container">
          <NavLink to="/" className="logo-link">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </NavLink>
        </div>
        <div className="nav-links">
          {!cookieAuth && (
            <NavLink
              to="/login"
              className={(navData) => (navData.isActive ? 'active' : 'none')}
            >
              Login
            </NavLink>
          )}
          {cookieAuth && (
            <NavLink
              to="/login"
              className={(navData) => (navData.isActive ? 'active' : 'none')}
              onClick={logout}
            >
              Logout
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
