import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './WinnerVerify.css'

export default function WinnerVerify() {
  const nav = useNavigate()
  const [file,    setFile]    = useState(null)
  const [notes,   setNotes]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [dragging,  setDragging]  = useState(false)

  const handleFile = (f) => {
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) { alert('Please upload your proof screenshot first.'); return }
    
    const formData = new FormData()
    formData.append('proof', file)
    formData.append('notes', notes)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5005/api/admin/verify-upload', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert(data.message || 'Upload failed')
      }
    } catch (err) {
      alert('Connection error')
    }
  }

  if (submitted) {
    return (
      <main className="verify-page">
        <div className="verify-success-box">
          <div className="vs-icon">🎉</div>
          <h2>Verification Submitted!</h2>
          <p>Your proof has been sent to the admin team. You'll be notified within 48 hours once reviewed.</p>
          <button className="btn-primary" style={{ marginTop:'1.5rem' }} onClick={() => nav('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="verify-page">
      <section className="section" style={{ maxWidth:'640px', margin:'0 auto' }}>
        <div className="section-label">Winner Verification</div>
        <h1 className="section-title" style={{ fontSize:'2rem' }}>Submit Your Proof</h1>
        <p style={{ color:'var(--muted)', fontSize:'0.9rem', marginBottom:'2rem' }}>
          Upload a screenshot from your golf platform showing your scores. Admin will review within 48 hours.
        </p>

        <div className="card">
          <div className="card-title">May 2025 — 3-Number Match</div>

          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.8rem', color:'var(--muted)', marginBottom:'10px' }}>Your winning scores matched</div>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              {[29,32,27].map(n => (
                <div key={n} className="match-score-pill">{n}</div>
              ))}
            </div>
          </div>

          <div className="form-group-v">
            <label>Proof Screenshot <span style={{ color:'var(--danger)' }}>*</span></label>
            <div
              className={`upload-area ${dragging ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              onClick={() => document.getElementById('file-input').click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*,.pdf"
                style={{ display:'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div className="upload-icon">✅</div>
                  <div className="upload-text">{file.name}</div>
                  <div className="upload-hint">Click to change file</div>
                </>
              ) : (
                <>
                  <div className="upload-icon">📎</div>
                  <div className="upload-text">Click to upload or drag &amp; drop</div>
                  <div className="upload-hint">PNG, JPG, PDF accepted</div>
                </>
              )}
            </div>
          </div>

          <div className="form-group-v">
            <label>Additional Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any context about your scores..."
            />
          </div>

          <div style={{ display:'flex', gap:'10px', marginTop:'0.5rem' }}>
            <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={handleSubmit}>
              Submit Verification
            </button>
            <button className="btn-outline" style={{ padding:'13px 20px' }} onClick={() => nav('/dashboard')}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
