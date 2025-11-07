# Technology Stack

 

**Project:** Music City Cleaning Services

**Goal:** Build fast, cheap, and scalable

**Budget:** $0/month (use free tiers)

 

---

 

## 🎯 Stack Overview

 

| Component | Technology | Cost | Why? |

|-----------|-----------|------|------|

| **Frontend Framework** | Next.js 14 (App Router) | Free | SEO, SSR, performance |

| **Language** | TypeScript | Free | Type safety, better DX |

| **Styling** | Tailwind CSS + shadcn/ui | Free | Fast development, modern UI |

| **Database** | PostgreSQL (Supabase) | Free (500MB) | Relational, full-text search, geospatial |

| **Authentication** | Supabase Auth | Free | Built-in, no extra service |

| **File Storage** | Supabase Storage | Free (1GB) | Photos, videos, certificates |

| **Hosting** | Vercel | Free | Perfect for Next.js, auto-deploy |

| **Payment Processing** | Stripe | Pay-per-transaction | Industry standard, no monthly fee |

| **Email** | Resend or SendGrid | Free tier | Transactional emails |

| **Analytics** | Vercel Analytics + Custom | Free + Built-in | Page views + custom business analytics |

| **Domain** | musiccitycleaningservices.com | ~$12/year | Already owned |

 

**Total Monthly Cost: $0** (until you scale past free tiers)

 

---

 

## 🚀 Frontend Stack

 

### Next.js 14 (App Router)

**Why:**

- ✅ Server-side rendering = SEO-friendly (critical for directory)

- ✅ App Router = Modern, faster, better DX

- ✅ Built-in API routes

- ✅ Image optimization

- ✅ File-based routing

- ✅ Edge functions for fast searches

- ✅ Static generation for service profiles

 

**Key Features We'll Use:**

- Server Components (default, faster)

- Client Components (interactivity)

- Server Actions (form submissions without API routes)

- Dynamic Routes (`/profile/[slug]`)

- Parallel Routes (dashboards)

- Middleware (auth protection)

 

### TypeScript

**Why:**

- ✅ Catch errors before runtime

- ✅ Better autocomplete

- ✅ Self-documenting code

- ✅ Easier refactoring

 

**Configuration:**

- Strict mode enabled

- Path aliases (`@/components`, `@/lib`, etc.)

 

### Tailwind CSS

**Why:**

- ✅ Utility-first = fast development

- ✅ No CSS file bloat

- ✅ Responsive design made easy

- ✅ Dark mode support (future feature)

- ✅ Consistent design system

 

**Plugins:**

- `@tailwindcss/forms` - Better form styling

- `@tailwindcss/typography` - Rich text content

 

### shadcn/ui

**Why:**

- ✅ Copy-paste components (not a dependency)

- ✅ Built on Radix UI (accessible)

- ✅ Customizable with Tailwind

- ✅ Professional look out of the box

 

**Components We'll Use:**

- Button, Card, Badge, Dialog (Modal)

- Form, Input, Select, Textarea

- Dropdown, Tabs, Accordion

- Sheet (mobile menu)

- Toast (notifications)

- Avatar, Calendar, Checkbox

 

---

 

## 🗄️ Backend & Database

 

### Supabase (PostgreSQL)

**Why:**

- ✅ PostgreSQL = Reliable, mature, feature-rich

- ✅ Free tier: 500MB database + 1GB storage + 50K MAU

- ✅ Built-in auth (no need for Clerk/Auth0)

- ✅ Row Level Security (RLS) for data protection

- ✅ Real-time subscriptions (future feature)

- ✅ Auto-generated API

- ✅ Full-text search capabilities

- ✅ PostGIS for geospatial queries

 

**Free Tier Limits:**

- 500MB database (enough for 10,000+ businesses)

- 1GB file storage (thousands of photos)

- 50,000 monthly active users

- 2GB bandwidth

- Unlimited API requests

 

**Scaling:**

When needed: $25/month for 8GB DB + 100GB storage

 

**Alternatives Considered:**

- ❌ **Airtable:** Record limits, no geospatial, expensive at scale

