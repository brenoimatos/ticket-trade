// Header.js
import React from 'react'
import { NavLink } from 'react-router-dom'
import logoImage from '../assets/banca_logo.png' // Importe a imagem do logo
import { useAuth } from '../hooks/useAuth'
import { logout as logoutApi } from '../api/auth'

function Header() {
  const { user, logout } = useAuth()
  console.log('HeaderUser', user)

  const handleLogout = async () => {
    // You may need to send a request to the server to invalidate the session/cookie here
    const data = await logoutApi()
    console.log('data logout', data)
    logout()
    return null
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
          {!user && (
            <NavLink
              to="/login"
              className={(navData) => (navData.isActive ? 'active' : 'none')}
            >
              Login
            </NavLink>
          )}
          {user && (
            <NavLink
              className={(navData) => (navData.isActive ? 'none' : 'none')}
              onClick={handleLogout}
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
