import React from 'react'
import { useNavigate } from 'react-router-dom'
import Countdown from '../components/Countdown'
import './Home.css'

const CHARITIES = [
  { icon: '🌱', bg: 'linear-gradient(135deg,#1a3a1a,#0d2b1a)', name: 'Green Earth Foundation', featured: true, desc: 'Restoring native habitats through community-led conservation across the UK.', raised: '£4,200', event: '⛳ Golf Day — June 14, 2025' },
  { icon: '🧡', bg: 'linear-gradient(135deg,#1a1a3a,#0d0d2b)', name: 'Cancer Care Alliance', featured: false, desc: 'Supporting patients and families through cancer treatment with practical help.', raised: '£3,890', event: '⛳ Charity Round — July 5, 2025' },
  { icon: '🏠', bg: 'linear-gradient(135deg,#3a1a1a,#2b0d0d)', name: 'Shelter Ireland', featured: false, desc: 'Emergency housing and long-term support for families experiencing homelessness.', raised: '£4,010', event: '⛳ Fundraiser Open — Aug 2, 2025' },
]

export default function Home() {
  const nav = useNavigate()

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Monthly Draw · Charity Impact · Golf Performance
          </div>
          <h1 className="hero-title">
            Play Golf.<br /><em>Change Lives.</em><br />Win Big.
          </h1>
          <p className="hero-sub">
            Enter your Stableford scores, compete in monthly draws, and send
            meaningful support to the charities you care about — every single month.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => nav('/signup')}>Start Your Membership</button>
            <button className="btn-outline" onClick={() => nav('/how')}>See How It Works</button>
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="hstat-num">£48,200</div><div className="hstat-lbl">Prize Pool This Month</div></div>
            <div className="hstat"><div className="hstat-num">1,842</div><div className="hstat-lbl">Active Members</div></div>
            <div className="hstat"><div className="hstat-num">£12,100</div><div className="hstat-lbl">Donated to Charities</div></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <div className="pool-display">
              <div className="pool-label">Current Jackpot Pool</div>
              <div className="pool-amount">£19,280</div>
              <div className="pool-sub">5-number match · rolls over if unclaimed</div>
            </div>
            <Countdown />
            <div className="charity-strip">
              <div>
                <div className="cs-label">Charity Impact This Month</div>
                <div className="cs-sub">Donated across 3 causes</div>
              </div>
              <div className="cs-val">£12,100</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRIZES ── */}
      <section className="prizes-section">
        <div className="section-label">The Prize Structure</div>
        <h2 className="section-title">How Prizes Are Distributed</h2>
        <p className="section-sub">Every subscription contributes to the prize pool. Match your scores to win your share.</p>
        <div className="prizes-grid">
          <div className="prize-card jackpot">
            <div className="prize-match">5-Number Match</div>
            <div className="prize-name">Jackpot</div>
            <div className="prize-pct gold">40%</div>
            <div className="prize-desc">Of total prize pool · Splits among all 5-match winners</div>
            <span className="rollover-badge">↻ Rolls over if unclaimed</span>
          </div>
          <div className="prize-card">
            <div className="prize-match">4-Number Match</div>
            <div className="prize-name">Second Tier</div>
            <div className="prize-pct silver">35%</div>
            <div className="prize-desc">Of total prize pool · Split equally among winners</div>
          </div>
          <div className="prize-card">
            <div className="prize-match">3-Number Match</div>
            <div className="prize-name">Third Tier</div>
            <div className="prize-pct bronze">25%</div>
            <div className="prize-desc">Of total prize pool · Split equally among winners</div>
          </div>
        </div>
      </section>

      {/* ── CHARITIES ── */}
      <section className="section">
        <div className="section-label">Featured Causes</div>
        <h2 className="section-title">Charities You're Supporting</h2>
        <div className="charity-grid">
          {CHARITIES.map(c => (
            <div className="charity-card" key={c.name} onClick={() => nav('/charities')}>
              <div className="charity-img" style={{ background: c.bg }}>{c.icon}</div>
              <div className="charity-info">
                <div className="charity-name">
                  {c.name}
                  {c.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="charity-desc">{c.desc}</div>
                <div className="charity-raised">{c.raised} raised this month</div>
                <div className="charity-event">{c.event}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-outline" onClick={() => nav('/charities')}>View All Charities</button>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="plans-section">
        <div className="section-label">Membership Plans</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Choose Your Plan</h2>
        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-period">Monthly</div>
            <div className="plan-price">£9.99<span>/mo</span></div>
            <div className="plan-save-note" style={{ color: 'var(--muted)' }}>Flexible, cancel anytime</div>
            <ul className="plan-features">
              {['Full score tracking (5 rolling scores)', 'Monthly draw entry', 'Charity contribution (min 10%)', 'User dashboard access', 'Winner verification system'].map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="btn-outline plan-btn" onClick={() => nav('/signup')}>Get Started</button>
          </div>
          <div className="plan-card popular">
            <div className="popular-badge">Most Popular · Best Value</div>
            <div className="plan-period">Yearly</div>
            <div className="plan-price">£89.99<span>/yr</span></div>
            <div className="plan-save-note">Save £30 vs monthly billing</div>
            <ul className="plan-features">
              {['Everything in Monthly', 'Priority draw entry', 'Enhanced charity contributions', 'Annual performance report', 'Early access to new features'].map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="btn-primary plan-btn" onClick={() => nav('/signup')}>Subscribe Yearly</button>
          </div>
        </div>
      </section>
    </main>
  )
}
