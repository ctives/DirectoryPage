-- Nashville Cleaning Directory Database Schema
-- Complete SQL script to create all tables
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'business', 'admin')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. CREATE BUSINESS OWNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')) DEFAULT 'owner',
  verified BOOLEAN DEFAULT false,
  verification_method TEXT CHECK (verification_method IN ('manual', 'phone', 'email_domain')),
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_owners_user_id ON business_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_business_owners_business_id ON business_owners(business_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_owners_user_business ON business_owners(user_id, business_id) WHERE business_id IS NOT NULL;

-- ============================================
-- 3. CREATE BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'TN',
  zip_code TEXT,
  years_in_business INTEGER,
  service_type TEXT NOT NULL CHECK (service_type IN ('residential', 'commercial', 'both')) DEFAULT 'both',
  languages TEXT[] DEFAULT '{"English"}',

  -- Verification & Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'suspended', 'rejected')) DEFAULT 'pending',
  verified BOOLEAN DEFAULT false,
  insurance_verified BOOLEAN DEFAULT false,
  background_check_verified BOOLEAN DEFAULT false,

  -- Documents
  license_url TEXT,
  insurance_url TEXT,
  background_check_url TEXT,

  -- Ratings & Reviews
  average_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,

  -- Pricing
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')) DEFAULT 'starter',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_service_type ON businesses(service_type);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_businesses_subscription_tier ON businesses(subscription_tier);

-- ============================================
-- 4. CREATE SERVICE AREAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  area_type TEXT NOT NULL CHECK (area_type IN ('neighborhood', 'zip_code', 'county')),
  area_name TEXT NOT NULL,
  zip_code TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_areas_business_id ON service_areas(business_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_zip_code ON service_areas(zip_code);

-- ============================================
-- 5. CREATE SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'residential_deep_clean',
    'residential_regular',
    'commercial_office',
    'commercial_janitorial',
    'move_in_out',
    'carpet_cleaning',
    'window_cleaning',
    'pressure_washing',
    'post_construction',
    'other'
  )),
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT CHECK (frequency IN ('one_time', 'weekly', 'bi_weekly', 'monthly', 'custom')),
  estimated_price_min DECIMAL(10,2),
  estimated_price_max DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- ============================================
-- 6. CREATE QUOTE REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_ids UUID[] NOT NULL,

  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Service Details
  service_category TEXT NOT NULL,
  service_description TEXT,
  property_type TEXT CHECK (property_type IN ('residential', 'commercial')) DEFAULT 'residential',

  -- Location
  property_address TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_zip TEXT,

  -- Additional Info
  preferred_date TEXT,
  preferred_time_window TEXT,
  additional_notes TEXT,

  -- Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'accepted', 'completed', 'cancelled')) DEFAULT 'pending',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_customer_id ON quote_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);

-- ============================================
-- 7. CREATE REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  -- Service Details
  service_category TEXT NOT NULL,
  service_date DATE NOT NULL,

  -- Verification
  verified BOOLEAN DEFAULT false,
  verification_method TEXT CHECK (verification_method IN ('quote_history', 'receipt_upload', 'manual')) DEFAULT 'manual',
  quote_request_id UUID REFERENCES quote_requests(id) ON DELETE SET NULL,

  -- Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')) DEFAULT 'pending',

  -- Business Response
  business_response TEXT,
  response_date TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- 8. CREATE BUSINESS PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS business_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Photo Info
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  photo_type TEXT CHECK (photo_type IN ('portfolio', 'before_after', 'team', 'facility')) DEFAULT 'portfolio',

  -- Ordering
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_photos_business_id ON business_photos(business_id);
CREATE INDEX IF NOT EXISTS idx_business_photos_display_order ON business_photos(business_id, display_order);

-- ============================================
-- 9. CREATE SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Subscription Info
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL CHECK (plan_name IN ('starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled')) DEFAULT 'trialing',

  -- Trial Info
  trial_starts_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- Billing Info
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  billing_cycle_start TIMESTAMP WITH TIME ZONE,
  billing_cycle_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,

  -- Pricing
  monthly_price DECIMAL(10,2),
  yearly_price DECIMAL(10,2),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- ============================================
-- 10. CREATE BUSINESS ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS business_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Metrics
  profile_views INTEGER DEFAULT 0,
  contact_clicks INTEGER DEFAULT 0,
  quote_requests_count INTEGER DEFAULT 0,
  search_impressions INTEGER DEFAULT 0,

  -- Date tracking
  date DATE NOT NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(business_id, date)
);

CREATE INDEX IF NOT EXISTS idx_business_analytics_business_id ON business_analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_business_analytics_date ON business_analytics(date);

-- ============================================
-- 11. CREATE AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,

  -- Action Info
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,

  -- Changes
  old_values JSONB,
  new_values JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Users: Read own data
DROP POLICY IF EXISTS "Users can read their own data" ON users;
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users: Update own data
DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Businesses: Read active businesses
DROP POLICY IF EXISTS "Anyone can read active businesses" ON businesses;
CREATE POLICY "Anyone can read active businesses" ON businesses
  FOR SELECT
  USING (status = 'active');

-- Businesses: Business owners update their business
DROP POLICY IF EXISTS "Business owners can update their business" ON businesses;
CREATE POLICY "Business owners can update their business" ON businesses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = businesses.id
      AND business_owners.user_id = auth.uid()
      AND business_owners.role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_owners
      WHERE business_owners.business_id = businesses.id
      AND business_owners.user_id = auth.uid()
      AND business_owners.role IN ('owner', 'manager')
    )
  );

-- Reviews: Read approved reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT
  USING (status = 'approved');

-- Reviews: Create reviews
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Quote Requests: Read own
DROP POLICY IF EXISTS "Customers can read their own quote requests" ON quote_requests;
CREATE POLICY "Customers can read their own quote requests" ON quote_requests
  FOR SELECT
  USING (auth.uid() = customer_id);

-- Quote Requests: Create
DROP POLICY IF EXISTS "Authenticated users can create quote requests" ON quote_requests;
CREATE POLICY "Authenticated users can create quote requests" ON quote_requests
  FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- All tables created successfully!
-- 11 tables total:
-- ✅ users
-- ✅ business_owners
-- ✅ businesses
-- ✅ service_areas
-- ✅ services
-- ✅ quote_requests
-- ✅ reviews
-- ✅ business_photos
-- ✅ subscriptions
-- ✅ business_analytics
-- ✅ audit_logs
