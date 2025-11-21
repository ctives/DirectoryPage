# Business Claiming Feature - Implementation Guide

## Overview
This document outlines the business claiming feature implementation, including setup instructions, database schema changes, and API endpoints.

## Phase 1: Database & Infrastructure ✅ COMPLETED

### 1. Database Migrations
Run the following SQL in your Supabase dashboard:
**File**: `docs/ADD_CLAIM_REQUESTS.sql`

This migration adds:
- `claimed`, `claimed_at`, `claimed_by` columns to `businesses` table
- `claim_requests` table to track claim submissions
- `verification_codes` table to store magic link codes
- RLS policies for security

### 2. Resend Email Service Setup
Resend is already installed via npm. Configure it:

1. **Get your API key**:
   - Go to https://resend.com
   - Sign up if you haven't
   - Copy your API key

2. **Add to `.env.local`**:
   ```bash
   RESEND_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_APP_EMAIL=noreply@cleaningdirectory.com
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ADMIN_EMAIL=your-admin-email@example.com
   ```

3. **Verify email domain** (for production):
   - Add your sending domain to Resend dashboard
   - Update `NEXT_PUBLIC_APP_EMAIL` to use your domain

### 3. Supabase Storage Setup
Create a storage bucket for business photos:

1. Go to Supabase dashboard → Storage
2. Create new bucket: `business-photos`
3. Set visibility: **Public** (photos should be publicly viewable)
4. Run this SQL to add RLS policies:

```sql
-- Business Photos bucket policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of business photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-photos');

CREATE POLICY "Allow owners to upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-photos' AND
  auth.uid() IN (
    SELECT user_id FROM business_owners
    WHERE business_id = (split_part(name, '/', 1))::uuid
  )
);

CREATE POLICY "Allow owners to delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-photos' AND
  auth.uid() IN (
    SELECT user_id FROM business_owners
    WHERE business_id = (split_part(name, '/', 1))::uuid
  )
);
```

## Phase 2: Frontend Components ✅ COMPLETED

### Files Created:

#### 1. **`app/claim/[businessId]/page.tsx`**
- Initial claim form page
- Collects: first name, last name, email, phone
- Submits to `/api/claim/submit`
- Shows success message and redirects to verification

#### 2. **`app/claim/[businessId]/verify/page.tsx`**
- Verification code entry page
- User enters 6-digit code received via email
- Submits to `/api/claim/verify`
- Includes resend code button with cooldown

#### 3. **`app/claim/success/page.tsx`**
- Success confirmation page
- Explains next steps (admin review)
- Directs user back to directory

#### 4. **`components/ClaimBusinessBanner.tsx`**
- Prominent banner on business detail pages
- Only shows if `business.claimed === false`
- Links to claim form

#### 5. **Updated `app/business/[id]/page.tsx`**
- Added import for `ClaimBusinessBanner`
- Added `claimed` field to Business interface
- Added conditional rendering of banner before business details

## Phase 2: API Endpoints ✅ COMPLETED

### 1. **`POST /api/claim/submit`**
**Purpose**: Submit a business claim request

