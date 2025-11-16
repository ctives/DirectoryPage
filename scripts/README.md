# Import Scripts

Scripts for importing and managing cleaning service businesses in your directory.

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This installs: `axios`, `csv-parser`, `@supabase/supabase-js`, `dotenv`

### 2. Setup Environment Variables

Add to `.env.local`:
```bash
# Required for all scripts
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Required only for Google Places import
GOOGLE_PLACES_API_KEY=your_google_api_key
```

**⚠️ Important:** Use `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) to bypass Row Level Security.

---

## 🛠️ Available Scripts

### 1. Import from Google Places API (Recommended)

**What it does:**
- Searches for cleaning services in Nashville via Google Places API
- Fetches detailed business information
- Automatically categorizes as residential/commercial/both
- Deduplicates by place_id
- Imports to `businesses` table with status='pending'

**Cost:** ~$10-20 for 300-500 businesses

**Usage:**
```bash
# Via npm script
npm run import:google

# Or directly
node scripts/import-businesses-google.js
```

**Expected output:**
```
🔍 Searching for: "house cleaning service"
✅ Found 42 results

[1/250] Processing: ABC Cleaning Services
✅ Imported: ABC Cleaning Services (both)

📈 IMPORT SUMMARY
✅ Successfully imported: 237
⏭️  Skipped (duplicates):  13
❌ Errors:               0
```

---

### 2. Import from CSV

**What it does:**
- Imports businesses from a CSV file
- Validates data (required fields, service types)
- Checks for duplicates
- Great for manual data entry or small batches

**Usage:**
```bash
# Using template
npm run import:csv scripts/businesses-template.csv

# Using custom file
node scripts/import-businesses-csv.js path/to/your-data.csv
```

**CSV Format:**
See `businesses-template.csv` for an example.

Required columns:
- `name` (required)
- `city` (required, default: Nashville)
- `service_type` (residential/commercial/both)

Optional columns:
- `phone`, `website`, `email`, `address`, `zip_code`
- `description`, `years_in_business`, `languages`

---

### 3. Add Service Areas

**What it does:**
- Adds Nashville neighborhoods/zip codes to imported businesses
- Automatically assigns 5-10 service areas per business
- Residential businesses get broader coverage
- Commercial businesses get urban/business areas

**Usage:**
```bash
npm run add-service-areas

# Or directly
node scripts/add-service-areas.js
```

**What gets added:**
- Downtown Nashville, East Nashville, Green Hills, etc.
- Corresponding zip codes
- Nearby suburbs (Brentwood, Franklin, etc.)

**Run this after:** Any import script (Google or CSV)

---

### 4. Activate Businesses

**What it does:**
- Changes business status from 'pending' to 'active'
- Marks businesses as verified
- Three modes: interactive list, file-based, or bulk activate all

**Usage:**

**Interactive Mode (Recommended):**
```bash
npm run activate-businesses
```
Shows all pending businesses with IDs. Copy IDs you want to activate into a text file.

**Activate from File:**
```bash
node scripts/activate-businesses.js business-ids.txt
```

Where `business-ids.txt` contains:
```
550e8400-e29b-41d4-a716-446655440000
6ba7b810-9dad-11d1-80b4-00c04fd430c8
# Lines starting with # are ignored
```

**Activate All (Careful!):**
```bash
node scripts/activate-businesses.js --all
```

---

## 🔄 Typical Workflow

### Scenario 1: Google Places Import (Fast Bootstrap)

```bash
# 1. Import from Google Places
npm run import:google
# → Imports 300-500 businesses with status='pending'

# 2. Add service areas to all businesses
npm run add-service-areas
# → Adds Nashville neighborhoods to each business

# 3. Review pending businesses
npm run activate-businesses
# → Shows list of all pending businesses

# 4. Manually verify top 50 businesses
# Call them, check websites, verify they're active

# 5. Create file with verified IDs
echo "uuid-1\nuuid-2\nuuid-3" > verified-businesses.txt

