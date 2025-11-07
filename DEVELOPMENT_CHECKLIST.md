# Development Checklist - 30 Day MVP

## Week 1: Foundation & Setup (Days 1-7)

### Days 1-2: Core Setup
- [x] Initialize Next.js 14 project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up folder structure (components, lib, hooks, types)
- [x] Create Supabase client utilities
- [x] Create validation schemas (auth, business)
- [ ] Set up Supabase project
  - [ ] Create Supabase account
  - [ ] Create new project
  - [ ] Get API credentials
  - [ ] Fill in .env.local
- [ ] Create database tables
  - [ ] Users table with role-based fields
  - [ ] Business owners table
  - [ ] Businesses table
  - [ ] Quote requests table
  - [ ] Reviews table
- [ ] Enable Row Level Security (RLS)
  - [ ] Set up RLS policies for all tables
  - [ ] Test RLS with sample queries

### Days 3-5: Authentication System
- [ ] Configure NextAuth.js
  - [ ] Create auth API routes
  - [ ] Set up JWT tokens
  - [ ] Configure session storage
- [ ] Implement sign up flow
  - [ ] Create signup page
  - [ ] Add email/password registration
  - [ ] Email verification system (Phase 2)
- [ ] Implement login flow
  - [ ] Create login page
  - [ ] Add remember me option
  - [ ] Password reset flow (Phase 2)
- [ ] Implement authentication middleware
  - [ ] Protect routes by role
  - [ ] Redirect unauthenticated users
  - [ ] Role-based access control

### Days 6-7: Basic Admin Setup
- [ ] Create admin account creation script
- [ ] Build basic admin login page
- [ ] Test admin route protection
- [ ] Deploy to Vercel for testing

## Week 2: Core Features (Days 8-14)

### Days 8-10: Homepage & Search
- [ ] Create homepage layout
  - [ ] Hero section with search bar
  - [ ] Service categories grid
  - [ ] Featured businesses section
  - [ ] Trust indicators/social proof
  - [ ] CTA buttons
- [ ] Build search functionality
  - [ ] Search by service type
  - [ ] Search by location (zip code)
  - [ ] Search by neighborhood
  - [ ] Filter by property type (residential/commercial)
- [ ] Create search results page
  - [ ] Business cards layout
  - [ ] Sorting options (relevance, rating, distance)
  - [ ] Pagination

### Days 11-12: Business Listing Pages
- [ ] Create business profile template
  - [ ] Business name, description, contact
  - [ ] Service list with icons
  - [ ] Years in business, insurance badges
  - [ ] Photo gallery
  - [ ] Service area map (Leaflet)
  - [ ] Trust score/rating display
- [ ] Add dynamic routing for businesses
  - [ ] Create [slug] route
  - [ ] Fetch business data from Supabase
  - [ ] Handle 404 for missing businesses
- [ ] Add call-to-action buttons
  - [ ] Click to call
  - [ ] Request quote button
  - [ ] Share buttons

### Days 13-14: Admin Dashboard Foundation
- [ ] Create admin dashboard home
- [ ] Build business approval system
  - [ ] List pending businesses
  - [ ] View business details/documents
  - [ ] Approve/reject with notes
  - [ ] Send notifications
- [ ] Create basic review moderation
  - [ ] List pending reviews
  - [ ] View review with context
  - [ ] Approve/reject reviews

## Week 3: Engagement Features (Days 15-21)

### Days 15-17: Quote Request System
- [ ] Build quote request form
  - [ ] Multi-step form (service → details → contact)
  - [ ] Service type selection
  - [ ] Property details (type, size, location)
  - [ ] Preferred date/frequency
  - [ ] Photo upload (optional)
  - [ ] Message/special instructions
- [ ] Create email routing
  - [ ] Send quote to matching businesses
  - [ ] Send confirmation to customer
  - [ ] Track quote status
- [ ] Build quote request dashboard (for businesses)
  - [ ] View incoming quotes
  - [ ] Mark as responded/closed
  - [ ] Email notifications

### Days 18-19: Review System
- [ ] Create review submission form
  - [ ] Rating selection
  - [ ] Review title and text
  - [ ] Service details (type, date)
  - [ ] Photo uploads
  - [ ] Verification (quote receipt or email)
- [ ] Build review display
  - [ ] Show on business profiles
  - [ ] Star rating aggregation
  - [ ] Helpful/unhelpful buttons
- [ ] Create review moderation
  - [ ] Flag spam reviews
  - [ ] Approve before displaying
  - [ ] Respond to reviews (for businesses)

### Days 20-21: Mobile Optimization
- [ ] Responsive design review
  - [ ] Mobile homepage
  - [ ] Mobile search
  - [ ] Mobile business profiles
  - [ ] Mobile forms
- [ ] Touch-friendly interactions
  - [ ] Click to call buttons
  - [ ] Large touch targets
  - [ ] Swipe-friendly galleries
- [ ] Performance optimization
  - [ ] Image lazy loading
  - [ ] Code splitting
  - [ ] Bundle size analysis

## Week 4: Launch Prep (Days 22-30)

### Days 22-24: SEO & Content
- [ ] SEO optimization
  - [ ] Add meta tags to all pages
  - [ ] Create XML sitemap
  - [ ] Add schema markup (LocalBusiness, Review)
  - [ ] Create robots.txt
  - [ ] Open Graph tags
- [ ] Create content
  - [ ] 5 neighborhood landing pages
  - [ ] 3 blog posts (cleaning tips)
  - [ ] Business onboarding guide
  - [ ] FAQ page

### Days 25-26: Admin Tools & Analytics
- [ ] Dashboard improvements
  - [ ] Basic analytics (counts)
  - [ ] Pending items overview
  - [ ] User management
- [ ] Invite system
  - [ ] Beta business invitations
  - [ ] Track signups
  - [ ] Referral tracking

### Days 27-28: Data Import & Testing
- [ ] Prepare business data
  - [ ] Research 10-15 Nashville cleaning businesses
  - [ ] Create CSV with business info
- [ ] Import test data
  - [ ] Create sample businesses
  - [ ] Add sample reviews
  - [ ] Add sample quote requests
- [ ] End-to-end testing
  - [ ] Test all user flows
  - [ ] Test admin workflows
  - [ ] Check error handling
  - [ ] Mobile testing

### Days 29-30: Launch Polish
- [ ] Bug fixes
  - [ ] Fix reported issues
  - [ ] Performance tuning
  - [ ] Security review
- [ ] Final testing
  - [ ] Cross-browser testing
  - [ ] Mobile device testing
  - [ ] Accessibility audit
- [ ] Deploy to production
  - [ ] Configure Vercel
  - [ ] Set environment variables
  - [ ] Enable analytics
  - [ ] Set up monitoring
- [ ] Beta launch
  - [ ] Invite 5-10 beta users
  - [ ] Collect feedback
  - [ ] Monitor for errors

## Post-MVP (Phase 2, Weeks 5-6)

### Phase 2 Features (for future sprints)
- [ ] Google OAuth integration
- [ ] Phone verification for businesses (Twilio)
- [ ] Magic links (passwordless)
- [ ] Business analytics dashboard
- [ ] Email marketing features
- [ ] Premium Plus tier
- [ ] Mobile app (PWA)
- [ ] Payment processing (Stripe)
- [ ] Advanced search (Elasticsearch)
- [ ] AI matching algorithm

## Notes

- Daily stand-ups should check off completed items
- Each completed item should have a commit
- Tests should be added for critical paths
- Code reviews before merging to main
- Performance budget: < 100KB JS, < 3s load time
