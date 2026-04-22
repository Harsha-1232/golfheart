import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../App'
import './Auth.css'

const CHARITIES = ['Green Earth Foundation','Cancer Care Alliance','Shelter Ireland','Literacy Foundation','Mind Matters Ireland','Animal Rescue Network']

export default function Signup() {
  const { handleLogin } = useApp()
  const nav = useNavigate()

  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', charity: CHARITIES[0], contrib: 10, card:'', expiry:'', cvv:'' })
  const [activePlan, setActivePlan] = useState('yearly')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.includes('@')) e.email  = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.contrib < 10 || form.contrib > 100) e.contrib = 'Must be 10–100'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5005/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          plan: activePlan,
          selectedCharity: form.charity,
          contribPct: form.contrib
        })
      })
      const data = await res.json()
      if (res.ok) {
        handleLogin(data)
        nav('/dashboard')
      } else {
        setErrors({ server: data.message })
      }
    } catch (err) {
      setErrors({ server: 'Connection error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-sub">Join 1,842 members playing golf and changing lives.</p>

        <div className="plan-toggle">
          <button className={`ptbtn ${activePlan==='monthly'?'active':''}`} onClick={() => setActivePlan('monthly')}>Monthly · £9.99/mo</button>
          <button className={`ptbtn ${activePlan==='yearly' ?'active':''}`} onClick={() => setActivePlan('yearly') }>Yearly · £89.99/yr · Save £30</button>
        </div>

        {errors.server && <div className="auth-error" style={{ marginBottom:'1rem', color:'var(--danger)', fontSize:'0.9rem', textAlign:'center' }}>{errors.server}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input value={form.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="James" />
              {errors.firstName && <span className="err">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input value={form.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Murphy" />
              {errors.lastName && <span className="err">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="james@example.com" />
            {errors.email && <span className="err">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min 6 characters" />
            {errors.password && <span className="err">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Select Your Charity</label>
            <select value={form.charity} onChange={e=>set('charity',e.target.value)}>
              {CHARITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Charity Contribution % <span className="label-note">(min 10%)</span></label>
            <input type="number" value={form.contrib} onChange={e=>set('contrib',Number(e.target.value))} min="10" max="100" />
            {errors.contrib && <span className="err">{errors.contrib}</span>}
            <span className="field-note">Min 10% of your subscription goes to your chosen charity.</span>
          </div>

          <div className="form-group">
            <label>Card Number <span className="label-note">(Stripe / PCI compliant)</span></label>
            <input value={form.card} onChange={e=>set('card',e.target.value)} placeholder="•••• •••• •••• ••••" maxLength={19} />
            {errors.card && <span className="err">{errors.card}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry</label>
              <input value={form.expiry} onChange={e=>set('expiry',e.target.value)} placeholder="MM / YY" maxLength={7} />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input value={form.cvv} onChange={e=>set('cvv',e.target.value)} placeholder="•••" maxLength={4} />
            </div>
          </div>

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account & Subscribe'}
          </button>
        </form>

        <p className="form-switch">Already a member? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  )
}
