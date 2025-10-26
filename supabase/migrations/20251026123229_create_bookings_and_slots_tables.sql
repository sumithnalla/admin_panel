/*
  # Create Booking Management System Schema

  1. New Tables
    - `venues`
      - `id` (uuid, primary key)
      - `name` (text)
      - `max_guests` (integer)
      - `included_guests` (integer)
      - `extra_person_charge` (integer)
      - `created_at` (timestamptz)
    
    - `slots`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key to venues)
      - `time_range` (text)
      - `start_time` (time)
      - `end_time` (time)
      - `status` (text, default 'available')
      - `is_booked` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key to venues)
      - `slot_id` (uuid, foreign key to slots)
      - `booking_date` (date)
      - `booking_name` (text)
      - `persons` (integer)
      - `whatsapp` (text)
      - `email` (text)
      - `decoration` (boolean, default false)
      - `advance_paid` (boolean, default false)
      - `event_type` (text)
      - `cake_selection` (text)
      - `selected_addons` (text)
      - `payment_id` (text)
      - `total_amount` (numeric)
      - `extra_person_charges` (numeric, default 0)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage bookings
    - Add policies for reading venue and slot data

  3. Seed Data
    - Insert 4 venues (Aura, Lunar, Minimax, Couple)
    - Insert 20 slots (5 per venue)
*/

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  max_guests integer NOT NULL DEFAULT 0,
  included_guests integer NOT NULL DEFAULT 0,
  extra_person_charge integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create slots table
