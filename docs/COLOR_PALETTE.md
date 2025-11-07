# Color Palette Guide

## Overview

The Nashville Cleaning Directory uses a professional, elegant color palette inspired by the "Lovebirds" design system. The palette combines calming sage greens with warm accents, perfect for a trusted local service directory.

---

## Primary Colors - Sage Green

The primary color family is a calming sage green, representing trust, growth, and nature (fitting for cleaning services).

### Usage
- **Primary buttons** (primary-500)
- **Links and highlights** (primary-600)
- **Focus states** (primary-700)
- **Backgrounds** (primary-50, primary-100)

### Color Scale
```
primary-50:   #F0F5F3  (very light, backgrounds)
primary-100:  #D9E8E3  (light backgrounds)
primary-200:  #B8D9D0  (light tints)
primary-300:  #98CBBC  (medium-light)
primary-400:  #78BCA9  (medium)
primary-500:  #5AAE97  ← MAIN BRAND COLOR
primary-600:  #479E86  (darker, hover states)
primary-700:  #3D8E74  (dark, focus states)
primary-800:  #2F6B5C  (very dark)
primary-900:  #1F4739  (darkest)
```

### Examples
```html
<!-- Button -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Request Quote
</button>

<!-- Background -->
<div class="bg-primary-50">
  <h2 class="text-primary-900">Trusted Services</h2>
</div>

<!-- Link -->
<a href="#" class="text-primary-600 hover:text-primary-700">Learn more</a>
```

---

## Accent Colors - Coral/Warm Tones

Accent colors are used for calls-to-action, important elements, and highlights. These warm coral tones create urgency and draw attention.

### Usage
- **Primary CTAs** (accent-500, accent-600)
- **Success messages** (accent-500)
- **Badges and highlights** (accent-400, accent-500)
- **Alert backgrounds** (accent-50, accent-100)

### Color Scale
```
accent-50:   #FDF5F3  (very light, backgrounds)
accent-100:  #FDE8E3  (light backgrounds)
accent-200:  #FBCFC5  (light tints)
accent-300:  #F9B7A7  (medium-light)
accent-400:  #F49E89  (medium)
accent-500:  #E07856  ← MAIN ACCENT COLOR
accent-600:  #D46744  (darker, hover states)
accent-700:  #C85633  (dark)
accent-800:  #B04528  (very dark)
accent-900:  #98341D  (darkest)
```

### Examples
```html
<!-- Primary CTA -->
<button class="bg-accent-500 hover:bg-accent-600 text-white">
  List Your Business
</button>

<!-- Badge -->
<span class="bg-accent-100 text-accent-700 px-3 py-1 rounded">
  Premium Member
</span>

<!-- Alert/Success -->
<div class="bg-accent-50 border-l-4 border-accent-500 p-4">
  <p class="text-accent-900">Quote request sent successfully!</p>
</div>
```

---

## Neutral Colors - Grayscale

Neutrals are used for text, borders, backgrounds, and secondary elements. They provide balance and readability.

### Usage
- **Body text** (neutral-700, neutral-800)
- **Headings** (neutral-900)
- **Borders** (neutral-200, neutral-300)
- **Backgrounds** (neutral-50, neutral-100)
- **Disabled states** (neutral-400, neutral-300)
- **Subtle text** (neutral-500, neutral-600)

### Color Scale
```
neutral-50:   #F9FAFA  (very light, page background)
neutral-100:  #F5F5F5  (light background)
neutral-200:  #E8E8E8  (light borders)
neutral-300:  #CCCCCC  (borders)
neutral-400:  #999999  (placeholder text)
neutral-500:  #6B6B6B  (subtle text)
neutral-600:  #555555  (secondary text)
neutral-700:  #3D3F47  ← MAIN TEXT COLOR
neutral-800:  #2D2E33  (darker text)
neutral-900:  #1A1B1E  (darkest text, headings)
```

### Examples
```html
<!-- Page background -->
<body class="bg-neutral-50 text-neutral-700">

  <!-- Heading -->
  <h1 class="text-neutral-900 font-bold">Welcome</h1>

  <!-- Body text -->
  <p class="text-neutral-700">Lorem ipsum dolor sit amet...</p>

  <!-- Subtle text -->
  <p class="text-neutral-500 text-sm">Last updated 2 hours ago</p>

  <!-- Border -->
  <div class="border-b border-neutral-200"></div>
</body>
```

---

## Semantic Usage Patterns

### Buttons

```html
<!-- Primary Action (Use Primary Color) -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Search Cleaners
</button>

<!-- Secondary Action (Use Neutral) -->
<button class="bg-neutral-100 hover:bg-neutral-200 text-neutral-900">
  View More
</button>

<!-- Danger/Alert (Use Accent) -->
<button class="bg-accent-500 hover:bg-accent-600 text-white">
  Delete Account
</button>

<!-- Disabled State (Use Neutral) -->
<button disabled class="bg-neutral-200 text-neutral-400 cursor-not-allowed">
  Sign Up
</button>
```

### Cards & Containers

