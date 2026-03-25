import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    const data = await res.json()
    setLoading(false)
    if (data.role === 'hicom') {
      sessionStorage.setItem('mafia_role', 'hicom')
      router.push('/hicom')
    } else if (data.role === 'staff') {
      sessionStorage.setItem('mafia_role', 'staff')
      router.push('/staff')
    } else {
      setError('Incorrect password. Access denied.')
      setPassword('')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.scanlines} />
      <div style={styles.container}>
        <div style={styles.emblem}>✦</div>
        <h1 style={styles.title}>THE MAFIA</h1>
        <p style={styles.subtitle}>DonutSMP Operations Portal</p>
        <div style={styles.divider} />
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>ENTER ACCESS CODE</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>
        <p style={styles.footer}>Unauthorized access is prohibited</p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #1a0500 0%, #0a0a0a 70%)',
    position: 'relative',
    overflow: 'hidden',
  },
  scanlines: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '60px 50px',
    background: 'rgba(10,10,10,0.95)',
    border: '1px solid #2a0000',
    borderTop: '3px solid #cc2200',
    maxWidth: 420,
    width: '100%',
    margin: '0 16px',
  },
  emblem: {
    fontSize: 32,
    color: '#cc2200',
    display: 'block',
    marginBottom: 16,
    letterSpacing: 8,
  },
  title: {
    fontSize: 36,
    letterSpacing: '0.3em',
    color: '#e8e0d8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: '0.25em',
    color: '#666660',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  divider: {
    width: 60,
    height: 1,
    background: 'linear-gradient(to right, transparent, #cc2200, transparent)',
    margin: '0 auto 36px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    fontSize: 10,
    letterSpacing: '0.2em',
    color: '#666660',
    textAlign: 'left',
  },
  input: {
    background: '#111111',
    border: '1px solid #2a2a2a',
    borderBottom: '1px solid #cc2200',
    color: '#e8e0d8',
    padding: '14px 16px',
    fontSize: 18,
    letterSpacing: '0.2em',
    textAlign: 'center',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#ff3311',
    fontSize: 12,
    letterSpacing: '0.05em',
  },
  btn: {
    background: '#cc2200',
    border: 'none',
    color: '#fff',
    padding: '14px',
    fontSize: 13,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: 8,
    transition: 'background 0.2s',
    fontFamily: 'Georgia, serif',
  },
  footer: {
    marginTop: 32,
    fontSize: 10,
    letterSpacing: '0.15em',
    color: '#333330',
    textTransform: 'uppercase',
  }
}