- ❌ **PlanetScale:** Great but costs more than Supabase for same features

- ❌ **Firebase:** NoSQL = harder to query relationships

 

### Supabase Auth with NextAuth.js Middleware

**Why:**

- ✅ Built into Supabase (no extra service)

- ✅ Email/password, magic links, OAuth

- ✅ JWT tokens

- ✅ Row Level Security integration

- ✅ NextAuth.js for middleware protection and role-based access control



**Hybrid Authentication Strategy (Option C)**

Three user types with different access levels:

| User Type | Sign-up Method | Access Level | Features |
|-----------|---|---|---|
| **Admin** | Manual (you only) | Full platform | Approve businesses, moderate reviews, analytics, user management |
| **Business Owner** | Self-service + verification | Their listing(s) | Edit profile, view analytics, respond to reviews, manage premium |
| **Customer** | Optional email/Google | Public + dashboard | Browse, quote requests, reviews, favorites |

**Phase 1 (MVP - Week 1-2):**
- Email/password authentication
- Simple role assignment in database
- Basic access control
- Manual business approval workflow

**Phase 2 (Week 2-3):**
- Add Google OAuth (highest conversion rate)
- One-click sign up for customers
- Business phone verification (Twilio)

**Phase 3 (Post-MVP):**
- Magic links (passwordless email)
- Two-factor authentication (admin only)
- Facebook OAuth (if data shows demand)

**Route Protection with Middleware:**
- Public routes: `/`, `/search`, `/business/[slug]`, `/neighborhoods/*`
- Customer routes: `/dashboard/*` (auth required)
- Business routes: `/business/dashboard/*` (auth + business role)
- Admin routes: `/admin/*` (auth + admin role)

**Business Verification:**
1. MVP: Manual approval (upload license/insurance document)
2. Phase 2: Phone verification via Twilio
3. Email domain verification: Validate business email domain

**Review Authenticity:**
- Only verified customers can review
- Verification methods:
  - Quote submitted through platform (strongest)
  - Receipt/invoice photo upload (manual approval)
  - Email verification (minimum)

**Auth Methods:**

- Email/password (primary)

- Google OAuth (Phase 2: highest conversion)

- Magic links/passwordless (Phase 3)

- Two-factor authentication for admin (Phase 3)

 

### Supabase Storage

**Why:**

- ✅ S3-compatible

- ✅ Direct upload from browser

- ✅ Image transformation API

- ✅ CDN-backed (fast delivery)

 

**Buckets:**

- `business-logos` (public, 2MB limit)

- `business-photos` (public, 5MB limit)

- `business-videos` (public, 50MB limit)

- `certificates` (private, 10MB limit)

- `review-photos` (public, 3MB limit)

 

---

 

## 🌐 Hosting & Deployment

 

### Vercel

**Why:**

- ✅ Made by Next.js creators

- ✅ Zero-config deployment

- ✅ Auto-preview deploys for branches

- ✅ Edge Network (fast globally)

- ✅ Automatic HTTPS

- ✅ Environment variables management

 

**Free Tier:**

- 100GB bandwidth/month

- Unlimited sites

- Automatic SSL

- Custom domains

 

**CI/CD:**

- Push to `main` → Auto-deploy to production

- Push to branch → Auto-deploy to preview URL

- No GitHub Actions needed

 

---

 

## 💳 Payment Processing

 

### Stripe

**Why:**

- ✅ Industry standard

- ✅ No monthly fees (just transaction %)

- ✅ Subscription management

- ✅ Customer portal (self-service)

- ✅ Webhooks for automation

- ✅ Test mode (full testing before launch)

 

**Pricing:**

- 2.9% + 30¢ per transaction

- No monthly fee

 

**Features We'll Use:**

- Subscription products (Free/Premium/Premium Plus)

- Customer portal (businesses manage their own billing)

- Webhooks (update DB when payment succeeds/fails)

- Payment links (quick checkout)

 

**Implementation:**

- `@stripe/stripe-js` (client)

- `stripe` (server SDK)

- Stripe Checkout (hosted payment page)

 

---

 

## 📧 Email Service

 

### Resend (Primary Choice)

**Why:**

