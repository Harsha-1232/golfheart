import React from 'react'
import './HowItWorks.css'

const STEPS = [
  { num:'01', icon:'⛳', color:'green', title:'Enter Your Scores', body:'Log your last 5 Stableford scores (1–45) with their dates. Only one score per date is allowed. A new score automatically replaces your oldest entry. Your rolling 5 form your draw entry.' },
  { num:'02', icon:'🎰', color:'orange', title:'Monthly Draw', body:'Each month, a draw takes place. Match 3, 4, or all 5 of your scores to the draw numbers to win your share of the prize pool. The jackpot rolls over if no 5-match winner is found.' },
  { num:'03', icon:'❤️', color:'blue', title:'Support a Charity', body:'A minimum 10% of your subscription goes directly to your chosen charity every month. You can increase your contribution at any time, or make an independent donation.' },
  { num:'04', icon:'🏆', color:'green', title:'Win & Verify', body:'Winners upload a screenshot from their golf platform as proof. Admin reviews and approves. Payment is tracked from Pending → Paid.' },
  { num:'05', icon:'📊', color:'orange', title:'Track Your Impact', body:'Your dashboard shows every draw you\'ve entered, your score history, winnings, and exactly how much you\'ve contributed to your chosen charity.' },
  { num:'06', icon:'🌍', color:'blue', title:'Grow the Community', body:'Every new member expands the prize pool and the charity fund. More members = bigger jackpots = bigger impact for causes that matter.' },
]

const RULES = [
  { title: 'Stableford Format', body: 'Scores must be between 1 and 45 points.' },
  { title: 'Rolling 5 Scores', body: 'Only your last 5 scores are kept. A new entry replaces the oldest automatically.' },
  { title: 'One Per Date', body: 'Only one score entry is permitted per date. Duplicate dates are not allowed — only editing or deletion of the existing entry.' },
  { title: 'Reverse Chronological', body: 'Scores are always displayed most recent first.' },
  { title: 'Draw Cadence', body: 'Draws are executed once per month. Admin controls the publishing of results.' },
  { title: 'Jackpot Rollover', body: 'If no 5-number match is found, the jackpot (40% pool) carries forward to the next month.' },
]

export default function HowItWorks() {
  return (
    <main className="how-page">
      <section className="section">
        <div className="section-label">The Process</div>
        <h1 className="section-title">How GolfHeart Works</h1>
        <p className="section-sub">Three simple actions. Real charitable impact. Monthly prizes.</p>
        <div className="steps-grid">
          {STEPS.map(s => (
            <div className="step-card" key={s.num}>
              <div className="step-bg-num">{s.num}</div>
              <div className={`step-icon ${s.color}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rules-section">
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Score Entry Rules</h2>
        <div className="rules-list">
          {RULES.map(r => (
            <div className="rule-item" key={r.title}>
              <div className="rule-title">{r.title}</div>
              <div className="rule-body">{r.body}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