CREATE TABLE IF NOT EXISTS slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  time_range text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'available',
  is_booked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  slot_id uuid NOT NULL REFERENCES slots(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  booking_name text NOT NULL,
  persons integer NOT NULL DEFAULT 1,
  whatsapp text NOT NULL,
  email text NOT NULL,
  decoration boolean DEFAULT false,
  advance_paid boolean DEFAULT false,
  event_type text DEFAULT '',
  cake_selection text DEFAULT '',
  selected_addons text DEFAULT '',
  payment_id text DEFAULT '',
  total_amount numeric DEFAULT 0,
  extra_person_charges numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Venues policies (public read, authenticated write)
CREATE POLICY "Anyone can view venues"
  ON venues FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert venues"
  ON venues FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update venues"
  ON venues FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Slots policies (public read, authenticated write)
CREATE POLICY "Anyone can view slots"
  ON slots FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert slots"
  ON slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slots"
  ON slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Bookings policies (authenticated only)
CREATE POLICY "Authenticated users can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Insert venue data
INSERT INTO venues (id, name, max_guests, included_guests, extra_person_charge) VALUES
  ('399e2ade-5d6d-4535-81a6-93ae43a637a5', 'Aura', 12, 6, 250),
  ('18c00f9e-21d0-4d77-ad5a-d831aa4ede07', 'Lunar', 8, 4, 250),
  ('fdb9e954-7810-4ab5-9b7d-1483ec53669a', 'Minimax', 20, 8, 250),
  ('771c4da3-851e-431c-a490-8bb6bf93aa77', 'Couple', 2, 2, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert slots for Aura venue
INSERT INTO slots (id, venue_id, time_range, start_time, end_time) VALUES
  ('dcc7cb82-7915-4dff-9a66-e0cd33e8ca92', '399e2ade-5d6d-4535-81a6-93ae43a637a5', '09:30 AM - 12:30 PM', '09:30:00', '12:30:00'),
  ('c513c0ec-5b53-4c24-bb53-9c1a14b7197f', '399e2ade-5d6d-4535-81a6-93ae43a637a5', '01:00 PM - 04:00 PM', '13:00:00', '16:00:00'),
  ('7912de97-0587-4e9c-b3a2-82e7379fac9e', '399e2ade-5d6d-4535-81a6-93ae43a637a5', '04:30 PM - 06:00 PM', '16:30:00', '18:00:00'),
  ('07682981-ae4c-47fc-8435-24b064ff2d0c', '399e2ade-5d6d-4535-81a6-93ae43a637a5', '06:30 PM - 09:30 PM', '18:30:00', '21:30:00'),
  ('106a4eb2-713f-4074-96c0-b6c827009c42', '399e2ade-5d6d-4535-81a6-93ae43a637a5', '10:00 PM - 01:00 AM', '22:00:00', '01:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert slots for Lunar venue
INSERT INTO slots (id, venue_id, time_range, start_time, end_time) VALUES
  ('93382ee1-819b-4459-aecb-e4ec7af8a7ed', '18c00f9e-21d0-4d77-ad5a-d831aa4ede07', '09:30 AM - 12:30 PM', '09:30:00', '12:30:00'),
  ('d0849d08-3b41-4d06-afb9-2fa1747c5235', '18c00f9e-21d0-4d77-ad5a-d831aa4ede07', '01:00 PM - 04:00 PM', '13:00:00', '16:00:00'),
  ('8f04a740-4df3-47db-bc88-423486257014', '18c00f9e-21d0-4d77-ad5a-d831aa4ede07', '04:30 PM - 06:00 PM', '16:30:00', '18:00:00'),
  ('bf341419-5f73-40fd-b2f0-6d93e195e1af', '18c00f9e-21d0-4d77-ad5a-d831aa4ede07', '06:30 PM - 09:30 PM', '18:30:00', '21:30:00'),
  ('0d183089-a38d-4de1-9208-f3f3b46861d3', '18c00f9e-21d0-4d77-ad5a-d831aa4ede07', '10:00 PM - 01:00 AM', '22:00:00', '01:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert slots for Minimax venue
INSERT INTO slots (id, venue_id, time_range, start_time, end_time) VALUES
  ('b2c068ce-16be-4b4c-a888-a283cb17bba1', 'fdb9e954-7810-4ab5-9b7d-1483ec53669a', '10:00 AM - 01:00 PM', '10:00:00', '13:00:00'),
  ('c76f7f9d-cf0e-41c3-84d0-823c8db67289', 'fdb9e954-7810-4ab5-9b7d-1483ec53669a', '01:30 PM - 04:30 PM', '13:30:00', '16:30:00'),
  ('f549927c-787c-4116-a82b-a11faf4519fe', 'fdb9e954-7810-4ab5-9b7d-1483ec53669a', '05:00 PM - 06:30 PM', '17:00:00', '18:30:00'),
  ('5dd9eddb-4ea7-4956-b069-42c0c2c532bf', 'fdb9e954-7810-4ab5-9b7d-1483ec53669a', '07:00 PM - 10:00 PM', '19:00:00', '22:00:00'),
  ('56b5ff0b-e8ae-4e92-94db-0fc3a2bc1333', 'fdb9e954-7810-4ab5-9b7d-1483ec53669a', '10:30 PM - 01:00 AM', '22:30:00', '01:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert slots for Couple venue
INSERT INTO slots (id, venue_id, time_range, start_time, end_time) VALUES
  ('b9f73b3a-c40a-4fd9-b56d-055dbe8a3fa3', '771c4da3-851e-431c-a490-8bb6bf93aa77', '09:00 AM - 12:00 PM', '09:00:00', '12:00:00'),
  ('2fe129f7-76ba-41dc-8a16-c43d9bed8923', '771c4da3-851e-431c-a490-8bb6bf93aa77', '12:30 PM - 03:30 PM', '12:30:00', '15:30:00'),
  ('dfac91a6-99d5-418b-a70e-7a75c7b207a2', '771c4da3-851e-431c-a490-8bb6bf93aa77', '04:00 PM - 05:30 PM', '16:00:00', '17:30:00'),
  ('2f3a9da9-a778-43cb-9505-69c9fea101be', '771c4da3-851e-431c-a490-8bb6bf93aa77', '06:00 PM - 09:00 PM', '18:00:00', '21:00:00'),
  ('0edf9c1f-4c90-4ce4-a06e-a0b06f88759e', '771c4da3-851e-431c-a490-8bb6bf93aa77', '09:30 PM - 12:30 AM', '21:30:00', '00:30:00')
ON CONFLICT (id) DO NOTHING;