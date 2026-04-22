import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import './AdminPanel.css'

const SECTIONS = [
  { id: 'overview',  label: 'Overview',    icon: '📊' },
  { id: 'users',     label: 'Users',       icon: '👥' },
  { id: 'draw',      label: 'Draw Engine', icon: '🎰' },
  { id: 'charities', label: 'Charities',   icon: '❤️' },
  { id: 'winners',   label: 'Winners',     icon: '🏆' },
  { id: 'reports',   label: 'Reports',     icon: '📈' },
]

const TOTAL_POOL  = 48200
const SUBSCRIBERS = 1842

const CHARITIES_DATA = [
  { name: 'Green Earth Foundation', category: 'Environment',   members: 612, raised: '£4,200' },
  { name: 'Cancer Care Alliance',   category: 'Health',        members: 491, raised: '£3,890' },
  { name: 'Shelter Ireland',        category: 'Housing',       members: 438, raised: '£4,010' },
  { name: 'Literacy Foundation',    category: 'Education',     members: 201, raised: '£2,100' },
  { name: 'Mind Matters Ireland',   category: 'Mental Health', members: 280, raised: '£3,400' },
]

export default function AdminPanel() {
  const nav = useNavigate()
  const { verifications, approveVerification, rejectVerification } = useApp()

  const [activeSection, setActiveSection] = useState('overview')

  /* draw engine */
  const [drawLogic,  setDrawLogic]  = useState('random')
  const [drawMonth,  setDrawMonth]  = useState('2025-05')
  const [simNums,    setSimNums]    = useState([])
  const [simRan,     setSimRan]     = useState(false)
  const [published,  setPublished]  = useState(false)

  /* charities */
  const [charities,       setCharities]       = useState(CHARITIES_DATA)
  const [showAddCharity,  setShowAddCharity]  = useState(false)
  const [newCharity,      setNewCharity]      = useState({ name: '', category: 'Environment' })

  /* users */
  const [userSearch, setUserSearch] = useState('')
  const [users,      setUsers]      = useState([])

  React.useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch('http://localhost:5005/api/admin/users', {
        headers: { 'x-auth-token': token }
      })
      const data = await res.json()
      if (res.ok) setUsers(data)
    } catch (err) {
      console.error('Fetch users error:', err)
    }
  }

  const filteredUsers = users.filter(u =>
    (u.name  || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  )

  const pool5 = (TOTAL_POOL * 0.40).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
  const pool4 = (TOTAL_POOL * 0.35).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
  const pool3 = (TOTAL_POOL * 0.25).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

  const runSim = () => {
    const nums = []
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1
      if (!nums.includes(n)) nums.push(n)
    }
    setSimNums(nums)
    setSimRan(true)
    setPublished(false)
  }

  const publishDraw = async () => {
    if (!simNums.length) return alert('Run a simulation first.')
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch('http://localhost:5005/api/admin/publish-draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ month: drawMonth, numbers: simNums, totalPool: TOTAL_POOL })
      })
      const data = await res.json()
      if (res.ok) { setPublished(true); alert(data.message) }
      else alert(data.message)
    } catch { alert('Connection error') }
  }

  const addCharity = () => {
    if (!newCharity.name.trim()) return
    setCharities(c => [...c, { ...newCharity, members: 0, raised: '£0' }])
    setNewCharity({ name: '', category: 'Environment' })
    setShowAddCharity(false)
  }

  const deleteCharity = (name) => setCharities(c => c.filter(x => x.name !== name))

  const pendingVerifs  = (verifications || []).filter(v => v.status === 'pending')
  const resolvedVerifs = (verifications || []).filter(v => v.status !== 'pending')

  return (
    <main className="ap-page">

      {/* ── SIDEBAR ── */}
      <aside className="ap-sidebar">
        <div className="ap-sidebar-brand">Admin Panel</div>

        <nav className="ap-nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`ap-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="ap-nav-icon">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-footer">
          <button className="ap-nav-item ap-nav-user" onClick={() => nav('/dashboard')}>
            <span className="ap-nav-icon">👤</span>
            <span>User View</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="ap-content">

        {/* ════ OVERVIEW ════ */}
        {activeSection === 'overview' && (
          <div>
            <h1 className="ap-page-title">Overview</h1>

            <div className="ap-stats-row">
              {[
                { label: 'Total Users',            val: SUBSCRIBERS.toLocaleString() },
                { label: 'Total Prize Pool',        val: `£${TOTAL_POOL.toLocaleString()}` },
                { label: 'Charity Contributions',   val: '£12,100' },
                { label: 'Pending Verifications',   val: pendingVerifs.length },
              ].map(s => (
                <div className="ap-stat-card" key={s.label}>
                  <div className="ap-stat-val">{s.val}</div>
                  <div className="ap-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="ap-two-col">
              <div className="ap-card">
                <div className="ap-card-title">Prize Pool Breakdown</div>
                <div className="ap-tier-grid">
                  <div className="ap-tier gold">
                    <div className="ap-tier-lbl">5-Match · 40%</div>
                    <div className="ap-tier-val">{pool5}</div>
                  </div>
                  <div className="ap-tier silver">
                    <div className="ap-tier-lbl">4-Match · 35%</div>
                    <div className="ap-tier-val">{pool4}</div>
                  </div>
                  <div className="ap-tier bronze">
                    <div className="ap-tier-lbl">3-Match · 25%</div>
                    <div className="ap-tier-val">{pool3}</div>
                  </div>
                </div>
                <div className="ap-note">Based on {SUBSCRIBERS.toLocaleString()} active subscribers · £{TOTAL_POOL.toLocaleString()} total pool</div>
              </div>

              <div className="ap-card">
                <div className="ap-card-title">Subscription Split</div>
                <div className="ap-split-list">
                  <div className="ap-split-row"><span>Yearly Plan</span><span className="badge badge-yearly">1,104 members</span></div>
                  <div className="ap-split-row"><span>Monthly Plan</span><span className="badge badge-monthly">738 members</span></div>
                  <div className="ap-split-row ap-split-muted"><span>Lapsed</span><span>43</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ USERS ════ */}
        {activeSection === 'users' && (
          <div>
            <h1 className="ap-page-title">User Management</h1>
            <input
              className="ap-search"
              type="text"
              placeholder="🔍  Search by name or email…"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
            />
            <div className="ap-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Plan</th><th>Role</th><th>Charity</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No users found</td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u._id || u.email}>
                      <td className="ap-td-name">{u.name}</td>
                      <td className="ap-td-muted">{u.email}</td>
                      <td><span className={`badge badge-${u.plan || 'monthly'}`}>{u.plan || 'monthly'}</span></td>
                      <td><span className="badge badge-active">{u.role}</span></td>
                      <td className="ap-td-muted">{u.selectedCharity || '—'}</td>
                      <td>
                        <button className="ap-action-btn">Edit</button>
                        <button className="ap-action-btn">Scores</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ap-table-footer">Showing {filteredUsers.length} of {users.length} users</div>
          </div>
        )}

        {/* ════ DRAW ENGINE ════ */}
        {activeSection === 'draw' && (
          <div>
            <h1 className="ap-page-title">Draw Engine</h1>

            <div className="ap-two-col">
              {/* Config Card */}
              <div className="ap-card">
                <div className="ap-card-title">Draw Logic</div>

                {[
                  { val: 'random',    label: 'Random Generation', desc: 'Lottery-style random draw' },
                  { val: 'algorithm', label: 'Algorithmic',       desc: 'Weighted by score frequency' },
                ].map(o => (
                  <div
                    key={o.val}
                    className={`ap-logic-opt ${drawLogic === o.val ? 'selected' : ''}`}
                    onClick={() => setDrawLogic(o.val)}
                  >
                    <div className={`ap-radio ${drawLogic === o.val ? 'checked' : ''}`} />
                    <div>
                      <div className="ap-logic-label">{o.label}</div>
                      <div className="ap-logic-desc">{o.desc}</div>
                    </div>
                  </div>
                ))}

                <div className="ap-field" style={{ marginTop: '1.5rem' }}>
                  <label className="ap-label">Draw Month</label>
                  <input type="month" value={drawMonth} onChange={e => setDrawMonth(e.target.value)} style={{ maxWidth: '200px' }} />
                </div>
              </div>

              {/* Simulation Card */}
              <div className="ap-card">
                <div className="ap-card-title">Simulation Mode</div>
                <p className="ap-card-desc">Run a test draw before publishing to all members. Results stay hidden until you publish.</p>

                <button className="ap-btn-sim" onClick={runSim}>▶&nbsp; Run Simulation</button>

                {simRan && (
                  <div className="ap-sim-result">
                    <div className="ap-sim-lbl">Simulated Draw Numbers</div>
                    <div className="ap-balls">
                      {simNums.map(n => <div className="ap-ball" key={n}>{n}</div>)}
                    </div>
                    <div className="ap-sim-note">Simulation only — not visible to users</div>
                  </div>
                )}
              </div>
            </div>

            {/* Publish Box */}
            <div className="ap-publish-box">
              <div className="ap-publish-left">
                <div className="ap-publish-title">Publish Official Draw Results</div>
                <p className="ap-publish-desc">This will notify all members, calculate matches, and trigger the winner verification flow. This action cannot be undone.</p>
              </div>
              <button className="ap-btn-publish" onClick={publishDraw} disabled={published}>
                {published ? '✓ Published' : `Publish ${drawMonth} Draw`}
              </button>
            </div>

            {published && (
              <div className="ap-publish-confirm">
                ✓ Draw published successfully. Winners have been notified. Jackpot rolled over (no 5-match winner).
              </div>
            )}

            {/* Jackpot Status */}
            <div className="ap-card" style={{ marginTop: '1.5rem' }}>
              <div className="ap-card-title">Jackpot Status</div>
              <div className="ap-jackpot-row">
                <div>
                  <div className="ap-jackpot-lbl">Current Jackpot Pool (5-Match)</div>
                  <div className="ap-jackpot-val">£19,280</div>
                </div>
                <div>
                  <div className="ap-jackpot-lbl">Rollover Status</div>
                  <span className="badge badge-pending" style={{ fontSize: '0.82rem', padding: '6px 16px' }}>Rolled Over ×2</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ CHARITIES ════ */}
        {activeSection === 'charities' && (
          <div>
            <div className="ap-page-header">
              <h1 className="ap-page-title" style={{ marginBottom: 0 }}>Charity Management</h1>
              <button className="ap-btn-primary" onClick={() => setShowAddCharity(true)}>+ Add Charity</button>
            </div>

            {showAddCharity && (
              <div className="ap-card" style={{ marginBottom: '1.5rem' }}>
                <div className="ap-card-title">New Charity</div>
                <div className="ap-two-col-sm">
                  <div className="ap-field">
                    <label className="ap-label">Name</label>
                    <input value={newCharity.name} onChange={e => setNewCharity(c => ({ ...c, name: e.target.value }))} placeholder="Charity name" />
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Category</label>
                    <select value={newCharity.category} onChange={e => setNewCharity(c => ({ ...c, category: e.target.value }))}>
                      {['Environment','Health','Housing','Education','Mental Health','Other'].map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <button className="ap-btn-primary" onClick={addCharity}>Add Charity</button>
                  <button className="ap-btn-outline" onClick={() => setShowAddCharity(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="ap-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ap-table">
                <thead>
                  <tr><th>Name</th><th>Category</th><th>Members</th><th>Raised</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {charities.map(c => (
                    <tr key={c.name}>
                      <td className="ap-td-name">{c.name}</td>
                      <td className="ap-td-muted">{c.category}</td>
                      <td>{c.members.toLocaleString()}</td>
                      <td className="ap-td-success">{c.raised}</td>
                      <td><span className="badge badge-active">Active</span></td>
                      <td>
                        <button className="ap-action-btn">Edit</button>
                        <button className="ap-action-btn">Media</button>
                        <button className="ap-action-btn danger" onClick={() => deleteCharity(c.name)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ WINNERS ════ */}
        {activeSection === 'winners' && (
          <div>
            <h1 className="ap-page-title">Winner Verification</h1>

            <div className="ap-badges-row">
              <span className="badge badge-pending" style={{ padding: '6px 16px' }}>{pendingVerifs.length} Pending</span>
              <span className="badge badge-verified" style={{ padding: '6px 16px' }}>128 Verified</span>
              <span className="badge badge-active"   style={{ padding: '6px 16px' }}>112 Paid</span>
            </div>

            {pendingVerifs.length === 0 && (
              <div className="ap-card" style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
                ✓ No pending verifications at this time.
              </div>
            )}

            {pendingVerifs.map(v => (
              <div className="ap-card ap-verify-card" key={v.id}>
                <div className="ap-vc-header">
                  <div>
                    <div className="ap-vc-user">{v.user}</div>
                    <div className="ap-vc-draw">{v.draw} · {v.match} · £{v.amount?.toFixed(2)}</div>
                  </div>
                  <span className="badge badge-pending">Pending Review</span>
                </div>
                <div className="ap-vc-label">Claimed matching scores:</div>
                <div className="ap-vc-scores">
                  {v.scores.map(s => <div className="ap-vc-pill" key={s}>{s}</div>)}
                </div>
                <div className="ap-vc-file">📎 Screenshot: {v.file}</div>
                <div className="ap-vc-actions">
                  <button className="ap-btn-approve" onClick={() => approveVerification(v.id)}>✓ Approve &amp; Trigger Payment</button>
                  <button className="ap-btn-reject"  onClick={() => rejectVerification(v.id)}>✗ Reject</button>
                </div>
              </div>
            ))}

            {resolvedVerifs.length > 0 && (
              <>
                <h3 className="ap-section-heading">Resolved</h3>
                <div className="ap-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table className="ap-table">
                    <thead><tr><th>Winner</th><th>Draw</th><th>Match</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {resolvedVerifs.map(v => (
                        <tr key={v.id}>
                          <td>{v.user}</td>
                          <td className="ap-td-muted">{v.draw}</td>
                          <td>{v.match}</td>
                          <td className="ap-td-success">£{v.amount?.toFixed(2)}</td>
                          <td><span className={`badge ${v.status === 'approved' ? 'badge-active' : 'badge-inactive'}`}>{v.status === 'approved' ? 'Approved' : 'Rejected'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <h3 className="ap-section-heading">Historical Winners</h3>
            <div className="ap-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="ap-table">
                <thead><tr><th>Winner</th><th>Draw</th><th>Match</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {[
                    { winner: 'Niamh Walsh',   draw: 'Apr 2025', match: '3-Match', amount: '£980',   status: 'Paid' },
                    { winner: 'Conor Flynn',   draw: 'Apr 2025', match: '4-Match', amount: '£2,890', status: 'Paid' },
                    { winner: 'Tom Gallagher', draw: 'Mar 2025', match: '3-Match', amount: '£740',   status: 'Paid' },
                  ].map(w => (
                    <tr key={w.winner + w.draw}>
                      <td>{w.winner}</td>
                      <td className="ap-td-muted">{w.draw}</td>
                      <td>{w.match}</td>
                      <td className="ap-td-success">{w.amount}</td>
                      <td><span className="badge badge-active">{w.status}</span></td>
                      <td><button className="ap-action-btn">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ REPORTS ════ */}
        {activeSection === 'reports' && (
          <div>
            <h1 className="ap-page-title">Reports &amp; Analytics</h1>

            <div className="ap-stats-row">
              {[
                { label: 'Total Users',  val: '1,842' },
                { label: 'Prize Pool',   val: '£48,200' },
                { label: 'Charity Total',val: '£12,100' },
                { label: 'Draw Winners', val: '127' },
              ].map(s => (
                <div className="ap-stat-card" key={s.label}>
                  <div className="ap-stat-val">{s.val}</div>
                  <div className="ap-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="ap-two-col">
              <div className="ap-card">
                <div className="ap-card-title">Charity Distribution</div>
                {[
                  { name: 'Green Earth Foundation', pct: 34, color: 'var(--accent)',  amount: '£4,200' },
                  { name: 'Cancer Care Alliance',   pct: 32, color: 'var(--info)',    amount: '£3,890' },
                  { name: 'Shelter Ireland',        pct: 34, color: '#a855f7',        amount: '£4,010' },
                ].map(c => (
                  <div key={c.name} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                      <span>{c.name}</span>
                      <span style={{ color: c.color, fontWeight: 600 }}>{c.amount} ({c.pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--surface3)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="ap-card">
                <div className="ap-card-title">Draw Statistics</div>
                {[
                  { label: 'Draws Run',       val: '5' },
                  { label: 'Total Winners',   val: '127' },
                  { label: '5-Match Winners', val: '0 (Jackpot live)' },
                  { label: '4-Match Winners', val: '12' },
                  { label: '3-Match Winners', val: '115' },
                  { label: 'Avg Pool Size',   val: '£9,640' },
                ].map(r => (
                  <div key={r.label} className="ap-stat-row-item">
                    <span className="ap-td-muted">{r.label}</span>
                    <span style={{ fontWeight: 500 }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
