# UX/UI Design Guidelines
## Nashville House Cleaning Directory

**Design Philosophy:** Warm, friendly, and professional - creating an approachable experience for both consumers searching for services and businesses managing their listings.

**Core Principles:**
- Warm colors over stark/modern aesthetics
- Professional yet approachable
- Visual-first design with plenty of imagery
- Easy navigation with clear visual cues
- Mobile-friendly and accessible

---

## 1. Color Palette

### Primary Colors

```javascript
// Tailwind config custom colors
colors: {
  primary: {
    DEFAULT: '#4A90E2',  // Warm blue - trust & reliability
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#4A90E2',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  secondary: {
    DEFAULT: '#FF9F7F',  // Coral - energy & approachability
    50: '#FFF5F0',
    100: '#FFE8DD',
    200: '#FFD1BB',
    300: '#FFBA99',
    400: '#FFA877',
    500: '#FF9F7F',
    600: '#FF7E55',
    700: '#FF5D2B',
    800: '#E63C00',
    900: '#B32E00',
  },
  accent: {
    DEFAULT: '#52C98A',  // Success green - verified & eco-friendly
    50: '#F0FDF7',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#52C98A',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  warm: {
    50: '#FFFAF0',   // Cream backgrounds
    100: '#FDF8F3',  // Off-white
    200: '#F5F5F0',  // Warm gray light
    300: '#E8E8E3',
    400: '#D1D1CC',
    500: '#A8A8A3',
    600: '#6B6B66',
    700: '#4A4A45',  // Warm gray text
    800: '#2E2E2B',
    900: '#1A1A18',
  }
}
```

### Background Colors
- **Primary Background:** `#FFFAF0` (warm cream)
- **Card Background:** `#FFFFFF` (pure white for contrast)
- **Alternate Section:** `#FDF8F3` (off-white)
- **Input Background:** `#FFFFFF` with warm border

### Text Colors
- **Primary Text:** `#4A4A45` (warm dark gray, not black)
- **Secondary Text:** `#6B6B66` (medium warm gray)
- **Muted Text:** `#A8A8A3` (light warm gray)
- **Link Text:** `#4A90E2` (primary blue)

### Shadows
Use warm-toned shadows instead of cool grays:
```css
box-shadow: 0 4px 6px rgba(255, 159, 127, 0.1),
            0 1px 3px rgba(255, 159, 127, 0.08);
```

---

## 2. Typography

### Font Stack

**Headings:** Poppins (friendly, rounded, professional)
```javascript
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})
```

**Body Text:** Open Sans (highly readable, warm)
```javascript
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
})
```

### Type Scale

```css
/* Heading Sizes */
h1: 48px (3rem) - font-bold - Poppins
h2: 36px (2.25rem) - font-semibold - Poppins
h3: 28px (1.75rem) - font-semibold - Poppins
h4: 24px (1.5rem) - font-medium - Poppins
h5: 20px (1.25rem) - font-medium - Poppins

/* Body Sizes */
Body Large: 18px (1.125rem) - line-height: 1.8
Body Default: 16px (1rem) - line-height: 1.7
Body Small: 14px (0.875rem) - line-height: 1.6
Caption: 12px (0.75rem) - line-height: 1.5
```

### Typography Rules
- Base font size: **18px** (larger than typical 16px for easier reading)
- Line height: **1.7-1.8** (generous spacing)
- Letter spacing: Default (no tight spacing)
- Font weight: Regular (400), Semibold (600), Bold (700)

---

## 3. Visual Content Strategy

### Stock Photography Guidelines

**Style Requirements:**
- Real people (not overly staged or stock-looking)
- Bright, naturally lit spaces
- Diverse representation
- Clean, organized homes/offices
- Smiling service providers (builds trust)
- Nashville-specific imagery where possible

**Key Image Locations:**

| Location | Image Type | Purpose |
|----------|-----------|---------|
| Homepage Hero | Happy homeowner in clean space or Nashville skyline + modern home | First impression, warmth |
| Service Categories | Icon + subtle background photo | Visual differentiation |
| Trust Section | Photos of verified professionals at work | Build credibility |
| Testimonials | Customer photos (with permission) | Social proof |
| Business Profiles | Before/after, team photos, work in action | Showcase quality |
| Dashboard Empty States | Friendly illustrations | Reduce anxiety |

