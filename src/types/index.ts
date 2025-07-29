export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  color: string;
  description?: string;
  photo_url?: string;
  qr_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoundReport {
  id: string;
  pet_id: string;
  finder_name: string;
  finder_phone: string;
  finder_email?: string;
  location_found: string;
  message?: string;
  created_at: string;
}