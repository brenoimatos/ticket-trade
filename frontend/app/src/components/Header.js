// Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../assets/banca_logo.png'; // Importe a imagem do logo

function Header() {
  return (
    <header style={{ backgroundColor: '#744ec2' }}>
      <nav className="navbar">
        <div className="logo-container">
          <NavLink exact to="/" activeClassName="active" className="logo-link">
            <img src={logoImage} alt="Logo" className="logo-image" />
          </NavLink>
        </div>
        <div className="nav-links">
          <NavLink to="/login" activeClassName="active" className="nav-link">
            Login
          </NavLink>
          {/* Adicione outros links conforme necessário */}
        </div>
      </nav>
    </header>
  );
}

export default Header;