- ✅ Modern, developer-friendly

- ✅ 3,000 emails/month free

- ✅ React Email components

- ✅ Great deliverability

 

**Alternative: SendGrid**

- 100 emails/day free (3,000/month)

- More established, similar features

 

**Email Types:**

- Transactional:

  - Welcome email

  - Quote request notifications

  - Review notifications

  - Payment receipts

- Marketing (future):

  - Newsletter

  - Promotions

 

---

 

## 📊 Analytics

 

### Vercel Analytics (Page Views)

**Free tier:**

- Basic page view analytics

- Web vitals

- Device/browser stats

 

### Custom Analytics (Business Metrics)

**Implementation:**

- Store in `analytics_events` table

- Premium businesses see:

  - Profile views

  - Phone clicks

  - Email clicks

  - Quote requests

  - Search keywords

  - Peak times

 

**Future:** Google Analytics 4 (optional)

 

---

 

## 🔍 Search Implementation

 

### Full-Text Search (PostgreSQL)

**Why:**

- ✅ Built into Postgres

- ✅ No extra service needed

- ✅ Fast for our scale

 

**Implementation:**

```sql

-- Full-text search on business names/descriptions

CREATE INDEX idx_businesses_search

  ON businesses

  USING GIN(to_tsvector('english', business_name || ' ' || description));

```

 

**Query:**

```typescript

const results = await supabase

  .from('businesses')

  .select('*')

  .textSearch('fts', searchTerm);

```

 

**Future:** If we scale > 10,000 businesses, consider Algolia or Meilisearch

 

---

 

## 🗺️ Maps & Geolocation

 

### Leaflet + OpenStreetMap (Free)

**Why:**

- ✅ Completely free (no API keys)

- ✅ No rate limits

- ✅ Open source

 

**Use Cases:**

- Display service areas on profile pages

- Map view in search results

 

**Alternative:** Google Maps (costs $$ after 28K requests/month)

 

### PostGIS (Geospatial Queries)

**Why:**

- ✅ PostgreSQL extension

- ✅ Distance calculations

- ✅ Radius-based search

 

**Example:**

```sql

-- Find businesses within 10 miles

SELECT * FROM businesses

WHERE ST_DWithin(

  ST_MakePoint(lng, lat)::geography,

  ST_MakePoint(-86.7816, 36.1627)::geography, -- Nashville

  16093 -- 10 miles in meters

);

```

 

---

 

## 🎨 UI Component Libraries

 

### shadcn/ui (Primary)

Copy-paste components, fully customizable

 

### Radix UI (Primitives)

Used by shadcn/ui under the hood

 

### Lucide Icons

**Why:**

- ✅ Modern, clean icons

- ✅ Tree-shakable

- ✅ Consistent with shadcn/ui

 

**Alternative:** Heroicons, React Icons

 

---

 

## 🧪 Development Tools

 

### Code Quality

- **ESLint** - Linting

- **Prettier** - Code formatting

- **Husky** - Git hooks (optional)

- **lint-staged** - Run linters on staged files

 

### Type Checking

- **TypeScript** - Compile-time type checking

- **Zod** - Runtime validation + type inference

 

### Testing (Future)

- **Jest** - Unit tests

- **React Testing Library** - Component tests

- **Playwright** - E2E tests

 

### Development

- **pnpm** or **npm** - Package manager

- **Turbo** (optional) - Build optimization if monorepo

 

---

 

## 📦 Key Dependencies

 

### Core

```json

{

  "next": "^14.0.0",

  "react": "^18.0.0",

  "react-dom": "^18.0.0",

  "typescript": "^5.0.0"

}

```

 

### Database & Auth

```json

{

  "@supabase/supabase-js": "^2.38.0",

  "@supabase/auth-helpers-nextjs": "^0.8.0"

}

```

 

### UI & Styling

```json

{

  "tailwindcss": "^3.4.0",

  "@radix-ui/react-*": "latest",

  "class-variance-authority": "^0.7.0",

  "clsx": "^2.0.0",

  "tailwind-merge": "^2.0.0",

  "lucide-react": "^0.294.0"

}

```

 

