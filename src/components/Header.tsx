import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header style={{
      background: '#3b82f6',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '8px 20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src="/BINGEN.png"
              alt="BINGE'N Logo"
              style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '0.05em',
            margin: 0
          }}>BINGE'N CELEBRATIONS</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to="/booking-form"
            style={{
              color: 'white',
              fontWeight: 500,
              textDecoration: 'none',
              marginLeft: '16px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            Booking Form
          </Link>
          <Link
            to="/view-bookings"
            style={{
              color: 'white',
              fontWeight: 500,
              textDecoration: 'none',
              marginLeft: '16px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            View Bookings
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '16px',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
