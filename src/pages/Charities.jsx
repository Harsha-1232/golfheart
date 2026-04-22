import React, { useState } from 'react'
import { useApp } from '../App'
import './Charities.css'

const ALL_CHARITIES = [
  { icon:'🌱', bg:'linear-gradient(135deg,#1a3a1a,#0d2b1a)', name:'Green Earth Foundation', category:'Environment', desc:'Restoring native habitats and biodiversity through community-led conservation projects across the UK and Ireland.', raised:'£4,200', event:'⛳ Golf Day — June 14, 2025 · Carton House', featured:true },
  { icon:'🧡', bg:'linear-gradient(135deg,#1a1a3a,#0d0d2b)', name:'Cancer Care Alliance', category:'Health', desc:'Supporting patients and families through cancer treatment with practical support, counselling, and wellbeing programs.', raised:'£3,890', event:'⛳ Charity Round — July 5, 2025 · K Club', featured:false },
  { icon:'🏠', bg:'linear-gradient(135deg,#3a1a1a,#2b0d0d)', name:'Shelter Ireland', category:'Housing', desc:'Emergency housing and long-term support for families experiencing homelessness across Ireland.', raised:'£4,010', event:'⛳ Fundraiser Open — Aug 2, 2025 · Portmarnock', featured:false },
  { icon:'📚', bg:'linear-gradient(135deg,#1a2a3a,#0d1b2b)', name:'Literacy Foundation', category:'Education', desc:'Helping adults and children gain the literacy skills needed to thrive in modern society.', raised:'£2,100', event:'⛳ Sponsored Walk — Sept 10, 2025', featured:false },
  { icon:'🧠', bg:'linear-gradient(135deg,#2a1a3a,#1b0d2b)', name:'Mind Matters Ireland', category:'Health', desc:'Providing accessible mental health resources, helplines, and community support groups nationwide.', raised:'£3,400', event:'⛳ Mental Health Golf Classic — Oct 3, 2025', featured:false },
  { icon:'🐾', bg:'linear-gradient(135deg,#3a2a1a,#2b1b0d)', name:'Animal Rescue Network', category:'Environment', desc:'Rescuing, rehabilitating, and rehoming animals across the island of Ireland.', raised:'£1,700', event:'⛳ Paws & Putts — Nov 8, 2025', featured:false },
]

const CATEGORIES = ['All', 'Environment', 'Health', 'Housing', 'Education']
const DONATE_AMOUNTS = [5, 10, 25, 50, 100]

export default function Charities() {
  const { setSelectedCharity, isLoggedIn } = useApp()
  const [filter,  setFilter]  = useState('All')
  const [donated, setDonated] = useState(null)
  const [donateAmt, setDonateAmt] = useState(25)
  const [customAmt, setCustomAmt] = useState('')
  const [selectMsg, setSelectMsg] = useState('')

  const visible = filter === 'All' ? ALL_CHARITIES : ALL_CHARITIES.filter(c => c.category === filter)

  const handleSelect = (name) => {
    setSelectedCharity(name)
    setSelectMsg(`✓ ${name} set as your charity!`)
    setTimeout(() => setSelectMsg(''), 3000)
  }

  const handleDonate = () => {
    const amt = customAmt ? parseInt(customAmt) : donateAmt
    setDonated(amt)
    setTimeout(() => setDonated(null), 4000)
  }

  return (
    <main className="charities-page">
      <section className="section">
        <div className="section-label">Our Charity Partners</div>
        <h1 className="section-title">Make Every Swing Count</h1>
        <p className="section-sub" style={{ marginBottom: '2rem' }}>Choose a cause you believe in. Your subscription actively funds it every month.</p>

        {selectMsg && <div className="select-toast">{selectMsg}</div>}

        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="charities-grid">
          {visible.map(c => (
            <div className="charity-full-card" key={c.name}>
              <div className="cfc-img" style={{ background: c.bg }}>{c.icon}</div>
              <div className="cfc-body">
                <div className="cfc-name">
                  {c.name}
                  {c.featured && <span className="featured-badge">Featured</span>}
                  <span className="cat-badge">{c.category}</span>
                </div>
                <p className="cfc-desc">{c.desc}</p>
                <div className="cfc-raised">{c.raised} raised this month</div>
                <div className="cfc-event">{c.event}</div>
                {isLoggedIn && (
                  <button className="btn-primary cfc-btn" onClick={() => handleSelect(c.name)}>
                    Select This Charity
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Independent donation */}
        <div className="donate-box">
          <h3 className="donate-title">Make an Independent Donation</h3>
          <p className="donate-sub">Not a subscriber? You can still donate directly to any of our charity partners.</p>

          {donated ? (
            <div className="donate-success">🎉 Thank you! Your £{donated} donation has been received.</div>
          ) : (
            <>
              <div className="donate-amounts">
                {DONATE_AMOUNTS.map(a => (
                  <button
                    key={a}
                    className={`donate-amt-btn ${donateAmt === a && !customAmt ? 'active' : ''}`}
                    onClick={() => { setDonateAmt(a); setCustomAmt('') }}
                  >£{a}</button>
                ))}
                <input
                  type="number"
                  placeholder="Custom £"
                  value={customAmt}
                  onChange={e => setCustomAmt(e.target.value)}
                  className="donate-custom"
                  min="1"
                />
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '1rem' }} onClick={handleDonate}>
                Donate £{customAmt || donateAmt} Now
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