**Free Stock Resources:**
- [Unsplash](https://unsplash.com) - Keywords: "cleaning", "home", "Nashville", "professional service"
- [Pexels](https://pexels.com) - Professional services, before/after
- [Pixabay](https://pixabay.com) - Supplementary images

### Icon System

**Icon Library:** Lucide React (already in tech stack)

**Icon Usage:**
- Navigation items: Icon + text label
- Service categories: Large icons (48px+)
- Trust badges: Circular icons with color
- Form inputs: Left-aligned icons (16-20px)
- Buttons: Left or right of text (20px)
- Metrics cards: Top-left corner (32px)

**Service Category Icons:**
```
- Home (Residential Cleaning)
- Building (Commercial Cleaning)
- Sparkles (Deep Cleaning)
- Package (Move-Out Cleaning)
- Calendar (Recurring Service)
- Leaf (Eco-Friendly)
- Shield (Insured/Bonded)
- CheckCircle (Verified)
- Star (Ratings)
```

### Illustrations & Graphics

**Style:** Simple line-art or flat illustrations (not 3D/isometric)

**Use Cases:**
- "How it Works" sections (3-step process)
- Empty states (no quotes yet, no favorites)
- Error pages (404, 500)
- Loading states
- Feature explanations

**Tools for Custom Graphics:**
- Figma (design)
- unDraw (free customizable illustrations)
- Heroicons (additional icons)
- Export as SVG for performance

---

## 4. Component Design Patterns

### Cards

**Standard Card:**
```tsx
- Rounded corners: 12px (rounded-xl)
- Padding: 24px (p-6)
- Background: White
- Shadow: Warm subtle (shadow-lg with custom warm tone)
- Border: Optional 1px warm-gray-200
- Hover: Gentle lift (translateY -2px, shadow increase)
```

**Business Card (Search Results):**
```
┌─────────────────────────────────┐
│ [Logo]  Business Name     ⭐4.8│
│         Service Categories      │
│ [Hero Photo]                    │
│ ✓ Verified  ✓ Insured          │
│ Responds in ~2 hours            │
│         [Get Quote Button]      │
└─────────────────────────────────┘
```

### Buttons

**Primary Button:**
```css
Background: Coral gradient
Border-radius: 8px (rounded-lg)
Padding: 12px 24px
Font: Semibold, 16px
Hover: Slight darken + lift
Active: Scale 0.98
```

**Secondary Button:**
```css
Background: Transparent
Border: 2px solid primary
Color: Primary
Hover: Fill with primary + white text
```

**Button Sizes:**
- Small: py-2 px-4 text-sm
- Medium: py-3 px-6 text-base
- Large: py-4 px-8 text-lg

### Forms

**Input Fields:**
```tsx
- Height: 48px (minimum tap target)
- Border: 2px warm-gray-300
- Border-radius: 8px
- Focus: Border changes to primary-500, outline ring
- Error: Border changes to red-500, show error icon + message
- Success: Border changes to accent-500, show checkmark
- Placeholder: warm-gray-400
- Icon: Left-aligned, 20px, warm-gray-500
```

**Form Layout:**
```
- Labels above inputs (not floating)
- Helper text below in small gray
- Inline validation with icons
- Required field indicator: red asterisk
- Group related fields with section headings
```

### Navigation

**Header:**
```
┌────────────────────────────────────────┐
│ [Logo] Home  Services  For Business   │
│                      [Search] [Sign In]│
└────────────────────────────────────────┘
```

**Properties:**
- Sticky on scroll
- White background with warm shadow
- Height: 72px
- Logo: 40px height
- Links: Warm text with hover underline

**Mobile Navigation:**
- Hamburger icon (top-right)
- Slide-in drawer from right
- Icon + text for each menu item
- Full-height overlay

### Trust Badges

**Design:**
```tsx
- Circular icon with colored background
- Icon in white
- Label underneath
- Size: 64px diameter for large, 32px for inline
- Colors:
  - Verified: accent-green
  - Insured: primary-blue
  - Bonded: secondary-coral
  - Background Check: purple
```

---

## 5. Layout Patterns

### Homepage Layout

```
┌─────────────────────────────────────────┐
│           HEADER (Sticky)               │
├─────────────────────────────────────────┤
│                                         │
│   HERO SECTION                          │
│   - Headline (H1)                       │
│   - Subheadline                         │
│   - Search Bar (large, prominent)       │
│   - Background: Hero image with overlay │
│                                         │
├─────────────────────────────────────────┤
│   SERVICE CATEGORIES (Grid)             │
│   [Icon] Residential  [Icon] Commercial │
│   [Icon] Deep Clean   [Icon] Move-Out   │
│   [Icon] Recurring    [Icon] Eco-Friendly│
├─────────────────────────────────────────┤
│   HOW IT WORKS (3 Steps)                │
│   1. Search        2. Compare           │
│   3. Get Quote                          │
│   (Icons + illustrations)               │
├─────────────────────────────────────────┤
│   FEATURED BUSINESSES                   │
│   (Card grid with photos)               │
├─────────────────────────────────────────┤
│   TRUST SECTION                         │
│   "All businesses verified"             │
│   (Trust badges + stats)                │
├─────────────────────────────────────────┤
│   TESTIMONIALS                          │
│   (Customer quotes with photos)         │
├─────────────────────────────────────────┤
│   FOOTER                                │
│   (Links, social, contact)              │
└─────────────────────────────────────────┘
```

### Search Results Page

```
┌─────────────────────────────────────────┐
│           HEADER                        │
├──────────┬──────────────────────────────┤
│          │  Search Bar + Active Filters │
│ FILTERS  ├──────────────────────────────┤
│ (Sidebar)│  Sort: [Dropdown]  [Grid/List]│
│          ├──────────────────────────────┤
│ Location │  BUSINESS CARD               │
│ Services │  BUSINESS CARD               │
│ Rating   │  BUSINESS CARD               │
│ Features │  BUSINESS CARD               │
│          │  [Load More]                 │
└──────────┴──────────────────────────────┘
```

**Mobile:** Filters in bottom sheet/drawer

### Business Profile Page

```
┌─────────────────────────────────────────┐
│  HEADER (with Back button)              │
├─────────────────────────────────────────┤
│  HERO SECTION                           │
│  [Logo] Business Name        ⭐ 4.8 (45)│
│  Service Categories                     │
│  📞 (615) 555-1234  🌐 Website         │
├─────────────────────────────────────────┤
│  PHOTO GALLERY (Carousel)               │
│  [Photo] [Photo] [Photo] [+12 more]     │
├─────────────────────────────────────────┤
│  QUICK INFO + CTA                       │
│  ✓ Verified ✓ Insured ✓ Bonded         │
│  [Get Quote Button - Prominent]         │
├─────────────────────────────────────────┤
│  TABS: About | Services | Reviews | Map │
├─────────────────────────────────────────┤
│  TAB CONTENT (Active Tab Displayed)     │
├─────────────────────────────────────────┤
│  PROMOTION (if Premium)                 │
│  "10% off first cleaning!"              │
└─────────────────────────────────────────┘
```

### Business Dashboard

```
┌─────────────────────────────────────────┐
│  HEADER (Dashboard)                     │
├─────┬───────────────────────────────────┤
│     │  METRICS OVERVIEW                 │
│ NAV │  [Card] Views  [Card] Clicks      │
│     │  [Card] Quotes [Card] Rating      │
│ • P ├───────────────────────────────────┤
│ • Q │  CHART VISUALIZATION              │
│ • A │  (Weekly/Monthly views)           │
│ • P ├───────────────────────────────────┤
│ • S │  RECENT QUOTE REQUESTS            │
│     │  [Quote Card]                     │
│     │  [Quote Card]                     │
│     │  [Quote Card]                     │
│     │  [View All]                       │
└─────┴───────────────────────────────────┘
```

**Navigation Items:**
- Profile (icon + label)
- Quotes (icon + label + badge for new)
- Analytics (icon + label)
- Photos (icon + label)
- Settings (icon + label)

---

## 6. Responsive Breakpoints

Using Tailwind default breakpoints:

```javascript
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Small laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
```

### Mobile-First Responsive Rules

**Mobile (< 640px):**
- Single column layouts
- Hamburger navigation
- Sticky CTA buttons at bottom
- Larger tap targets (min 44x44px)
- Filters in bottom sheet
- Stack cards vertically

**Tablet (640px - 1024px):**
- Two-column grids
- Sidebar filters (collapsible)
- Keep important CTAs visible

**Desktop (> 1024px):**
- Three-column grids
- Fixed sidebar navigation
- Hover states enabled
- Show more content per view

---

## 7. Micro-Interactions & Animations

### Animation Principles
- **Speed:** 200-300ms for most interactions
- **Easing:** ease-in-out for smooth feel
- **Purpose:** Every animation should have clear purpose
- **Accessibility:** Respect `prefers-reduced-motion`

### Common Interactions

**Button Hover:**
```css
transform: translateY(-2px)
box-shadow: increase
transition: all 200ms ease-in-out
```

**Card Hover:**
```css
transform: translateY(-4px)
box-shadow: larger warm shadow
transition: all 250ms ease-in-out
```

**Link Hover:**
```css
text-decoration: underline
color: slightly darker
transition: color 150ms ease
```

**Loading States:**
- Skeleton screens (preferred over spinners)
- Pulse animation for loading cards
- Progress bars for multi-step processes
- Friendly loading messages: "Finding the best cleaners for you..."

**Success States:**
- Checkmark animation (scale + opacity)
- Toast notification slides in from top-right
- Green accent color
- Auto-dismiss after 3-5 seconds

**Error States:**
- Shake animation for form errors
- Red border pulse
- Clear error icon + message
- Suggest solution when possible

---

## 8. Accessibility Standards

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 against background

**Keyboard Navigation:**
- All interactive elements focusable
- Visible focus indicators (outline ring)
- Logical tab order
- Skip to main content link

**Screen Reader Support:**
- Semantic HTML elements
- ARIA labels for icons
- Alt text for all images
- Form labels properly associated
- Status messages announced

**Touch Targets:**
- Minimum 44x44px
- Adequate spacing between targets
- Large enough for thumb interaction

**Motion:**
- Respect `prefers-reduced-motion`
- Provide alternative to auto-play
- Pause/stop controls for animations

---

## 9. Component Library (shadcn/ui)

### Core Components to Customize

**Already Installed:**
- Button
- Card
- Badge
- Dialog
- Form
- Input
- Select
- Textarea
- Dropdown Menu
- Tabs
- Accordion
- Sheet (mobile menu)
- Toast
- Avatar
- Calendar
- Checkbox

### Custom Components to Build

**Business Specific:**
- `BusinessCard` - Search result card
- `ServiceCategoryCard` - Homepage categories
- `TrustBadge` - Verification badges
- `QuoteRequestCard` - Dashboard quote display
- `RatingDisplay` - Star ratings
- `PhotoGallery` - Image carousel
- `MetricCard` - Dashboard stats
- `FilterSidebar` - Search filters
- `ReviewCard` - Customer reviews
- `PromotionBanner` - Special offers

---

## 10. Image Specifications

### File Formats
- Photos: WebP with JPEG fallback
- Icons: SVG
- Logos: SVG preferred, PNG fallback

### Image Sizes

**Business Logos:**
- Upload: Max 2MB, 1000x1000px
- Display: 80x80px (thumbnail), 200x200px (profile)

**Hero Images:**
- Upload: Max 5MB, 1920x1080px
- Display: Responsive, lazy loaded

**Business Photos:**
- Upload: Max 3MB each, 1600x1200px
- Display: 400x300px (grid), 800x600px (lightbox)

**Stock Photos:**
- Homepage hero: 1920x1080px
- Category cards: 800x600px
- Testimonial photos: 400x400px

### Optimization
- Use `next/image` component for automatic optimization
- Lazy load below-fold images
- Provide alt text for all images
- Use blur placeholders

---

## 11. Design System Documentation

### Component Documentation Format

For each component, document:
```markdown
## ComponentName

**Purpose:** What it's used for
**Variants:** List all variants (primary, secondary, etc.)
**Props:** TypeScript interface
**Usage Example:** Code snippet
**Visual Example:** Screenshot or Storybook link
**Accessibility:** ARIA requirements
```

### Design Tokens

Create centralized design tokens:
```typescript
// lib/design-tokens.ts
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
}

export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
}
```

---

## 12. User Flow Considerations

### Consumer Journey

1. **Discovery (Homepage)**
   - Clear value proposition
   - Easy search entry point
   - Visual service categories
   - Trust indicators prominent

2. **Search & Filter**
   - Relevant results quickly
   - Visual filtering options
   - Sort options clear
   - Results with photos

3. **Evaluation (Business Profile)**
   - Photos prominently displayed
   - Trust badges immediately visible
   - Reviews easy to read
   - Clear CTA for quotes

4. **Action (Request Quote)**
   - Simple form (minimal fields)
   - Progress indicator if multi-step
   - Confirmation message
   - Next steps clear

### Business Owner Journey

1. **Onboarding**
   - Step-by-step wizard
   - Progress indicator
   - Clear value at each step
   - Preview of final profile

2. **Profile Management**
   - Visual editor with live preview
   - Drag-and-drop photo uploads
   - Clear save/cancel actions
   - Undo capabilities

3. **Quote Management**
   - Visual status indicators
   - Quick actions (respond, decline)
   - Notification badges
   - Filter/sort options

4. **Analytics Review**
   - Visual charts/graphs
   - Comparison periods
   - Clear metrics definitions
   - Actionable insights

---

## 13. Error States & Empty States

### Error Pages

**404 - Not Found:**
- Friendly illustration
- Clear message: "Page not found"
- Helpful next steps
- Link back to homepage or search

**500 - Server Error:**
- Apologetic tone
- "Something went wrong"
- Suggestion to retry
- Contact support option

**Form Validation Errors:**
- Inline, immediate feedback
- Red border + icon + message
- Suggest correction
- Don't remove user input

### Empty States

**No Search Results:**
- "No businesses found"
- Suggestions: broaden search, different keywords
- Show related categories
- Friendly illustration

**No Quotes Yet (Business Dashboard):**
- "No quote requests yet"
- Tips to improve visibility
- Link to improve profile
- Encouraging illustration

**No Favorites:**
- "You haven't saved any favorites"
- Encourage browsing
- Link to search
- Heart illustration

---

## 14. Implementation Checklist

### Phase 1: Design System Setup
- [ ] Configure custom Tailwind theme (colors, fonts)
- [ ] Install and configure fonts (Poppins, Open Sans)
- [ ] Set up custom color palette
- [ ] Create design tokens file
- [ ] Customize shadcn/ui component styles

### Phase 2: Core Components
- [ ] Build custom BusinessCard component
- [ ] Build ServiceCategoryCard
- [ ] Build TrustBadge component
- [ ] Build RatingDisplay
- [ ] Build custom Button variants
- [ ] Build Form components with warm styling

### Phase 3: Layout Components
- [ ] Build Header/Navigation
- [ ] Build Footer
- [ ] Build SearchBar component
- [ ] Build FilterSidebar
- [ ] Build Mobile navigation

### Phase 4: Page Templates
- [ ] Homepage layout
- [ ] Search results page
- [ ] Business profile page
- [ ] Dashboard layout
- [ ] Error pages

### Phase 5: Interactive Elements
- [ ] Photo gallery/carousel
- [ ] Review submission form
- [ ] Quote request form
- [ ] Filter interactions
- [ ] Toast notifications

### Phase 6: Polish
- [ ] Add micro-interactions
- [ ] Optimize images
- [ ] Test accessibility
- [ ] Test mobile responsive
- [ ] Performance optimization

---

## 15. Resources & References

### Design Inspiration
- [Dribbble: Directory Websites](https://dribbble.com/tags/directory)
- [Behance: Service Marketplaces](https://www.behance.net/search/projects?search=marketplace)
- Examples: Thumbtack, Angi, HomeAdvisor (study UI patterns)

### Tools
- **Figma:** Design mockups and prototypes
- **Coolors:** Color palette generator
- **WebAIM Contrast Checker:** Accessibility testing
- **Lighthouse:** Performance and accessibility audits

### Stock Resources
- **Unsplash:** Free high-quality photos
- **Pexels:** Video and photo stock
- **unDraw:** Customizable illustrations
- **Lucide Icons:** Icon library (already using)

### Typography
- [Google Fonts: Poppins](https://fonts.google.com/specimen/Poppins)
- [Google Fonts: Open Sans](https://fonts.google.com/specimen/Open+Sans)

---

## Notes & Decisions

**Design Decisions Made:**
- Warm color palette chosen for friendly, approachable feel
- Larger base font size (18px) for better readability
- Rounded corners (not sharp) for softer appearance
- Photo-first approach for visual engagement
- Mobile-first responsive strategy

**Future Considerations:**
- Dark mode support (Tailwind already configured)
- Seasonal theme variations
- A/B testing for CTA button colors
- Custom illustrations vs. stock photos
- Video content integration

---

**Last Updated:** 2025-11-07
**Status:** Planning Phase - Ready for Implementation
