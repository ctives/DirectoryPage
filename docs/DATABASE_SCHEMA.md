# Database Schema Design

 

**Database:** PostgreSQL (via Supabase)

**ORM:** Prisma or Supabase Client (to be decided)

 

---

 

## Core Tables

 

### 1. `profiles` (User Authentication)

Managed by Supabase Auth, extended with custom fields

 

```sql

CREATE TABLE profiles (

  id UUID PRIMARY KEY REFERENCES auth.users(id),

  email TEXT UNIQUE NOT NULL,

  role TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'business_owner' | 'admin'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

```

 

---

 

### 2. `businesses`

Core table for cleaning service companies

 

```sql

CREATE TABLE businesses (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

 

  -- Basic Info

  business_name TEXT NOT NULL,

  slug TEXT UNIQUE NOT NULL, -- URL-friendly: /profile/sparkle-clean-nashville

  description TEXT,

  phone TEXT NOT NULL,

  email TEXT NOT NULL,

  website TEXT,

 

  -- Profile Tier

  subscription_tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'premium' | 'premium_plus'

  subscription_status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'suspended'

  subscription_start_date TIMESTAMP WITH TIME ZONE,

  subscription_end_date TIMESTAMP WITH TIME ZONE,

  stripe_customer_id TEXT,

  stripe_subscription_id TEXT,

 

  -- Location & Service Area

  primary_address JSONB, -- {street, city, state, zip, lat, lng}

  service_zipcodes TEXT[], -- Array of zip codes they serve

  service_radius INTEGER, -- Miles from primary address (premium feature)

 

  -- Business Details

  years_in_business INTEGER,

  business_hours JSONB, -- {monday: {open: '8:00', close: '17:00'}, ...}

  languages_spoken TEXT[], -- ['English', 'Spanish', 'French']

 

  -- Verification & Trust

  is_verified BOOLEAN DEFAULT false,

  is_insured BOOLEAN DEFAULT false,

  is_bonded BOOLEAN DEFAULT false,

  insurance_expiry_date DATE,

  background_check_verified BOOLEAN DEFAULT false,

  bbb_rating TEXT, -- 'A+', 'A', 'B', etc.

 

  -- Media (limits based on tier)

  logo_url TEXT,

  photos JSONB[], -- Array of {url, caption, order}

  videos JSONB[], -- Array of {url, caption, order}

 

  -- Stats

  total_views INTEGER DEFAULT 0,

  total_contacts INTEGER DEFAULT 0,

  total_quote_requests INTEGER DEFAULT 0,

  average_response_time_hours DECIMAL,

 

  -- Status

  status TEXT DEFAULT 'active', -- 'active' | 'pending' | 'suspended' | 'deleted'

  claimed BOOLEAN DEFAULT false, -- Has the owner claimed this profile?

 

  -- Timestamps

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

 

  -- Indexes

  CONSTRAINT valid_tier CHECK (subscription_tier IN ('free', 'premium', 'premium_plus'))

);

 

-- Indexes for performance

CREATE INDEX idx_businesses_subscription_tier ON businesses(subscription_tier);

CREATE INDEX idx_businesses_status ON businesses(status);

CREATE INDEX idx_businesses_service_zipcodes ON businesses USING GIN(service_zipcodes);

CREATE INDEX idx_businesses_slug ON businesses(slug);

```

 

---

 

### 3. `service_categories`

Predefined cleaning service types

 

```sql

CREATE TABLE service_categories (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL UNIQUE, -- 'Residential Cleaning', 'Commercial Cleaning'

  slug TEXT NOT NULL UNIQUE, -- 'residential-cleaning'

  icon TEXT, -- Icon name or SVG

  description TEXT,

  display_order INTEGER DEFAULT 0,

  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

-- Pre-populate with categories

INSERT INTO service_categories (name, slug, display_order) VALUES

  ('Residential Cleaning', 'residential-cleaning', 1),

  ('Commercial Cleaning', 'commercial-cleaning', 2),

  ('Deep Cleaning', 'deep-cleaning', 3),

  ('Move-In / Move-Out', 'move-in-out', 4),

  ('Post-Construction', 'post-construction', 5),

  ('Window Cleaning', 'window-cleaning', 6),

  ('Carpet Cleaning', 'carpet-cleaning', 7),

  ('Pressure Washing', 'pressure-washing', 8),

  ('AirBnB Turnover', 'airbnb-turnover', 9),

  ('Post-Event Cleaning', 'post-event', 10);

```

 

---

 

### 4. `business_services`

Join table: which services does each business offer?

 

```sql

CREATE TABLE business_services (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,

 

  -- Optional service-specific details

  starting_price DECIMAL(10,2), -- Minimum price for this service

  price_type TEXT, -- 'per_hour' | 'per_sqft' | 'flat_rate' | 'custom'

  description TEXT, -- Business-specific description for this service

 

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

 

  UNIQUE(business_id, category_id)

);

 

CREATE INDEX idx_business_services_business ON business_services(business_id);

CREATE INDEX idx_business_services_category ON business_services(category_id);

```

 

