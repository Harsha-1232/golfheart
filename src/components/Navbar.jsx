import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import './Navbar.css'

export default function Navbar() {
  const { isLoggedIn, isAdmin, handleLogout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const onLogout = () => {
    handleLogout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        Golf<span>Heart</span>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/"          onClick={() => setMenuOpen(false)} end>Home</NavLink></li>
        <li><NavLink to="/charities" onClick={() => setMenuOpen(false)}>Charities</NavLink></li>
        <li><NavLink to="/how"       onClick={() => setMenuOpen(false)}>How It Works</NavLink></li>

        {isLoggedIn && (
          <li><NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
        )}
        {isAdmin && (
          <li><NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink></li>
        )}

        {!isLoggedIn ? (
          <>
            <li><NavLink to="/login"  onClick={() => setMenuOpen(false)}>Sign In</NavLink></li>
            <li>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className="nav-cta">
                Subscribe Now
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <button className="nav-logout" onClick={onLogout}>Log Out</button>
          </li>
        )}
      </ul>
    </nav>
  )
}
