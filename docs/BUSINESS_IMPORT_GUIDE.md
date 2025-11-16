# Business Import Guide

Complete guide to importing cleaning services data and building your directory.

## 🎯 Overview

To solve the "empty directory" problem, you'll need to bootstrap your platform with business listings. This guide covers legal, ethical, and technical approaches.

---

## ⚖️ Legal & Ethical Considerations

### What You CAN Do (Low Risk)

1. **Public Business Data**
   - Business name, address, phone (NAP) is generally public information
   - Can be manually collected and entered
   - Similar to how Yellow Pages, Yelp, Google compile data

2. **API-Based Collection**
   - Google Places API (paid, official)
   - Yelp Fusion API (free tier available)
   - Public business registries (Tennessee SOS, Nashville business licenses)

3. **Manual Research**
   - Manually visit websites and copy information
   - Phone verification of business details
   - Cross-reference multiple sources

### What's RISKY (Proceed with Caution)

1. **Automated Web Scraping**
   - ⚠️ Violates most Terms of Service (Google, Yelp, Yellow Pages)
   - ⚖️ Legal gray area - data is public but collection method matters
   - 🚨 Risk: Cease & desist letters, IP blocks, potential lawsuits

   **If you proceed anyway:**
   - Use rate limiting (slow, respectful scraping)
   - Rotate IPs and user agents
   - Consider it temporary bootstrapping only
   - Have opt-out mechanism ready
   - Don't sell or redistribute scraped data

2. **Purchasing Business Lists**
   - Some data brokers sell business contact lists
   - Verify the data source is legitimate
   - Check licensing terms carefully

### Required Best Practices

1. **Business Claiming System**
   - Allow businesses to claim/verify their listing
   - Provide easy opt-out mechanism
   - Respond promptly to removal requests

2. **Verification & Accuracy**
   - Mark imported listings as "unverified"
   - Don't publish fake reviews
   - Update information when businesses report errors

3. **Transparency**
   - Terms of Service should mention how you collect data
   - Privacy policy should cover business data handling
   - Consider adding "Claim this business" badge on unclaimed listings

---

## 🛠️ Import Methods

### Method 1: Google Places API (RECOMMENDED)

**Pros:**
- ✅ Official, legal, terms-compliant
- ✅ Rich, accurate data
- ✅ Includes ratings and reviews count
- ✅ Business hours, website, photos

**Cons:**
- 💰 Costs ~$17 per 1,000 searches
- 🔧 Requires API key setup

**Cost Estimate:**
- Nashville cleaning services: ~300-500 businesses
- Cost: $10-20 one-time

**Setup:**
1. Get API key: https://console.cloud.google.com/apis/credentials
2. Enable Places API (New)
3. Set up billing (they give $200/month free credit)
4. Add `GOOGLE_PLACES_API_KEY` to `.env.local`

**Usage:**
```bash
npm install axios
node scripts/import-businesses-google.js
```

### Method 2: CSV Import

**Best for:**
- Manual data compilation
- Small datasets (50-100 businesses)
- Data from multiple sources

**Usage:**
1. Edit `scripts/businesses-template.csv`
2. Add your business data
3. Run:
```bash
npm install csv-parser
node scripts/import-businesses-csv.js scripts/businesses-template.csv
```

### Method 3: Yelp Fusion API

**Pros:**
- ✅ Free tier available (5,000 calls/day)
- ✅ Good data quality
- ✅ Includes reviews and ratings

**Cons:**
- ⚠️ Terms prohibit using data to build competing directory
- 📋 Requires approval for some use cases

**Setup:**
1. Apply for API access: https://www.yelp.com/developers/v3/manage_app
2. Read terms carefully regarding acceptable use
3. Consider for supplementary data only

### Method 4: Public Business Registries

**Free & Legal Sources:**

1. **Tennessee Secretary of State**
   - https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx
   - Search for "cleaning service" LLCs
   - Manual export available

2. **Nashville Business Licenses**
   - https://www.nashville.gov/departments/finance/revenue/business-tax-license
   - Public records request for licensed cleaning services

3. **Better Business Bureau**
   - https://www.bbb.org/
   - Smaller dataset, but verified businesses

---

## 📋 Step-by-Step Import Process

### Phase 1: Data Collection (Days 1-3)

**Option A: Google Places API (Fast)**
```bash
# Setup
npm install axios dotenv @supabase/supabase-js

# Add to .env.local
GOOGLE_PLACES_API_KEY=your_api_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# Run import
node scripts/import-businesses-google.js
```

**Expected output:**
- 300-500 Nashville cleaning businesses
- Imported with status='pending'
- Basic info: name, address, phone, website, ratings

**Option B: Manual CSV (Thorough)**
1. Research 50-100 top businesses manually
2. Verify they're active (call or visit website)
3. Categorize as residential/commercial/both
4. Fill out CSV template
5. Import via CSV script

### Phase 2: Data Enrichment (Days 4-7)

**1. Add Service Areas**
```bash
node scripts/add-service-areas.js
```
This adds Nashville neighborhoods to each business.

**2. Manual Verification (Top 50 Businesses)**
- Call to verify still in business
- Check if they have insurance/licensing
- Note specialties (eco-friendly, move-out, deep cleaning)
- Update service_type accuracy

**3. Categorize Services**
Manually add to `services` table:
- Residential: regular cleaning, deep cleaning, move-out
- Commercial: office cleaning, janitorial, post-construction

**4. Change Status**
For verified businesses, update:
```sql
UPDATE businesses
SET status = 'active', verified = true
WHERE id = 'business-uuid-here';
```

### Phase 3: Outreach (Days 8-14)

