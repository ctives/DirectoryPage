-- Add RLS Policies for business_photos table
-- Run this in your Supabase SQL Editor to enable public read access to photos

-- Business Photos: Read photos from active businesses
DROP POLICY IF EXISTS "Anyone can read business photos" ON business_photos;
CREATE POLICY "Anyone can read business photos" ON business_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_photos.business_id
      AND businesses.status = 'active'
    )
  );

-- Business Photos: Business owners can insert photos
DROP POLICY IF EXISTS "Business owners can insert photos" ON business_photos;
CREATE POLICY "Business owners can insert photos" ON business_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = business_photos.business_id
      AND business_owners.user_id = auth.uid()
      AND business_owners.role IN ('owner', 'manager')
    )
  );

-- Business Photos: Business owners can delete their photos
DROP POLICY IF EXISTS "Business owners can delete their photos" ON business_photos;
CREATE POLICY "Business owners can delete their photos" ON business_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = business_photos.business_id
      AND business_owners.user_id = auth.uid()
      AND business_owners.role IN ('owner', 'manager')
    )
  );
