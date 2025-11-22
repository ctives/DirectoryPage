-- Setup admin account for ct.ives@gmail.com
-- Run this in Supabase SQL Editor

-- First, create a user in auth.users if it doesn't exist
-- Note: You'll need to create this through Supabase Auth UI first,
-- or use the admin API. For now, we'll assume the user exists.

-- Create admin user profile in the users table
INSERT INTO users (id, email, name, role, verified, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',  -- You'll need to replace with actual auth user ID from Supabase
  'ct.ives@gmail.com',
  'Admin User',
  'admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'admin', verified = true;