**Request Body**:
```json
{
  "businessId": "uuid",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

**Response**:
```json
{
  "success": true,
  "claimId": "uuid",
  "message": "Claim request submitted..."
}
```

**What it does**:
1. Validates input
2. Checks if business exists and not already claimed
3. Creates `claim_requests` record
4. Generates 6-digit verification code
5. Stores code in `verification_codes` table (24hr expiry)
6. Sends magic link email to user
7. Sends admin notification email

### 2. **`POST /api/claim/verify`**
**Purpose**: Verify email via code and create user account

**Request Body**:
```json
{
  "code": "string (6 digits)",
  "email": "string"
}
```

**Response**:
```json
{
  "success": true,
  "claimId": "uuid",
  "businessId": "uuid",
  "userId": "uuid",
  "message": "Email verified successfully"
}
```

**What it does**:
1. Validates verification code
2. Checks code not expired or already used
3. Creates Supabase auth user (if not exists)
4. Creates `users` table record
5. Links user to claim request
6. Marks code as verified
7. Redirects to success page

### 3. **`POST /api/admin/claims/[id]/approve`** (Protected)
**Purpose**: Admin approves a business claim

**Authentication**: Requires NextAuth session with `role: 'admin'`

**Request Body**:
```json
{
  "notes": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Claim approved successfully"
}
```

**What it does**:
1. Validates admin authorization
2. Updates `claim_requests` status to `approved`
3. Updates `businesses.claimed = true`
4. Creates `business_owners` record (owner role)
5. Sends approval email to claimant
6. Redirects to dashboard

### 4. **`POST /api/admin/claims/[id]/reject`** (Protected)
**Purpose**: Admin rejects a business claim

**Authentication**: Requires NextAuth session with `role: 'admin'`

**Request Body**:
```json
{
  "reason": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Claim rejected successfully"
}
```

**What it does**:
1. Validates admin authorization
2. Updates `claim_requests` status to `rejected`
3. Stores rejection reason in `admin_notes`
4. Sends rejection email to claimant

## Phase 3: Email Service ✅ COMPLETED

### Email Templates Created:

All emails use professional HTML templates from `lib/email.ts`:

#### 1. **Magic Link Email** (`sendMagicLinkEmail`)
- Sent when claim form submitted
- Contains verification link and business name
- 24-hour expiry notice

#### 2. **Admin Notification Email** (`sendClaimNotificationEmail`)
- Sent to admin when claim submitted
- Includes claimant info: name, email, phone
- Direct approve/reject action links

#### 3. **Claim Approved Email** (`sendClaimApprovedEmail`)
- Sent to claimant when admin approves
- Includes link to business dashboard
- Congratulations message

#### 4. **Claim Rejected Email** (`sendClaimRejectedEmail`)
- Sent to claimant when admin rejects
- Includes rejection reason (if provided)
- Professional tone

## Phase 4: Next Steps - Not Yet Implemented

### Admin Claims Review Interface
**Files to create**:
- `app/admin/claims/page.tsx` - List pending claims
- `app/admin/claims/[id]/page.tsx` - Claim detail & action buttons

### Business Owner Dashboard
**Files to create**:
- `app/dashboard/business/page.tsx` - Business owner dashboard
- `app/dashboard/business/edit/page.tsx` - Edit business info
- `components/PhotoUpload.tsx` - Single photo upload

### Business Update API
**File to create**:
- `app/api/business/update/route.ts` - Update description, phone, email, website

### Photo Upload API
**File to create**:
- `app/api/business/upload-photo/route.ts` - Upload single photo to Supabase Storage

## User Flow Summary

### Step 1: Discovery
- User visits business detail page
- Sees "Claim This Business" banner (if not claimed)

### Step 2: Claim Submission
- User clicks "Claim This Business"
- Redirected to `/claim/[businessId]`
- Fills form: first name, last name, email, phone
- Submits form

### Step 3: Email Verification
- User receives email with 6-digit code
- Navigates to verification page
- Enters code to verify email
- Account created automatically

### Step 4: Admin Review
- Admin receives notification email
- Reviews claim in admin panel
- Approves or rejects
- User receives approval/rejection email

### Step 5: Dashboard Access
- User can log in with email (magic link)
- Access business dashboard
- Edit description, contact info
- Upload photos

## Testing the Feature

### Test Claim Flow:
1. Go to any business detail page
2. Click "Claim This Business"
3. Fill in form with test data
4. Check email (test inbox) for verification code
5. Enter code on verification page
6. Confirm success page

### Test Admin Review:
1. Check admin email for claim notification
2. In admin panel: navigate to pending claims
3. Review claim details
4. Click approve/reject
5. Check claimant email for approval/rejection

## Security Considerations

✅ **Implemented**:
- Email verification via code (not instant)
- Admin approval required (not auto)
- RLS policies on claims table
- Service role key for backend operations
- NextAuth session validation for admin routes
- Rate limiting on code generation (60sec)

🔄 **Consider for Future**:
- Phone verification via SMS (Twilio)
- CAPTCHA on claim form
- IP address logging for fraud detection
- Business license verification
- Domain verification (auto-approve matching domains)

## Troubleshooting

### Emails not sending:
- Check RESEND_API_KEY in .env.local
- Check ADMIN_EMAIL is correct
- Check Resend dashboard for errors
- Verify domain is added to Resend (production)

### Code not received:
- Check spam/junk folder
- Check Resend logs in dashboard
- Verify NEXT_PUBLIC_APP_URL is correct
- Check email in claim_requests table

### Claim request stuck in pending:
- Check claim_requests table status
- Run admin approval endpoint manually
- Check admin email for notification

## Database Views

### Check pending claims:
```sql
SELECT * FROM claim_requests WHERE status = 'pending';
```

### Check all claims for a business:
```sql
SELECT * FROM claim_requests WHERE business_id = 'your-business-id';
```

### Check verification codes:
```sql
SELECT * FROM verification_codes WHERE verified = false AND expires_at > now();
```

### Mark business as claimed:
```sql
UPDATE businesses SET claimed = true WHERE id = 'business-id';
```

## Files Created/Modified

### Created:
- `docs/ADD_CLAIM_REQUESTS.sql` - Database migrations
- `lib/email.ts` - Email service functions
- `lib/storage.ts` - Photo upload utilities
- `app/api/claim/submit/route.ts` - Claim submission
- `app/api/claim/verify/route.ts` - Email verification
- `app/api/admin/claims/[id]/approve/route.ts` - Approve claim
- `app/api/admin/claims/[id]/reject/route.ts` - Reject claim
- `app/claim/[businessId]/page.tsx` - Claim form page
- `app/claim/[businessId]/verify/page.tsx` - Verification page
- `app/claim/success/page.tsx` - Success page
- `components/ClaimBusinessBanner.tsx` - Banner component
- `docs/BUSINESS_CLAIMING_IMPLEMENTATION.md` - This file

### Modified:
- `app/business/[id]/page.tsx` - Added claim banner
- `app/api/business/[id]/route.ts` - Added claimed field to response
- `package.json` - Added resend dependency

## What's Ready Now

✅ Full user-facing claim flow
✅ Email verification with codes
✅ Auto user account creation
✅ Email notifications to admin
✅ Admin approval/rejection functionality
✅ Professional HTML email templates
✅ Database schema for tracking claims

## What Still Needs to be Built

🔲 Admin claims review UI (see Phase 4)
🔲 Business owner dashboard
🔲 Business profile editing
🔲 Photo upload interface
🔲 Magic link login for future sessions