---

 

### 5. `reviews` (PREMIUM ONLY)

Customer reviews for businesses

 

```sql

CREATE TABLE reviews (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Can be NULL for anonymous

 

  -- Review Content

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

  title TEXT,

  review_text TEXT NOT NULL,

 

  -- Trust Signals

  verified_customer BOOLEAN DEFAULT false, -- Did they actually book through platform?

  photos JSONB[], -- Customer can upload photos of the cleaned space

 

  -- Business Response

  response_text TEXT,

  response_date TIMESTAMP WITH TIME ZONE,

 

  -- Moderation

  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected' | 'flagged'

  flagged_reason TEXT,

 

  -- Timestamps

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

CREATE INDEX idx_reviews_business ON reviews(business_id);

CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_reviews_status ON reviews(status);

```

 

---

 

### 6. `neighborhoods`

Nashville neighborhoods for location-based search

 

```sql

CREATE TABLE neighborhoods (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL UNIQUE, -- 'Green Hills', '12 South'

  slug TEXT NOT NULL UNIQUE, -- 'green-hills'

  zip_codes TEXT[], -- Zip codes in this neighborhood

  description TEXT,

  featured BOOLEAN DEFAULT false,

  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

-- Pre-populate with Nashville neighborhoods

INSERT INTO neighborhoods (name, slug, zip_codes, display_order, featured) VALUES

  ('Green Hills', 'green-hills', ARRAY['37215'], 1, true),

  ('12 South', '12-south', ARRAY['37204'], 2, true),

  ('East Nashville', 'east-nashville', ARRAY['37206', '37216'], 3, true),

  ('The Gulch', 'the-gulch', ARRAY['37203'], 4, true),

  ('Germantown', 'germantown', ARRAY['37208'], 5, true),

  ('Belle Meade', 'belle-meade', ARRAY['37205'], 6, true),

  ('Downtown', 'downtown', ARRAY['37201', '37219'], 7, true),

  ('Brentwood', 'brentwood', ARRAY['37027'], 8, false),

  ('Franklin', 'franklin', ARRAY['37064', '37067'], 9, false);

```

 

---

 

### 7. `quote_requests`

When customers request quotes from businesses

 

```sql

CREATE TABLE quote_requests (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Can be NULL for anonymous

 

  -- Customer Info

  customer_name TEXT NOT NULL,

  customer_email TEXT NOT NULL,

  customer_phone TEXT,

 

  -- Service Details

  service_category_id UUID REFERENCES service_categories(id),

  service_address JSONB, -- {street, city, state, zip}

  service_date DATE,

  preferred_time TEXT, -- 'morning' | 'afternoon' | 'evening' | 'flexible'

 

  -- Additional Info

  property_type TEXT, -- 'house' | 'apartment' | 'condo' | 'office' | 'other'

  square_footage INTEGER,

  additional_notes TEXT,

 

  -- Status Tracking

  status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'quoted' | 'booked' | 'declined'

  business_response TEXT,

  business_responded_at TIMESTAMP WITH TIME ZONE,

 

  -- Timestamps

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

CREATE INDEX idx_quote_requests_business ON quote_requests(business_id);

CREATE INDEX idx_quote_requests_status ON quote_requests(status);

CREATE INDEX idx_quote_requests_created ON quote_requests(created_at DESC);

```

 

---

 

### 8. `promotions`

Special offers by businesses (Premium feature)

 

```sql

CREATE TABLE promotions (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

 

  title TEXT NOT NULL,

  description TEXT,

  discount_type TEXT, -- 'percentage' | 'fixed_amount' | 'free_service'

  discount_value DECIMAL(10,2),

 

  -- Validity

  start_date DATE NOT NULL,

  end_date DATE,

  max_redemptions INTEGER,

  current_redemptions INTEGER DEFAULT 0,

 

  -- Display

  featured BOOLEAN DEFAULT false,

  active BOOLEAN DEFAULT true,

 

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

CREATE INDEX idx_promotions_business ON promotions(business_id);

CREATE INDEX idx_promotions_active ON promotions(active);

```

 

---

 

### 9. `favorites`

Users can save favorite cleaning services

 

```sql

CREATE TABLE favorites (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

 

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

 

  UNIQUE(customer_id, business_id)

);

 

CREATE INDEX idx_favorites_customer ON favorites(customer_id);

CREATE INDEX idx_favorites_business ON favorites(business_id);

```

 

---

 

### 10. `analytics_events`

Track user interactions for Premium analytics

 

```sql

CREATE TABLE analytics_events (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

 

  event_type TEXT NOT NULL, -- 'profile_view' | 'phone_click' | 'email_click' | 'quote_request' | 'website_click'

 

  -- User Info (anonymized)

  session_id TEXT,

  user_agent TEXT,

  referrer TEXT,

 

  -- Location

  ip_address INET,

  city TEXT,

 

  -- Additional Data

  metadata JSONB, -- Flexible for different event types

 

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

CREATE INDEX idx_analytics_business ON analytics_events(business_id);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);

CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

 

-- Partition by month for performance (future optimization)

```

 

