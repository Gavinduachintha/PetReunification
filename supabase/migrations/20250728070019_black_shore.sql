/*
  # Pet Connect Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `pets`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `species` (text)
      - `breed` (text)
      - `age` (integer)
      - `color` (text)
      - `description` (text, optional)
      - `photo_url` (text, optional)
      - `qr_code` (text, unique)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `found_reports`
      - `id` (uuid, primary key)
      - `pet_id` (uuid, references pets)
      - `finder_name` (text)
      - `finder_phone` (text)
      - `finder_email` (text, optional)
      - `location_found` (text)
      - `message` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access to active pet profiles
    - Allow public insert for found reports

  3. Storage
    - Create pet-photos bucket for storing pet images
    - Set up RLS policies for photo uploads
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text DEFAULT '',
  age integer NOT NULL DEFAULT 1,
  color text NOT NULL,
  description text DEFAULT '',
  photo_url text,
  qr_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create found_reports table
CREATE TABLE IF NOT EXISTS found_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  finder_name text NOT NULL,
  finder_phone text NOT NULL,
  finder_email text,
  location_found text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Users can read own pets"
  ON pets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own pets"
  ON pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets"
  ON pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Public can read active pet profiles"
  ON pets
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read owner info for active pets"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.owner_id = profiles.id 
      AND pets.is_active = true
    )
  );

-- Found reports policies
CREATE POLICY "Anyone can report found pets"
  ON found_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Pet owners can read reports for their pets"
  ON found_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = found_reports.pet_id 
      AND pets.owner_id = auth.uid()
    )
  );

-- Create storage bucket for pet photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Pet owners can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pet-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Pet owners can update their photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pet-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Pet owners can delete their photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pet-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view pet photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'pet-photos');

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS pets_owner_id_idx ON pets(owner_id);
CREATE INDEX IF NOT EXISTS pets_qr_code_idx ON pets(qr_code);
CREATE INDEX IF NOT EXISTS pets_is_active_idx ON pets(is_active);
CREATE INDEX IF NOT EXISTS found_reports_pet_id_idx ON found_reports(pet_id);