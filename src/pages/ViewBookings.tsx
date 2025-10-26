import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import EditBookingModal from '../components/EditBookingModal'
import { supabase, Booking } from '../lib/supabase'

export default function ViewBookings() {
  const navigate = useNavigate()
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filterDate, setFilterDate] = useState('')
  const [page, setPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const limit = 50

  useEffect(() => {
    loadBookings()
  }, [page, filterDate])

  const loadBookings = async () => {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterDate) {
      query = query.eq('booking_date', filterDate)
    } else {
      query = query.range((page - 1) * limit, page * limit - 1)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error loading bookings:', error)
      return
    }
    if (data) {
      setFilteredBookings(data)
    }
  }

  const handleFilterByDate = () => {
    if (filterDate) {
      loadBookings()
    }
  }

  const handleRemoveFilter = () => {
    setFilterDate('')
    setPage(1)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const handleSaveEdit = async (updatedBooking: Partial<Booking>) => {
    if (!selectedBooking) return

    const { id, ...updateData } = updatedBooking

    if (updateData.advance_paid !== undefined) {
      updateData.advance_paid = Boolean(updateData.advance_paid)
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', selectedBooking.id)

    if (error) {
      console.error('Error updating booking:', error)
      throw error
    }

    alert('Booking updated successfully!')
    setSelectedBooking(null)
    loadBookings()
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => navigate('/booking-form')}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <h2 style={{ textAlign: 'center', margin: 0 }}>All Bookings</h2>
          <div style={{ textAlign: 'center' }}>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleFilterByDate}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                marginLeft: '5px'
              }}
            >
              Filter
            </button>
            <button
              onClick={handleRemoveFilter}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                marginLeft: '5px'
              }}
            >
              Remove Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: '#3b82f6', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Venue ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Slot ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Persons</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>WhatsApp</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Decoration</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Advance Paid</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Created At</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Event Type</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Cake</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Addons</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Payment ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Extra</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  style={{ borderBottom: '1px solid #ddd' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f1f1'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '10px' }}>{booking.id}</td>
                  <td style={{ padding: '10px' }}>{booking.venue_id}</td>
                  <td style={{ padding: '10px' }}>{booking.slot_id}</td>
                  <td style={{ padding: '10px' }}>{booking.booking_date}</td>
                  <td style={{ padding: '10px' }}>{booking.booking_name}</td>
                  <td style={{ padding: '10px' }}>{booking.persons}</td>
                  <td style={{ padding: '10px' }}>{booking.whatsapp}</td>
                  <td style={{ padding: '10px' }}>{booking.email}</td>
                  <td style={{ padding: '10px' }}>{booking.decoration ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px' }}>{booking.advance_paid ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px' }}>{new Date(booking.created_at).toLocaleString()}</td>
                  <td style={{ padding: '10px' }}>{booking.event_type}</td>
                  <td style={{ padding: '10px' }}>{booking.cake_selection}</td>
                  <td style={{ padding: '10px' }}>{booking.selected_addons}</td>
                  <td style={{ padding: '10px' }}>{booking.payment_id}</td>
                  <td style={{ padding: '10px' }}>{booking.total_amount}</td>
                  <td style={{ padding: '10px' }}>{booking.extra_person_charges}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => handleEdit(booking)}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #3b82f6',
                color: '#3b82f6',
                margin: '0 2px',
                textDecoration: 'none',
                borderRadius: '5px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              ← Prev
            </button>
          )}
          <span style={{
            padding: '8px 12px',
            border: '1px solid #3b82f6',
            background: '#3b82f6',
            color: 'white',
            margin: '0 2px',
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            {page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            style={{
              padding: '8px 12px',
              border: '1px solid #3b82f6',
              color: '#3b82f6',
              margin: '0 2px',
              textDecoration: 'none',
              borderRadius: '5px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
