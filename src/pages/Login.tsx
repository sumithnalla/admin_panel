import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/booking-form')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields!')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/booking-form')
    } catch (err) {
      setError('Invalid email or password!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden'
          }}>
            <img src="/BINGEN.png" alt="BINGE'N Logo" style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
            letterSpacing: '0.05em',
            margin: 0
          }}>BINGE'N CELEBRATIONS</h1>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', fontSize: '28px', marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Access your booking management panel</p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 500
            }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
              placeholder="Enter admin email"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none'
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 500
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                required
                placeholder="Enter admin password"
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 15px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none'
                  e.target.style.borderColor = '#2563eb'
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e1e5e9'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px'
                }}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.4)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