---

 

### 11. `admin_logs`

Track admin actions for moderation

 

```sql

CREATE TABLE admin_logs (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_id UUID REFERENCES profiles(id),

 

  action TEXT NOT NULL, -- 'approve_review' | 'suspend_business' | 'verify_business'

  target_type TEXT, -- 'business' | 'review' | 'user'

  target_id UUID,

 

  reason TEXT,

  metadata JSONB,

 

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

 

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);

CREATE INDEX idx_admin_logs_created ON admin_logs(created_at DESC);

```

 

---

 

## Row Level Security (RLS) Policies

 

Supabase uses PostgreSQL Row Level Security for data access control:

 

### Example Policies:

 

```sql

-- Businesses: Anyone can view active businesses

CREATE POLICY "Businesses are viewable by everyone"

  ON businesses FOR SELECT

  USING (status = 'active');

 

-- Businesses: Owners can update their own business

CREATE POLICY "Business owners can update their own business"

  ON businesses FOR UPDATE

  USING (auth.uid() = owner_id);

 

-- Reviews: Only visible if business is Premium

CREATE POLICY "Reviews visible for premium businesses"

  ON reviews FOR SELECT

  USING (

    EXISTS (

      SELECT 1 FROM businesses

      WHERE id = reviews.business_id

      AND subscription_tier IN ('premium', 'premium_plus')

    )

  );

 

-- Quote Requests: Only business owners see their own quotes

CREATE POLICY "Business owners see their quote requests"

  ON quote_requests FOR SELECT

  USING (

    EXISTS (

      SELECT 1 FROM businesses

      WHERE id = quote_requests.business_id

      AND owner_id = auth.uid()

    )

  );

```

 

---

 

## Indexes for Search Performance

 

```sql

-- Full-text search on business names and descriptions

CREATE INDEX idx_businesses_search

  ON businesses

  USING GIN(to_tsvector('english', business_name || ' ' || COALESCE(description, '')));

 

-- Geospatial search (for future radius-based queries)

-- Requires PostGIS extension

CREATE EXTENSION IF NOT EXISTS postgis;

-- Store lat/lng in primary_address JSONB, convert to geometry when needed

```

 

---

 

## Views for Common Queries

 

### Business with Average Rating

```sql

CREATE VIEW businesses_with_ratings AS

SELECT

  b.*,

  COALESCE(AVG(r.rating), 0) as average_rating,

  COUNT(r.id) as review_count

FROM businesses b

LEFT JOIN reviews r ON r.business_id = b.id AND r.status = 'approved'

GROUP BY b.id;

```

 

---

 

## Database Functions

 

### Update Business Stats

```sql

CREATE OR REPLACE FUNCTION update_business_stats(business_uuid UUID)

RETURNS void AS $$

BEGIN

  UPDATE businesses

  SET

    total_views = (

      SELECT COUNT(*) FROM analytics_events

      WHERE business_id = business_uuid AND event_type = 'profile_view'

    ),

    total_contacts = (

      SELECT COUNT(*) FROM analytics_events

      WHERE business_id = business_uuid

      AND event_type IN ('phone_click', 'email_click', 'quote_request')

    ),

    total_quote_requests = (

      SELECT COUNT(*) FROM quote_requests

      WHERE business_id = business_uuid

    )

  WHERE id = business_uuid;

END;

$$ LANGUAGE plpgsql;

```

 

---

 

## Migration Strategy

 

1. **Phase 1:** Core tables (businesses, profiles, categories, business_services)

2. **Phase 2:** Reviews, neighborhoods, quote_requests

3. **Phase 3:** Analytics, promotions, favorites

4. **Phase 4:** Advanced features (admin_logs, etc.)

 

---

 

## Storage Buckets (Supabase Storage)

 

For file uploads (photos, videos, certificates):

 

```

buckets/

├── business-logos/         # Public, 2MB limit

├── business-photos/        # Public, 5MB limit, max 15 per business

├── business-videos/        # Public, 50MB limit, max 2 per business

├── certificates/           # Private, 10MB limit (insurance, bonding)

└── review-photos/          # Public, 3MB limit

```

 

---

 

## Estimated Database Size

 

**Assumptions:**

- 500 businesses listed

- 50% Premium (250)

- 10 reviews per Premium business (2,500 reviews)

- 100 quote requests per month (1,200/year)

 

**Estimated Storage:**

- Businesses: ~500KB

- Reviews: ~2.5MB

- Quote Requests: ~1MB/year

- Analytics: ~5MB/year

- Photos (external storage): ~500MB (not in DB)

 

**Total DB Size: ~10MB** (well within Supabase free tier of 500MB)

 

---

 

**Next Steps:**

1. Set up Supabase project

2. Create migration files

3. Implement RLS policies

4. Create seed data for testing