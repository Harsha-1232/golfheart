import React, { useEffect, useState } from 'react'
import './Countdown.css'

export default function Countdown() {
  const [time, setTime] = useState(getTime())

  function getTime() {
    const now  = new Date()
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const diff = next - now
    return {
      days: Math.floor(diff / 86400000),
      hrs:  Math.floor((diff % 86400000) / 3600000),
      min:  Math.floor((diff % 3600000)  / 60000),
      sec:  Math.floor((diff % 60000)    / 1000),
    }
  }

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = n => String(n).padStart(2, '0')

  return (
    <div className="countdown">
      <div className="cd-label">Next Draw In</div>
      <div className="cd-grid">
        {[['days','Days'],['hrs','Hrs'],['min','Min'],['sec','Sec']].map(([k,u]) => (
          <div className="cd-box" key={k}>
            <div className="cd-num">{pad(time[k])}</div>
            <div className="cd-unit">{u}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
