import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import './Dashboard.css'

const DRAW_NUMBERS = [29, 32, 18, 41, 27]

const CHARITIES_LIST = [
  'Green Earth Foundation',
  'Cancer Care Alliance',
  'Shelter Ireland',
  'Literacy Foundation',
  'Mind Matters Ireland',
  'Animal Rescue Network',
]

const DRAW_HISTORY = [
  { month: 'April 2025',    match: '3-Match',  amount: 980, status: 'paid' },
  { month: 'March 2025',    match: 'No Match', amount: 0,   status: 'loss' },
  { month: 'February 2025', match: 'No Match', amount: 0,   status: 'loss' },
]

export default function Dashboard() {
  const nav = useNavigate()
  const {
    user, handleLogout,
    scores, addScore, deleteScore, editScore,
    selectedCharity, setSelectedCharity,
    contribPct, setContribPct,
    plan, setPlan,
  } = useApp()

  /* score form */
  const [newDate, setNewDate]       = useState('')
  const [newVal,  setNewVal]        = useState('')
  const [scoreMsg, setScoreMsg]     = useState({ text: '', type: '' })

  /* edit modal */
  const [editingId, setEditingId]         = useState(null)
  const [editingDate, setEditingDate]     = useState('')
  const [editVal, setEditVal]             = useState('')

  /* plan / cancel modals */
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)

  /* profile */
  const [profileSaved, setProfileSaved]   = useState(false)

  const safeScores = scores || []
  const sortedScores = [...safeScores].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '')
  )

  /* ── flash message ── */
  const flash = (text, type) => {
    setScoreMsg({ text, type })
    setTimeout(() => setScoreMsg({ text: '', type: '' }), 3000)
  }

  /* ── score actions ── */
  const handleAddScore = async () => {
    if (!newDate) { flash('Please enter a date.', 'error'); return }
    const v = parseInt(newVal)
    if (isNaN(v) || v < 1 || v > 45) { flash('Score must be between 1 and 45.', 'error'); return }
    const result = await addScore(newDate, v)
    if (result?.error) { flash(result.error, 'error'); return }
    setNewDate(''); setNewVal('')
    flash('Score added successfully!', 'ok')
  }

  const handleDelete = (id) => {
    deleteScore(id)
    flash('Score deleted.', 'ok')
  }

  const openEdit = (s) => {
    setEditingId(s._id)
    setEditingDate(s.date)
    setEditVal(String(s.val))
  }

  const handleEditSave = async () => {
    const v = parseInt(editVal)
    if (isNaN(v) || v < 1 || v > 45) { flash('Score must be between 1 and 45.', 'error'); return }
    const result = await editScore(editingId, v)
    if (result?.error) { flash(result.error, 'error'); return }
    setEditingId(null)
    flash('Score updated.', 'ok')
  }

  /* ── draw matching ── */
  const userScoreVals = safeScores.map(s => s.val)
  const matchCount    = DRAW_NUMBERS.filter(n => userScoreVals.includes(n)).length
  const matchLabel    = matchCount >= 5 ? '🎉 5-Number Match — JACKPOT!' :
                        matchCount === 4 ? '🏆 4-Number Match — £3,420 won!' :
                        matchCount === 3 ? '🥉 3-Number Match — £1,206 won!' :
                        'No match this month'
  const matchClass    = matchCount >= 3 ? 'win' : 'loss'

  /* ── pool calcs ── */
  const totalPool = 48200
  const pool5 = (totalPool * 0.40).toFixed(2)
  const pool4 = (totalPool * 0.35).toFixed(2)
  const pool3 = (totalPool * 0.25).toFixed(2)

  /* ── charity contrib ── */
  const userPlan    = plan || 'yearly'
  const annualFee   = userPlan === 'yearly' ? 89.99 : 119.88
  const userContrib = contribPct || 10
  const contribAmt  = ((annualFee * userContrib) / 100).toFixed(2)
  const userSelectedCharity = selectedCharity || 'Green Earth Foundation'

  return (
    <main className="dashboard">
      {/* ── HEADER ── */}
      <div className="dash-header">
        <div>
          <div className="welcome-name">Good morning, {user?.name?.split(' ')[0] || 'Member'} 👋</div>
          <div className="welcome-sub">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'Today'} · {userPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan
          </div>
        </div>
        <div className="dash-header-right">
          <div className="sub-badge">
            <span className="sub-dot" />
            Active · Renews {userPlan === 'yearly' ? '2026' : 'next month'}
          </div>
          <button className="btn-logout" onClick={() => { handleLogout(); nav('/') }}>Logout</button>
        </div>
      </div>

      <div className="dash-grid">
        {/* ══ LEFT COLUMN ══ */}
        <div className="dash-left">

          {/* SCORES CARD */}
          <div className="card">
            <div className="card-title">My Golf Scores — Stableford (Last 5)</div>

            <div className="score-entry-row">
              <div className="score-input-wrap">
                <label>Date</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="score-input-wrap score-val-wrap">
                <label>Score (1–45)</label>
                <input type="number" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="32" min="1" max="45" />
              </div>
              <button className="btn-add" onClick={handleAddScore}>+ Add</button>
            </div>

            {scoreMsg.text && (
              <div className={`score-msg ${scoreMsg.type}`}>{scoreMsg.text}</div>
            )}

            {sortedScores.length === 0 && (
              <p className="no-scores">No scores yet. Add your first Stableford score above.</p>
            )}

            <div className="scores-list">
              {sortedScores.map(s => (
                <div className="score-item" key={s._id}>
                  <span className="score-date">{s.date}</span>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{ width: `${Math.round((s.val / 45) * 100)}%` }} />
                  </div>
                  <span className="score-num">{s.val}</span>
                  <div className="score-actions">
                    <button className="score-btn" onClick={() => openEdit(s)}>Edit</button>
                    <button className="score-btn danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="score-limit-note">
              {safeScores.length >= 5
                ? '✓ 5 scores stored. Your draw entry is complete.'
                : `${safeScores.length}/5 scores. Add ${5 - safeScores.length} more to complete your draw entry.`}
            </div>
          </div>

          {/* DRAW CARD */}
          <div className="card">
            <div className="card-title">Draw Participation — May 2025</div>
            <p className="draw-sub">Your scores vs this month's draw numbers. Matched numbers are highlighted.</p>

            <div className="draw-nums-row">
              {DRAW_NUMBERS.map(n => (
                <div key={n} className={`draw-ball ${userScoreVals.includes(n) ? 'match' : 'nomatch'}`}>{n}</div>
              ))}
            </div>

            <div className={`draw-result ${matchClass}`}>{matchLabel}</div>

            <div className="pool-tiers">
              <div className="tier-box gold"><div className="tier-lbl">5-Match (40%)</div><div className="tier-val">£{pool5}</div></div>
              <div className="tier-box silver"><div className="tier-lbl">4-Match (35%)</div><div className="tier-val">£{pool4}</div></div>
              <div className="tier-box bronze"><div className="tier-lbl">3-Match (25%)</div><div className="tier-val">£{pool3}</div></div>
            </div>

            <div className="draw-history">
              <div className="history-label">Previous Draws</div>
              {DRAW_HISTORY.map(d => (
                <div className="history-item" key={d.month}>
                  <span className="hist-month">{d.month}</span>
                  <span className={`hist-result ${d.status}`}>
                    {d.match}{d.amount > 0 ? ` · £${d.amount}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SUBSCRIPTION CARD */}
          <div className="card">
            <div className="card-title">Subscription &amp; Payment</div>
            <div className="stat-row">
              <div className="stat-box">
                <div className="stat-val accent">{userPlan === 'yearly' ? 'Yearly' : 'Monthly'}</div>
                <div className="stat-lbl">Current Plan</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{userPlan === 'yearly' ? 'Mar 2026' : 'May 2025'}</div>
                <div className="stat-lbl">Renewal Date</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">{userPlan === 'yearly' ? '£89.99' : '£9.99'}</div>
                <div className="stat-lbl">{userPlan === 'yearly' ? 'Annual' : 'Monthly'} Fee</div>
              </div>
            </div>
            <div className="sub-actions">
              <button className="btn-outline sub-btn" onClick={() => setShowPlanModal(true)}>Change Plan</button>
              <button className="btn-danger-outline sub-btn" onClick={() => setCancelConfirm(true)}>Cancel Subscription</button>
            </div>
            {cancelConfirm && (
              <div className="confirm-banner">
                <span>Are you sure? You'll lose draw access immediately.</span>
                <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                  <button className="btn-danger-outline sub-btn" onClick={() => setCancelConfirm(false)}>Yes, Cancel</button>
                  <button className="btn-outline sub-btn" onClick={() => setCancelConfirm(false)}>Keep Membership</button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="dash-right">

          {/* CHARITY WIDGET */}
          <div className="card">
            <div className="card-title">My Charity</div>
            <div className="charity-list">
              {CHARITIES_LIST.map(c => (
                <div
                  key={c}
                  className={`charity-opt ${userSelectedCharity === c ? 'selected' : ''}`}
                  onClick={() => setSelectedCharity(c)}
                >
                  <div>
                    <div className="co-name">{c}</div>
                  </div>
                  <div className={`co-check ${userSelectedCharity === c ? 'checked' : ''}`}>
                    {userSelectedCharity === c ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="contrib-block">
              <div className="contrib-row">
                <span className="contrib-lbl">Contribution %</span>
                <strong className="contrib-val">{userContrib}%</strong>
              </div>
              <input
                type="range"
                min="10" max="100"
                value={userContrib}
                onChange={e => setContribPct(Number(e.target.value))}
              />
              <div className="contrib-note">
                Min 10% · You're contributing £{contribAmt}/yr to {userSelectedCharity}
              </div>
            </div>

            <div className="charity-total-box">
              <div className="ct-label">Total donated this year</div>
              <div className="ct-val">£{contribAmt}</div>
            </div>
          </div>

          {/* WINNINGS CARD */}
          <div className="card">
            <div className="card-title">My Winnings</div>

            <div className="winning-item">
              <div>
                <div className="wi-name">May 2025 · 3-Match</div>
                <div className="wi-sub">Verification pending</div>
              </div>
              <div className="wi-right">
                <div className="wi-amount">£1,206</div>
                <span className="badge badge-pending">Pending</span>
              </div>
            </div>

            <div className="winning-item">
              <div>
                <div className="wi-name">April 2025 · 3-Match</div>
                <div className="wi-sub">Verified &amp; paid</div>
              </div>
              <div className="wi-right">
                <div className="wi-amount">£980</div>
                <span className="badge badge-paid">Paid</span>
              </div>
            </div>

            <div className="total-won-row">
              <span className="tw-label">Total Won</span>
              <span className="tw-val">£2,186</span>
            </div>

            <button
              className="btn-primary"
              style={{ width:'100%', padding:'10px', fontSize:'0.85rem', marginTop:'0.75rem' }}
              onClick={() => nav('/verify')}
            >
              Upload Win Proof
            </button>
          </div>

          {/* PROFILE CARD */}
          <div className="card">
            <div className="card-title">Profile Settings</div>
            <div className="form-group-dash">
              <label>Display Name</label>
              <input value={user?.name || ''} readOnly />
            </div>
            <div className="form-group-dash">
              <label>Email</label>
              <input type="email" value={user?.email || ''} readOnly />
            </div>
            <p style={{ fontSize:'0.7rem', color:'var(--muted)' }}>Contact support to change verified profile details.</p>
          </div>

        </div>
      </div>

      {/* ── EDIT SCORE MODAL ── */}
      {editingId && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Edit Score for {editingDate}</h3>
            <div className="form-group-dash" style={{ marginBottom:'1rem' }}>
              <label>New Score (1–45)</label>
              <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)} min="1" max="45" autoFocus />
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button className="btn-primary" style={{ flex:1, padding:'10px' }} onClick={handleEditSave}>Save</button>
              <button className="btn-outline"  style={{ flex:1, padding:'10px' }} onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PLAN MODAL ── */}
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Change Plan</h3>
            <div className="plan-opts">
              {['monthly','yearly'].map(p => (
                <div
                  key={p}
                  className={`plan-opt ${userPlan === p ? 'selected' : ''}`}
                  onClick={() => { setPlan(p); setShowPlanModal(false) }}
                >
                  <div className="po-name">{p === 'monthly' ? 'Monthly' : 'Yearly'}</div>
                  <div className="po-price">{p === 'monthly' ? '£9.99/mo' : '£89.99/yr'}</div>
                  {p === 'yearly' && <span className="po-save">Save £30</span>}
                </div>
              ))}
            </div>
            <button className="btn-outline" style={{ width:'100%', padding:'10px', marginTop:'1rem' }} onClick={() => setShowPlanModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  )
}
