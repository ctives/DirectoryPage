# Quick Start: Database Setup

## Option 1: Run Everything at Once (Recommended) ⚡

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on your project
3. In the left sidebar, click **"SQL Editor"**
4. Click the **"+"** button to create a new query

### Step 2: Copy the Complete SQL Script
1. Open this file: `docs/CREATE_ALL_TABLES.sql`
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (bottom right)
5. Wait for the success message

### Step 3: Verify Tables Were Created
1. In the left sidebar, click **"Tables"**
2. You should see all 11 tables:
   - ✅ users
   - ✅ business_owners
   - ✅ businesses
   - ✅ service_areas
   - ✅ services
   - ✅ quote_requests
   - ✅ reviews
   - ✅ business_photos
   - ✅ subscriptions
   - ✅ business_analytics
   - ✅ audit_logs

**Done!** Your database is ready. 🎉

---

## Option 2: Step-by-Step Manual Setup

If you prefer to create tables one at a time:

1. **Go to SQL Editor** → Click "+"
2. **Create Users Table**
   - Copy from `docs/DATABASE_SETUP.md` - Section 1
   - Run the query
3. **Create Business Owners Table**
   - Copy from `docs/DATABASE_SETUP.md` - Section 2
   - Run the query
4. **Continue for each section** in order (2-11)

### Note on Order
Create tables in this order to avoid foreign key errors:
1. users (referenced by others)
2. business_owners
3. businesses (referenced by others)
4. service_areas
5. services
6. quote_requests (references users)
7. reviews (references businesses, users, quote_requests)
8. business_photos
9. subscriptions
10. business_analytics
11. audit_logs

---

## Table Overview

### Core Tables

**users** (Authentication)
- All user accounts (customers, business owners, admins)
- Role: customer, business, admin
- 🔑 Primary key: id (links to auth.users)

**businesses** (Business Profiles)
- Cleaning company information
- Status: pending, active, suspended, rejected
- Ratings, subscription tier, verification status

**business_owners** (Ownership)
- Links users to businesses they own/manage
- Tracks verification status
- Supports multiple owners per business

### Service Tables

**service_areas** (Coverage)
- Neighborhoods, zip codes where business operates
- Enables geo-filtering on search

**services** (Offerings)
- Types of cleaning services each business offers
- Categories, pricing, frequency options

### Customer Interaction Tables

**quote_requests** (Lead Generation)
- Customer requests for quotes
- Tracks which businesses were contacted
- Status: pending, sent, accepted, completed, cancelled

**reviews** (Social Proof)
- Customer reviews and ratings (1-5 stars)
- Verification status (quote history, receipt, manual)
- Business can respond to reviews

**business_photos** (Portfolio)
- Business images for portfolio/before-after
- Display order, thumbnail generation

### Admin Tables

**subscriptions** (Billing)
- Tracks plan tier, status, trial info
- Stripe integration for payments
- Billing cycle tracking

**business_analytics** (Metrics)
- Daily view counts, contact clicks, quote requests
- Helps businesses understand performance

**audit_logs** (Security)
- Logs of all admin actions
- Change history (old_values, new_values)
- IP address and user agent tracking

---

## Security: Row Level Security (RLS)

The SQL script automatically:
- ✅ Enables RLS on all tables
- ✅ Creates policies for data access control
- ✅ Prevents unauthorized data access

### What This Means

Users can only:
- Read their own user profile
- See active businesses (not pending/suspended)
- Read approved reviews
- Read/write their own quote requests
- Create reviews

Business owners can only:
- Update their own business profile
- View their own analytics

Admins can access everything via database triggers/policies.

---

## Next Steps After Database Setup

1. **Test the connection in your app:**
   ```bash
   npm run dev
   # Try signing up at http://localhost:3000/auth/signup
   ```

2. **Add test data:**
   - Create a test business account
   - Add a test business profile
   - Create test services
   - Add test reviews

3. **Set up automatic backups:**
   - Go to Supabase → Settings → Backups
   - Enable automatic daily backups

4. **Monitor database usage:**
   - Go to Supabase → Logs → Database logs
   - Check for any errors

---

## Troubleshooting

### Error: "Relation already exists"
**Solution:** The script includes `IF NOT EXISTS`, so it won't error on re-runs. Safe to run again.

### Error: "Foreign key constraint failed"
**Solution:** Make sure you created tables in the correct order. Reference the "Note on Order" section above.

### Error: "RLS policy already exists"
**Solution:** The script includes `DROP POLICY IF EXISTS` to handle this. Safe to re-run.

### Can't see tables after creation
**Solution:**
1. Refresh your browser (Cmd+R or Ctrl+R)
2. Go to SQL Editor → Click a query again
3. Click "Tables" in sidebar

---

## Database Statistics

**Total Tables:** 11
**Total Columns:** ~100
**Total Indexes:** ~30
**Max expected rows:** 100,000+

**Estimated database size:**
- MVP phase: 50MB
- After 1,000 businesses: ~200MB
- After 10,000 businesses: ~500MB

---

## Important Notes

⚠️ **Do NOT:**
- Manually delete tables without understanding dependencies
- Modify column names without updating the app
- Change security policies without testing

✅ **Do:**
- Keep backups enabled
- Monitor query performance
- Review audit logs regularly

---

## Success Checklist

- [ ] Created Supabase project
- [ ] Added Supabase URL and keys to `.env.local`
- [ ] Ran the database creation script
- [ ] Verified all 11 tables exist
- [ ] Tested signup page connects to database
- [ ] Created test user account

Once all checked, you're ready to build the application features! 🚀
