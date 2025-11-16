-- Add latitude and longitude columns to businesses table
-- Run this migration in Supabase SQL Editor

-- ============================================
-- ADD COORDINATES TO BUSINESSES TABLE
-- ============================================

-- Add new columns to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

-- Create indexes for coordinate queries (useful for distance queries later)
CREATE INDEX IF NOT EXISTS idx_businesses_coordinates ON businesses(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================
-- UPDATE EXISTING BUSINESSES WITH RANDOM COORDINATES
-- ============================================
-- Nashville, TN center: 36.1627, -86.7816
-- This generates coordinates within a ~5 mile radius of Nashville center

UPDATE businesses
SET
  latitude = 36.1627 + (RANDOM() - 0.5) * 0.3,
  longitude = -86.7816 + (RANDOM() - 0.5) * 0.3,
  updated_at = CURRENT_TIMESTAMP
WHERE latitude IS NULL AND longitude IS NULL;

-- ============================================
-- VERIFY THE UPDATE
-- ============================================
-- Run this to check that coordinates were added:
-- SELECT id, name, latitude, longitude FROM businesses WHERE status = 'active' LIMIT 10;