### Forms & Validation

```json

{

  "react-hook-form": "^7.48.0",

  "zod": "^3.22.0",

  "@hookform/resolvers": "^3.3.0"

}

```

 

### Payment

```json

{

  "stripe": "^14.0.0",

  "@stripe/stripe-js": "^2.0.0"

}

```

 

### Email

```json

{

  "resend": "^2.0.0",

  "@react-email/components": "^0.0.10"

}

```

 

### Maps

```json

{

  "leaflet": "^1.9.4",

  "react-leaflet": "^4.2.1"

}

```

 

### Utilities

```json

{

  "date-fns": "^2.30.0",

  "lodash": "^4.17.21" (only if needed)

}

```

 

---

 

## 🏗️ Architecture Patterns

 

### Folder Structure

```

app/                    # Next.js 14 app directory

├── (public)/          # Public routes (no auth)

├── (business)/        # Business dashboard (auth required)

├── (admin)/           # Admin panel (admin auth)

└── api/               # API routes

 

components/            # Reusable components

├── ui/               # shadcn/ui components

└── features/         # Feature-specific components

 

lib/                   # Utilities

├── supabase/         # DB client, queries

├── stripe/           # Payment helpers

├── validations/      # Zod schemas

└── utils.ts          # General utilities

 

types/                 # TypeScript types

hooks/                 # Custom React hooks

```

 

### State Management

**Client State:**

- React hooks (useState, useContext)

- URL state (search params)

 

**Server State:**

- Supabase real-time subscriptions

- React Server Components (no client state needed)

 

**No Redux/Zustand needed** (keep it simple)

 

### Data Fetching

- **Server Components:** Fetch directly in component

- **Client Components:** SWR or TanStack Query (if needed)

- **Forms:** Server Actions (no API routes needed)

 

---

 

## 🔐 Security

 

### Authentication

- Supabase Auth with JWT

- HTTP-only cookies

- Row Level Security (RLS) on all tables

 

### API Security

- Rate limiting (Vercel built-in)

- Input validation (Zod schemas)

- CORS properly configured

 

### Data Protection

- Environment variables for secrets

- No API keys in client code

- Secure file uploads (type/size validation)

 

---

 

## 🚀 Performance Optimizations

 

### Next.js Features

- Static generation for profiles (ISR)

- Image optimization (`next/image`)

- Font optimization (`next/font`)

- Code splitting (automatic)

- Edge functions for search

 

### Caching

- Static pages cached by Vercel CDN

- Database queries with SWR client-side

- Supabase edge caching

 

### SEO

- Metadata API (Next.js 14)

- Dynamic sitemap generation

- Structured data (JSON-LD)

- Open Graph tags

 

---

 

## 📈 Scaling Strategy

 

### Phase 1: Launch (Free Tier)

- 0-1,000 businesses

- 0-10,000 monthly visitors

- $0/month cost

 

### Phase 2: Growth (Paid Tiers)

- 1,000-10,000 businesses

- 10,000-100,000 monthly visitors

- Costs: ~$50/month (Supabase Pro + Vercel Pro)

 

### Phase 3: Scale (Custom Infrastructure)

- 10,000+ businesses

- 100,000+ monthly visitors

- Costs: $200+/month

- Consider: Dedicated DB, Redis cache, CDN

 

---

 

## 🎯 Decision Summary

 

**Chosen Stack:**

- ✅ Next.js 14 + TypeScript + Tailwind

- ✅ Supabase (PostgreSQL + Auth + Storage)

- ✅ Vercel (Hosting)

- ✅ Stripe (Payments)

- ✅ Resend (Email)

 

**Why This Stack:**

1. **$0/month** to start

2. **Fast development** (familiar tools)

3. **SEO-optimized** (critical for directory)

4. **Scalable** (handles 10K+ businesses)

5. **Modern DX** (TypeScript, Server Components)

6. **Easy deployment** (push to deploy)

 

---

 

**Next Steps:**

1. Initialize Next.js project

2. Set up Supabase project

3. Configure Tailwind + shadcn/ui

4. Create database migrations

5. Set up Stripe products

6. Deploy to Vercel