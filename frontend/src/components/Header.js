import React from 'react'
import { NavLink } from 'react-router-dom'
import logoImage from '../assets/banca_logo.png' // Importe a imagem do logo
import api from '../api'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getInitials } from '../utils'

// Avatar component
function Avatar({ fullName }) {
  const initials = getInitials(fullName)
  return (
    <NavLink to="/account" className="avatar">
      <div className="avatar-container">{initials}</div>
    </NavLink>
  )
}

function Header() {
  const [user, setUser] = useLocalStorage('user', null)

  const handleLogout = async () => {
    // You may need to send a request to the server to invalidate the session/cookie here
    await api.logout()
    setUser(null)
    console.log('Logout')
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
            <>
              <Avatar fullName={user.fullName} />
              <NavLink
                className={(navData) => (navData.isActive ? 'none' : 'none')}
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