**Goal:** Get 10-20 businesses to claim their listings

**Email Template:**
```
Subject: Your business is listed on Nashville Cleaning Directory

Hi [Business Name],

I'm reaching out because I've added your business to our new Nashville
Cleaning Services directory (NashvilleCleaningDirectory.com).

We're helping Nashville residents find trusted local cleaning services,
and we'd love to have you officially claim your listing.

What you get:
- Free basic listing with your contact info and services
- Ability to respond to customer quote requests
- Analytics on how many people view your listing

To claim your listing, just click here: [claim link]

If you'd prefer not to be listed, you can opt out here: [opt-out link]

Thanks,
[Your Name]
```

**Channels:**
- Email (if you have it)
- Phone call (more personal, higher conversion)
- LinkedIn message to business owner
- Social media DM

**Success Metric:** 20% claim rate = 10-20 active, engaged businesses

### Phase 4: Activation (Days 15-30)

**1. Mark Active Businesses**
- Set status='active' for claimed businesses
- Keep unclaimed as status='pending'

**2. Get Business Photos**
- Ask businesses to upload portfolio photos
- Alternatively, use Google Places photos (with proper attribution)

**3. Collect Services & Pricing**
- Have businesses add their service offerings
- Estimated price ranges
- Service areas they actually serve

---

## 🔄 Post-Import Checklist

### Technical

- [ ] All imported businesses have `status='pending'`
- [ ] Service areas added for each business
- [ ] Duplicate detection working (prevent reimporting same business)
- [ ] Business claiming flow implemented
- [ ] Opt-out mechanism in place

### Verification

- [ ] Top 50 businesses manually verified (called/website checked)
- [ ] Service types correctly categorized (residential/commercial/both)
- [ ] Addresses are properly formatted and geocoded
- [ ] Phone numbers are valid and formatted consistently

### Legal/Compliance

- [ ] Terms of Service mention data collection methods
- [ ] Privacy policy covers business data
- [ ] "Claim this business" badge on unclaimed listings
- [ ] Easy opt-out process documented
- [ ] Contact email for business inquiries

### Quality Control

- [ ] No permanently closed businesses
- [ ] No duplicate listings
- [ ] All active businesses have valid phone/website
- [ ] Descriptions are professional (not placeholder text)
- [ ] Service areas make sense geographically

---

## 🎯 Business Claiming Flow

### Database Changes Needed

Add a `claimed` boolean and `claimed_at` timestamp to `businesses` table:

```sql
ALTER TABLE businesses
ADD COLUMN claimed BOOLEAN DEFAULT false,
ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE;
```

### Claiming Process

1. **Business visits their listing page**
   - See "Claim this business" button if unclaimed

2. **Verification options:**
   - **Phone verification**: Send SMS code to business phone on file
   - **Email verification**: Send to business email domain
   - **Manual verification**: Business uploads proof (license, utility bill)

3. **Once verified:**
   - Link business to user account
   - Insert into `business_owners` table
   - Set `claimed=true`, `status='active'`
   - Grant access to dashboard

4. **Business can then:**
   - Edit their information
   - Add photos and services
   - Respond to quote requests
   - View analytics

---

## 📊 Success Metrics

### Week 1-2 (Import Phase)
- [ ] 300+ businesses imported
- [ ] 90%+ have valid phone/address
- [ ] 50+ manually verified as active

### Week 3-4 (Outreach Phase)
- [ ] 100+ businesses contacted
- [ ] 10-20 businesses claimed listings (10-20% conversion)
- [ ] 5+ businesses added photos/services

### Month 2-3 (Activation Phase)
- [ ] 50+ active, claimed businesses
- [ ] 200+ total directory listings
- [ ] Businesses starting to receive quote requests

---

## 🚨 Common Issues & Solutions

### Issue: Too Many Duplicates

**Solution:**
- Improve duplicate detection logic
- Check by name + address combination
- Use fuzzy matching for similar names

### Issue: Outdated/Closed Businesses

**Solution:**
- Manual verification of top businesses
- Automated checks via Google Places API (business_status field)
- Remove after failed contact attempts

### Issue: Businesses Want to Be Removed

**Solution:**
- Honor removal requests within 48 hours
- Add to "do not list" table to prevent reimport
- Document removal process in Terms of Service

### Issue: Inaccurate Data

**Solution:**
- Encourage businesses to claim and correct
- Cross-reference multiple sources (Google, Yelp, website)
- Mark unverified data clearly

---

## 🔮 Next Steps After Import

1. **Build Claiming Flow**
   - Phone/email verification system
   - Business owner dashboard improvements
   - Automated welcome emails

2. **Implement Quote Request System**
   - This is THE key feature for business value
   - Email notifications to businesses
   - Response tracking and follow-up

3. **SEO Optimization**
   - Individual business profile pages with schema markup
   - Neighborhood landing pages
   - Blog content targeting local keywords

4. **Start Monetization**
   - Once businesses are receiving leads, introduce paid tiers
   - Featured placement for paying customers
   - Premium features (analytics, priority placement)

---

## 📞 Support & Resources

**Google Places API:**
- Docs: https://developers.google.com/maps/documentation/places/web-service
- Pricing: https://mapsplatform.google.com/pricing/

**Yelp Fusion API:**
- Docs: https://www.yelp.com/developers/documentation/v3
- Terms: https://www.yelp.com/developers/api_terms

**Legal Resources:**
- Web Scraping Legal Guide: https://blog.apify.com/is-web-scraping-legal/
- Data Collection Best Practices: https://www.eff.org/issues/privacy

**Questions?**
Review the scripts in `/scripts` directory for implementation details.
