import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../App'
import './Auth.css'

export default function Login() {
  const { handleLogin } = useApp()
  const nav = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        handleLogin(data)
        nav(data.user.role === 'admin' ? '/admin' : '/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your GolfHeart account.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="james@example.com" autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p className="form-switch">No account? <Link to="/signup">Create one</Link></p>
      </div>
    </main>
  )
}