# 6. Activate verified businesses
node scripts/activate-businesses.js verified-businesses.txt
# → Changes status to 'active' for verified businesses
```

### Scenario 2: Manual CSV Import (Quality Over Quantity)

```bash
# 1. Research 50-100 businesses manually
# Create CSV with accurate data

# 2. Import from CSV
npm run import:csv my-businesses.csv

# 3. Add service areas
npm run add-service-areas

# 4. Activate all (since you manually verified)
node scripts/activate-businesses.js --all
```

---

## 📊 Database Schema Reference

### Businesses Table

Imported businesses will have:

```sql
{
  id: UUID (auto-generated)
  name: TEXT (from Google/CSV)
  description: TEXT
  phone: TEXT
  website: TEXT
  address: TEXT
  city: TEXT (default: 'Nashville')
  state: TEXT (default: 'TN')
  zip_code: TEXT
  service_type: 'residential' | 'commercial' | 'both'

  -- Verification
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  verified: BOOLEAN (false for imports)
  claimed: BOOLEAN (false - business hasn't claimed listing)

  -- Ratings (from Google Places if available)
  average_rating: DECIMAL
  review_count: INTEGER

  -- Subscription
  subscription_tier: 'starter' (default for imports)
}
```

### Service Areas Table

Added by `add-service-areas.js`:

```sql
{
  business_id: UUID
  area_type: 'neighborhood'
  area_name: TEXT (e.g., 'Green Hills', 'East Nashville')
  zip_code: TEXT (e.g., '37215')
}
```

---

## 🚨 Important Notes

### Status Values

- **`pending`**: Imported but not verified. Won't show in public directory.
- **`active`**: Verified and visible to public. Shows in search results.
- **`suspended`**: Temporarily hidden (e.g., payment issues if paid tier)
- **`rejected`**: Business rejected/removed. Won't show in directory.

### Claimed vs Unclaimed

- Imported businesses are **unclaimed** (no user account associated)
- Should show "Claim this business" badge on profile page
- Once claimed, links to `business_owners` table

### Duplicates

Scripts check for duplicates by:
- Business name + address combination
- Google Place ID (for Google imports)

If a business already exists, it will be skipped.

### Rate Limiting

Google Places API script has built-in rate limiting:
- 1 second between search queries
- 0.5 seconds between detail requests
- 0.5 seconds between database inserts

**Do not remove these delays** or you risk hitting API rate limits.

---

## 🔧 Troubleshooting

### Error: "GOOGLE_PLACES_API_KEY not found"

Add your API key to `.env.local`:
```bash
GOOGLE_PLACES_API_KEY=AIzaSyC...
```

Get a key: https://console.cloud.google.com/apis/credentials

### Error: "SUPABASE_SERVICE_ROLE_KEY not found"

You need the **service role key** (not the anon key) to bypass RLS:
1. Go to Supabase Dashboard → Settings → API
2. Copy "service_role" key (keep it secret!)
3. Add to `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Error: "Row Level Security policy violation"

You're using the anon key instead of service role key. Import scripts need to bypass RLS to insert businesses without authentication.

### Error: "Duplicate key value violates unique constraint"

A business with that name + address already exists. The script should skip it automatically, but if not, check for exact duplicates in your database.

### Too Many Closed Businesses

Google Places API sometimes returns permanently closed businesses. After import:
1. Run activate script in interactive mode
2. Manually verify top businesses are active
3. Only activate the verified ones

---

## 📖 Additional Resources

**Full Documentation:**
- See `docs/BUSINESS_IMPORT_GUIDE.md` for comprehensive guide
- Includes legal considerations, best practices, and claiming flow

**API Documentation:**
- Google Places API: https://developers.google.com/maps/documentation/places
- Supabase JavaScript Client: https://supabase.com/docs/reference/javascript

**Questions?**
Check the inline comments in each script for implementation details.