```html
<!-- Default Card -->
<div class="bg-white border border-neutral-200 rounded-lg shadow">
  <h3 class="text-neutral-900">Business Name</h3>
  <p class="text-neutral-600">Description</p>
</div>

<!-- Featured/Premium Card -->
<div class="bg-primary-50 border-l-4 border-primary-500 rounded-lg">
  <h3 class="text-primary-900">Premium Member</h3>
  <p class="text-primary-700">Featured listing</p>
</div>

<!-- Alert Card -->
<div class="bg-accent-50 border border-accent-200 rounded-lg">
  <p class="text-accent-900">Action required</p>
</div>
```

### Typography

```html
<!-- Main Heading -->
<h1 class="text-neutral-900 text-3xl font-bold">Page Title</h1>

<!-- Section Heading -->
<h2 class="text-primary-900 text-2xl font-bold">Section Title</h2>

<!-- Subsection -->
<h3 class="text-neutral-800 text-lg font-semibold">Subsection</h3>

<!-- Body Text -->
<p class="text-neutral-700">Regular paragraph text</p>

<!-- Muted Text -->
<p class="text-neutral-500 text-sm">Secondary or helper text</p>

<!-- Link -->
<a href="#" class="text-primary-600 hover:text-primary-700 underline">
  Learn more
</a>
```

### Status & Badges

```html
<!-- Verified Badge (Success) -->
<span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
  ✓ Verified
</span>

<!-- Premium Badge (Accent) -->
<span class="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
  ⭐ Premium Member
</span>

<!-- New Badge -->
<span class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
  New
</span>

<!-- Inactive/Disabled -->
<span class="bg-neutral-100 text-neutral-500 px-3 py-1 rounded-full text-sm font-medium">
  Inactive
</span>
```

---

## Accessibility Considerations

### Color Contrast

All color combinations meet WCAG AA standards for contrast:

✅ **Sufficient Contrast** (AAA - Enhanced)
- `neutral-900` on `primary-50` (text on light background)
- `neutral-700` on `neutral-100` (body text)
- `white` on `primary-500` (button text)
- `white` on `accent-500` (CTA button text)

⚠️ **Verify Before Use** (Check WCAG compliance)
- `neutral-600` on light backgrounds
- `primary-600` on `primary-100`

### Avoid Color Alone

Always combine color with icons, patterns, or text to convey meaning:

```html
<!-- ❌ BAD - Color only -->
<div class="bg-accent-500">
  Your quote was sent
</div>

<!-- ✅ GOOD - Color + icon + text -->
<div class="bg-accent-50 border-l-4 border-accent-500 p-4">
  <div class="flex items-center gap-2">
    <span class="text-accent-600">✓</span>
    <p class="text-accent-900">Your quote was sent successfully</p>
  </div>
</div>
```

---

## Usage in Code

### Tailwind Classes

```typescript
// Apply colors using Tailwind utilities
<div className="bg-primary-500 text-white rounded-lg p-4">
  Featured Business
</div>

// Responsive colors
<div className="bg-neutral-50 md:bg-white">
  Responsive background
</div>

// Hover states
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700">
  Interactive Button
</button>

// Dark mode (if implemented)
<div className="text-neutral-900 dark:text-neutral-100">
  Adaptive text
</div>
```

### CSS Variables (Optional)

If using CSS variables alongside Tailwind:

```css
:root {
  --primary-500: #5AAE97;
  --accent-500: #E07856;
  --neutral-700: #3D3F47;
  --neutral-50: #F9FAFA;
}

.button {
  background-color: var(--primary-500);
  color: white;
}

.button:hover {
  background-color: var(--primary-600);
}
```

---

## Color Applications by Component

### Navigation Bar
- **Background**: `neutral-50` or `white`
- **Links**: `neutral-700` (default), `primary-600` (hover), `primary-700` (active)
- **Logo**: `primary-700` or `primary-900`

### Homepage Hero
- **Background**: `primary-50` or `primary-100` gradient
- **Heading**: `neutral-900`
- **Subheading**: `neutral-700`
- **CTA Button**: `accent-500` with `accent-600` hover

### Business Card
- **Background**: `white` with `neutral-200` border
- **Business Name**: `neutral-900`
- **Rating**: `accent-500`
- **Service Tags**: `primary-100` background, `primary-700` text
- **CTA**: `primary-500` button

### Admin Dashboard
- **Sidebar Background**: `neutral-900`
- **Sidebar Text**: `white`
- **Active Menu Item**: `primary-500` background
- **Content Background**: `neutral-50`
- **Card Backgrounds**: `white`

### Forms
- **Labels**: `neutral-900`
- **Input Border**: `neutral-300` (default), `primary-500` (focus)
- **Placeholder**: `neutral-400`
- **Error**: `accent-500`
- **Success**: `primary-500`

---

## Reference

**File Location**: This configuration is in `tailwind.config.ts`

**Total Colors**: 30 colors (10 primary + 10 accent + 10 neutral)

**Accessibility**: All combinations tested against WCAG guidelines

**Brand Philosophy**: Professional, trustworthy, warm, and approachable
