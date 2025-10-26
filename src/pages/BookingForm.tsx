import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { supabase, Venue, Slot } from '../lib/supabase'

const ADDONS = [
  { name: 'LED HBD', price: 119 },
  { name: 'Fog Entry', price: 700 },
  { name: 'Fog Entry + Cold Fire (2)', price: 1400 },
  { name: 'Photo Props', price: 189 },
  { name: 'LED Name Letters', price: 299 },
  { name: 'Table Décor', price: 299 },
  { name: 'Candles', price: 199 },
  { name: 'Photoshoot (30 mins)', price: 600 },
  { name: 'Photoshoot (60 mins)', price: 1200 },
  { name: 'Sash & Crown', price: 199 },
  { name: 'Cold Fire', price: 700 },
  { name: 'Candle Faith', price: 199 },
  { name: 'Fog in Room', price: 499 },
  { name: 'LOVE', price: 99 },
  { name: 'LED Numbers', price: 99 },
  { name: 'Bubble Entry', price: 200 },
  { name: 'none', price: 0 }
]

const CAKES = ['Vanilla', 'Strawberry', 'Butterscotch', 'Pineapple', 'Blueberry', 'Pistamalai', 'Choco Truffle', 'Choco Kitkat', 'White Forest', 'Black Forest', 'none']

const EVENT_TYPES = ['Birthday', 'Anniversary', 'Romantic Date', 'Marriage Proposal', 'Groom to Be', 'Bride to Be', 'Baby Shower', 'Private Party', 'none']

export default function BookingForm() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState<Venue[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    venue_id: '',
    slot_id: '',
    booking_date: '',
    booking_name: '',
    persons: '',
    whatsapp: '',
    email: '',
    decoration: false,
    advance_paid: false,
    event_type: '',
    cake_selection: '',
    selected_addons: [] as string[],
    total_amount: '',
    extra_person_charges: 0
  })

  useEffect(() => {
    loadVenuesAndSlots()
  }, [])

  const loadVenuesAndSlots = async () => {
    const { data: venuesData } = await supabase.from('venues').select('*')
    const { data: slotsData } = await supabase.from('slots').select('*')
    if (venuesData) setVenues(venuesData)
    if (slotsData) setSlots(slotsData)
  }

  useEffect(() => {
    if (formData.venue_id) {
      const venueSlots = slots.filter(s => s.venue_id === formData.venue_id)
      setFilteredSlots(venueSlots)
    } else {
      setFilteredSlots([])
    }
    setFormData(prev => ({ ...prev, slot_id: '', persons: '' }))
  }, [formData.venue_id, slots])

  useEffect(() => {
    calculateExtraCharges()
  }, [formData.venue_id, formData.persons])

  const calculateExtraCharges = () => {
    if (!formData.venue_id || !formData.persons) {
      setFormData(prev => ({ ...prev, extra_person_charges: 0 }))
      return
    }

    const venue = venues.find(v => v.id === formData.venue_id)
    if (!venue) return

    const persons = parseInt(formData.persons)
    if (isNaN(persons) || persons <= venue.included_guests) {
      setFormData(prev => ({ ...prev, extra_person_charges: 0 }))
      return
    }

    const extraPersons = persons - venue.included_guests
    const totalExtraCharge = extraPersons * venue.extra_person_charge
    setFormData(prev => ({ ...prev, extra_person_charges: totalExtraCharge }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddonChange = (addonName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selected_addons: checked
        ? [...prev.selected_addons, addonName]
        : prev.selected_addons.filter(a => a !== addonName)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const addonsString = formData.selected_addons
        .map(name => {
          const addon = ADDONS.find(a => a.name === name)
          return addon ? `${addon.name}|${addon.price}` : name
        })
        .join(',')

      const bookingData = {
        venue_id: formData.venue_id,
        slot_id: formData.slot_id,
        booking_date: formData.booking_date,
        booking_name: formData.booking_name,
        persons: parseInt(formData.persons),
        whatsapp: formData.whatsapp,
        email: formData.email,
        decoration: formData.decoration,
        advance_paid: formData.advance_paid,
        event_type: formData.event_type,
        cake_selection: formData.cake_selection,
        selected_addons: addonsString,
        payment_id: formData.advance_paid ? 'admin_manual_advance' : 'admin_manual',
        total_amount: formData.total_amount ? parseFloat(formData.total_amount) : 0,
        extra_person_charges: formData.extra_person_charges
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (bookingError) throw bookingError

      if (formData.advance_paid) {
        await supabase
          .from('slots')
          .update({ status: 'booked', is_booked: true })
          .eq('id', formData.slot_id)
      }

      alert('Booking saved successfully!' + (formData.advance_paid ? ' Slot frozen (advance paid).' : ''))
      navigate('/view-bookings')
    } catch (error) {
      console.error('Error saving booking:', error)
      alert('Failed to save booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedVenue = venues.find(v => v.id === formData.venue_id)
  const maxGuests = selectedVenue?.max_guests || 0

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Admin Panel - Add Booking
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="venue_id" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Venue:
            </label>
            <select
              id="venue_id"
              name="venue_id"
              value={formData.venue_id}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select Venue --</option>
              {venues.map(venue => (
                <option key={venue.id} value={venue.id}>{venue.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="slot_id" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Slot:
            </label>
            <select
              id="slot_id"
              name="slot_id"
              value={formData.slot_id}
              onChange={handleChange}
              required
              disabled={!formData.venue_id}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select Slot --</option>
              {filteredSlots.map(slot => (
                <option key={slot.id} value={slot.id}>{slot.time_range}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="booking_date" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Booking Date:
            </label>
            <input
              type="date"
              id="booking_date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label htmlFor="booking_name" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Booking Name:
            </label>
            <input
              type="text"
              id="booking_name"
              name="booking_name"
              value={formData.booking_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label htmlFor="persons" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Number of Persons:
            </label>
            <select
              id="persons"
              name="persons"
              value={formData.persons}
              onChange={handleChange}
              required
              disabled={!formData.venue_id}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select Guest Count --</option>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="whatsapp" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              WhatsApp Number:
            </label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="decoration"
                checked={formData.decoration}
                onChange={handleChange}
              />
              Decoration
            </label>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="advance_paid"
                checked={formData.advance_paid}
                onChange={handleChange}
              />
              Advance Payment
            </label>
          </div>

          <div>
            <label htmlFor="event_type" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Event Type:
            </label>
            <select
              id="event_type"
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select Event Type --</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cake_selection" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Cake Selection:
            </label>
            <select
              id="cake_selection"
              name="cake_selection"
              value={formData.cake_selection}
              onChange={handleChange}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Select Cake --</option>
              {CAKES.map(cake => (
                <option key={cake} value={cake}>{cake}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Selected Addons:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              maxWidth: '650px',
              border: '1px solid #eee',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {ADDONS.map(addon => (
                <label key={addon.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.selected_addons.includes(addon.name)}
                    onChange={(e) => handleAddonChange(addon.name, e.target.checked)}
                  />
                  {addon.name} {addon.price > 0 && `(₹${addon.price})`}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="total_amount" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Total Amount:
            </label>
            <input
              type="number"
              id="total_amount"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label htmlFor="extra_person_charges" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
              Extra Person Charges (₹):
            </label>
            <input
              type="number"
              id="extra_person_charges"
              name="extra_person_charges"
              value={formData.extra_person_charges}
              readOnly
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#f3f4f6'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#3b82f6',
              color: 'white',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              maxWidth: '200px',
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#2563eb'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#3b82f6'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
