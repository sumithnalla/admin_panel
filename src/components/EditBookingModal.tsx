import { useState, useEffect } from 'react'
import { Booking } from '../lib/supabase'

interface EditBookingModalProps {
  booking: Booking | null
  onClose: () => void
  onSave: (updatedBooking: Partial<Booking>) => Promise<void>
}

export default function EditBookingModal({ booking, onClose, onSave }: EditBookingModalProps) {
  const [formData, setFormData] = useState<Partial<Booking>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (booking) {
      setFormData(booking)
    }
  }, [booking])

  if (!booking) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Failed to update booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'block',
      position: 'fixed',
      zIndex: 10,
      paddingTop: '100px',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)'
    }}>
      <div style={{
        background: 'white',
        margin: 'auto',
        padding: '20px',
        borderRadius: '10px',
        width: '50%',
        maxHeight: '80%',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Edit Booking</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Venue ID</label>
            <input
              type="text"
              name="venue_id"
              value={formData.venue_id || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Slot ID</label>
            <input
              type="text"
              name="slot_id"
              value={formData.slot_id || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Date</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Name</label>
            <input
              type="text"
              name="booking_name"
              value={formData.booking_name || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Persons</label>
            <input
              type="number"
              name="persons"
              value={formData.persons || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Decoration</label>
            <input
              type="text"
              name="decoration"
              value={formData.decoration?.toString() || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Advance Paid</label>
            <select
              name="advance_paid"
              value={formData.advance_paid ? 'true' : 'false'}
              onChange={(e) => setFormData(prev => ({ ...prev, advance_paid: e.target.value === 'true' }))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Event Type</label>
            <input
              type="text"
              name="event_type"
              value={formData.event_type || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Cake Selection</label>
            <input
              type="text"
              name="cake_selection"
              value={formData.cake_selection || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Addons</label>
            <textarea
              name="selected_addons"
              value={formData.selected_addons || ''}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount || ''}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#dc2626',
                color: 'white',
                padding: '8px 12px',
                marginRight: '10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: '#16a34a',
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
