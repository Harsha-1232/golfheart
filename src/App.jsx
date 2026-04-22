import React, { useState, createContext, useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import Charities from './pages/Charities'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import WinnerVerify from './pages/WinnerVerify'

/* ── Global App Context ───────────────────────────────────── */
export const AppContext = createContext(null)

export function useApp() { return useContext(AppContext) }

const API_URL = 'http://localhost:5005/api'

export default function App() {
  const [token, setToken]               = useState(localStorage.getItem('token') || null)
  const [user, setUser]                 = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [isLoggedIn, setIsLoggedIn]     = useState(!!token)
  const [isAdmin, setIsAdmin]           = useState(user?.role === 'admin')
  const [scores, setScores]             = useState([])
  
  const [selectedCharity, setSelectedCharity] = useState(user?.selectedCharity || 'Green Earth Foundation')
  const [contribPct, setContribPct]     = useState(user?.contribPct || 15)
  const [plan, setPlan]                 = useState(user?.plan || 'yearly')
  const [drawPublished, setDrawPublished] = useState(false)
  const [verifications, setVerifications] = useState([
    { id: 1, user: 'James Murphy', draw: 'May 2025', match: '3-Match', amount: 1206.25, scores: [29,32,27], status: 'pending', file: 'golf_scores_may.png' },
    { id: 2, user: 'Sarah O\'Brien', draw: 'May 2025', match: '4-Match', amount: 3420.00, scores: [29,32,18,27], status: 'pending', file: 'sarah_scores.jpg' },
  ])

  // Fetch scores on login
  useEffect(() => {
    if (token) {
      fetchScores()
    } else {
      setScores([])
    }
  }, [token])

  const fetchScores = async () => {
    try {
      const res = await fetch(`${API_URL}/scores`, {
        headers: { 'x-auth-token': token }
      })
      const data = await res.json()
      if (res.ok) setScores(data)
    } catch (err) {
      console.error('Fetch scores error:', err)
    }
  }

  const handleLogin = (data) => {
    setToken(data.token)
    setUser(data.user)
    setIsLoggedIn(true)
    setIsAdmin(data.user.role === 'admin')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    setIsLoggedIn(false)
    setIsAdmin(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  /* score helpers */
  const addScore = async (date, val) => {
    try {
      const res = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ date, val })
      })
      const data = await res.json()
      if (!res.ok) return { error: data.message }
      fetchScores()
      return { ok: true }
    } catch (err) {
      return { error: 'Server error' }
    }
  }

  const deleteScore = async (id) => {
    try {
      const res = await fetch(`${API_URL}/scores/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      })
      if (res.ok) fetchScores()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const editScore = async (id, newVal) => {
    try {
      const res = await fetch(`${API_URL}/scores/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ val: newVal })
      })
      const data = await res.json()
      if (!res.ok) return { error: data.message }
      fetchScores()
      return { ok: true }
    } catch (err) {
      return { error: 'Server error' }
    }
  }

  /* verification helpers */
  const approveVerification = (id) =>
    setVerifications(v => v.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  const rejectVerification  = (id) =>
    setVerifications(v => v.map(x => x.id === id ? { ...x, status: 'rejected' } : x))

  const ctx = {
    isLoggedIn, setIsLoggedIn,
    isAdmin, setIsAdmin,
    user, handleLogin, handleLogout,
    scores, addScore, deleteScore, editScore,
    selectedCharity, setSelectedCharity,
    contribPct, setContribPct,
    plan, setPlan,
    drawPublished, setDrawPublished,
    verifications, approveVerification, rejectVerification,
  }

  return (
    <AppContext.Provider value={ctx}>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/how"        element={<HowItWorks />} />
        <Route path="/charities"  element={<Charities />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/dashboard"  element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/verify"     element={isLoggedIn ? <WinnerVerify /> : <Navigate to="/login" />} />
        <Route path="/admin"      element={isAdmin    ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </AppContext.Provider>
  )
}
