import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Venue {
  id: string
  name: string
  max_guests: number
  included_guests: number
  extra_person_charge: number
  created_at: string
}

export interface Slot {
  id: string
  venue_id: string
  time_range: string
  start_time: string
  end_time: string
  status: string
  is_booked: boolean
  created_at: string
}

export interface Booking {
  id: string
  venue_id: string
  slot_id: string
  booking_date: string
  booking_name: string
  persons: number
  whatsapp: string
  email: string
  decoration: boolean
  advance_paid: boolean
  event_type: string
  cake_selection: string
  selected_addons: string
  payment_id: string
  total_amount: number
  extra_person_charges: number
  created_at: string
}
