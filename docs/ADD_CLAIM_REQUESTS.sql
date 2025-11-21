-- ============================================
-- BUSINESS CLAIM FEATURE DATABASE MIGRATIONS
-- ============================================
-- This migration adds tables and columns needed for the business claiming feature
-- Run this in your Supabase SQL Editor after CREATE_ALL_TABLES.sql

-- 1. Add claim tracking columns to businesses table
ALTER TABLE businesses
  ADD COLUMN claimed BOOLEAN DEFAULT false,
  ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN claimed_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. Create claim_requests table
CREATE TABLE claim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(business_id, email) -- Prevent duplicate claims from same email
);

-- Create index for faster lookups
CREATE INDEX idx_claim_requests_business_id ON claim_requests(business_id);
CREATE INDEX idx_claim_requests_user_id ON claim_requests(user_id);
CREATE INDEX idx_claim_requests_status ON claim_requests(status);
CREATE INDEX idx_claim_requests_email ON claim_requests(email);

-- 3. Create verification_codes table for magic links
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  claim_request_id UUID NOT NULL REFERENCES claim_requests(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, claim_request_id) -- Only one active code per claim
);

-- Create index for code lookups
CREATE INDEX idx_verification_codes_code ON verification_codes(code);
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on claim_requests table
ALTER TABLE claim_requests ENABLE ROW LEVEL SECURITY;

-- Claim Requests: Public can read their own claims (by email)
DROP POLICY IF EXISTS "Users can read their own claims" ON claim_requests;
CREATE POLICY "Users can read their own claims" ON claim_requests
  FOR SELECT
  USING (
    auth.email() = email OR
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Claim Requests: Only admins can update claims
DROP POLICY IF EXISTS "Only admins can update claims" ON claim_requests;
CREATE POLICY "Only admins can update claims" ON claim_requests
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Enable RLS on verification_codes table
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Verification Codes: Users can read their own verification codes
DROP POLICY IF EXISTS "Users can read their own verification codes" ON verification_codes;
CREATE POLICY "Users can read their own verification codes" ON verification_codes
  FOR SELECT
  USING (email = auth.email());

-- Verification Codes: Service role can manage codes (for backend operations)
-- This is automatically allowed with service role key

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Run this migration to enable business claiming feature
-- Table summary:
-- ✅ claim_requests - Track all business claim requests
-- ✅ verification_codes - Store magic link codes
-- ✅ businesses table updated with claim tracking
