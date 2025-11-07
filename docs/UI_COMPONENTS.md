# UI Component Library Guide

## Overview

The Nashville Cleaning Directory uses a clean, modern component system inspired by premium SaaS applications. All components are built with shadcn/ui, Tailwind CSS, and the project's custom color palette.

---

## Design Principles

1. **Clarity** - Components clearly communicate intent
2. **Consistency** - Unified design language across the app
3. **Accessibility** - WCAG AA compliant, keyboard navigable
4. **Performance** - Lightweight, optimized components
5. **Flexibility** - Composable and reusable
6. **Feedback** - Clear visual states (hover, active, disabled)

---

## Core Components

### 1. Input Fields

#### Text Input
```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2 border border-neutral-300 rounded-lg
             focus:border-primary-500 focus:outline-none
             transition-colors duration-200"
/>
```

**States:**
- Default: `border-neutral-300`
- Focus: `border-primary-500`, `ring-2 ring-primary-100`
- Error: `border-accent-500`, `ring-2 ring-accent-100`
- Disabled: `bg-neutral-100 text-neutral-400 cursor-not-allowed`

#### Number Input (Card Details)
```tsx
<div className="flex gap-4">
  {/* Month */}
  <select className="w-24 px-3 py-2 border border-neutral-300 rounded-lg">
    <option>MM</option>
  </select>

  {/* Year */}
  <select className="w-32 px-3 py-2 border border-neutral-300 rounded-lg">
    <option>YYYY</option>
  </select>

  {/* CVV */}
  <input
    type="text"
    placeholder="CVV"
    className="w-20 px-3 py-2 border border-neutral-300 rounded-lg"
  />
</div>
```

#### Search Input
```tsx
<div className="relative">
  <input
    type="text"
    placeholder="Search..."
    className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg
               focus:border-primary-500"
  />
  <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-neutral-400" />
</div>
```

---

### 2. Buttons

#### Primary Button
```tsx
<button className="px-6 py-2 bg-primary-500 text-white rounded-lg
                   hover:bg-primary-600 active:bg-primary-700
                   transition-colors duration-200
                   disabled:bg-neutral-300 disabled:cursor-not-allowed">
  Button Text
</button>
```

**Variants:**
- Default: `bg-primary-500 hover:bg-primary-600`
- Secondary: `bg-neutral-100 text-neutral-900 hover:bg-neutral-200`
- Danger: `bg-accent-500 text-white hover:bg-accent-600`
- Ghost: `hover:bg-neutral-100`

#### Icon Button
```tsx
<button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
  <Icon className="w-5 h-5 text-neutral-700" />
</button>
```

#### Button with Icon
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg">
  <PlusIcon className="w-5 h-5" />
  Invite Members
</button>
```

#### Copilot Button (Floating Action)
```tsx
<button className="fixed bottom-6 right-6 p-3 bg-neutral-900 text-white
                   rounded-full shadow-lg hover:bg-neutral-800
                   transition-colors">
  <CopilotIcon className="w-6 h-6" />
</button>
```

---

### 3. Cards & Containers

#### Standard Card
```tsx
<div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-neutral-900">Card Title</h3>
  <p className="mt-2 text-neutral-600">Card content goes here</p>
</div>
```

**Hover Effect:**
```tsx
<div className="bg-white border border-neutral-200 rounded-lg p-6
               hover:border-neutral-300 hover:shadow-md
               transition-all duration-200 cursor-pointer">
```

#### Input Card (Payment Method)
```tsx
<div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
  <label className="block text-sm font-medium text-neutral-900 mb-2">
    Name on Card
  </label>
  <input
    type="text"
    placeholder="John Doe"
    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
  />

  <label className="block text-sm font-medium text-neutral-900 mb-2 mt-4">
    Card Number
  </label>
  <input
    type="text"
    placeholder="1234 5678 9012 3456"
    className="w-full px-4 py-2 border border-neutral-300 rounded-lg"
  />
</div>
```

#### Verification Badge
```tsx
<div className="flex items-center gap-3 px-4 py-3
               bg-primary-50 border border-primary-200 rounded-lg">
  <CheckCircleIcon className="w-5 h-5 text-primary-600" />
  <div>
    <p className="font-medium text-neutral-900">
      Your profile has been verified.
    </p>
    <p className="text-sm text-neutral-600">Verified on Nov 6, 2024</p>
  </div>
  <ChevronRightIcon className="w-5 h-5 text-neutral-400 ml-auto" />
</div>
```

---

### 4. Badges & Chips

#### Status Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full
                 bg-primary-100 text-primary-700 text-sm font-medium">
  ✓ Verified
</span>
```

**Variants:**
- Active: `bg-primary-100 text-primary-700`
- Success: `bg-green-100 text-green-700`
- Warning: `bg-yellow-100 text-yellow-700`
- Error: `bg-accent-100 text-accent-700`
- Neutral: `bg-neutral-100 text-neutral-700`

#### Service Type Chip
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1
               bg-neutral-100 text-neutral-700 rounded-full text-sm">
  <span>Residential</span>
  <button className="hover:bg-neutral-200 p-0.5 rounded">
    <X className="w-4 h-4" />
  </button>
</div>
```

---

### 5. Checkboxes & Radio Buttons

#### Checkbox
```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="w-5 h-5 rounded border-neutral-300
               text-primary-600 focus:ring-primary-500"
  />
  <span className="text-neutral-900">I agree to the terms and conditions</span>
</label>
```

#### Radio Group
```tsx
<div className="space-y-3">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="billing"
      className="w-5 h-5 text-primary-600"
    />
    <span>Same as shipping address</span>
  </label>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="billing"
      className="w-5 h-5 text-primary-600"
    />
    <span>Different billing address</span>
  </label>
</div>
```

---

### 6. Sliders & Range Inputs

#### Price Range Slider
```tsx
<div className="space-y-4">
  <label className="block text-sm font-medium text-neutral-900">
    Price Range
  </label>
  <p className="text-sm text-neutral-600">
    Set your budget range ($200 - 800)
  </p>

  <input
    type="range"
    min="200"
    max="800"
    className="w-full h-2 bg-neutral-200 rounded-lg
               appearance-none cursor-pointer
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:w-4
               [&::-webkit-slider-thumb]:h-4
               [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:bg-primary-500
               [&::-webkit-slider-thumb]:cursor-pointer"
  />

  <div className="flex justify-between text-sm text-neutral-600">
    <span>$200</span>
    <span>$800</span>
  </div>
</div>
```

---

### 7. Dropdowns & Selects

#### Select Dropdown
```tsx
<div className="relative">
  <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg
                    appearance-none focus:border-primary-500
                    bg-white cursor-pointer">
    <option value="">Select an option</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </select>
  <ChevronDownIcon className="absolute right-3 top-2.5 w-5 h-5
                             text-neutral-400 pointer-events-none" />
</div>
```

#### Dropdown Menu
```tsx
<div className="relative inline-block">
  <button className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 rounded-lg">
    Options
    <ChevronDownIcon className="w-4 h-4" />
  </button>

  <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200
                  rounded-lg shadow-lg">
    <button className="w-full text-left px-4 py-2 hover:bg-neutral-50">
      Action 1
    </button>
    <button className="w-full text-left px-4 py-2 hover:bg-neutral-50">
      Action 2
    </button>
    <hr className="border-neutral-200" />
    <button className="w-full text-left px-4 py-2 text-accent-600 hover:bg-neutral-50">
      Delete
    </button>
  </div>
</div>
```

---

### 8. Dialogs & Modals

#### Modal Dialog
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
    {/* Header */}
    <div className="border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-neutral-900">Modal Title</h2>
      <button className="p-1 hover:bg-neutral-100 rounded">
        <X className="w-5 h-5 text-neutral-600" />
      </button>
    </div>

    {/* Content */}
    <div className="px-6 py-4">
      <p className="text-neutral-600">Modal content goes here</p>
    </div>

    {/* Footer */}
    <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3">
      <button className="px-4 py-2 text-neutral-900 hover:bg-neutral-100 rounded-lg">
        Cancel
      </button>
      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

### 9. Tabs

#### Tab Navigation
```tsx
<div>
  {/* Tab List */}
  <div className="flex gap-8 border-b border-neutral-200">
    <button className="px-0 py-3 border-b-2 border-primary-500
                      text-primary-600 font-medium">
      Overview
    </button>
    <button className="px-0 py-3 border-b-2 border-transparent
                      text-neutral-600 hover:text-neutral-900
                      transition-colors">
      Analytics
    </button>
    <button className="px-0 py-3 border-b-2 border-transparent
                      text-neutral-600 hover:text-neutral-900
                      transition-colors">
      Reports
    </button>
  </div>

  {/* Tab Content */}
  <div className="mt-6">
    {/* Active tab content */}
  </div>
</div>
```

---

### 10. Status States

#### Loading State
```tsx
<div className="flex items-center gap-3 p-4">
  <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
  <span className="text-neutral-600">Syncing...</span>
</div>
```

#### Status Indicator (Multi-state)
```tsx
<div className="flex gap-3">
  <span className="inline-flex items-center gap-2 px-3 py-1
                   bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
    <CircleIcon className="w-2 h-2" />
    Syncing
  </span>

  <span className="inline-flex items-center gap-2 px-3 py-1
                   bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
    <CircleIcon className="w-2 h-2" />
    Updating
  </span>

  <span className="inline-flex items-center gap-2 px-3 py-1
                   bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
    <CircleIcon className="w-2 h-2" />
    Processing
  </span>
</div>
```

---

### 11. Links & Text

#### Link Styles
```tsx
{/* Primary Link */}
<a href="#" className="text-primary-600 hover:text-primary-700
                       hover:underline transition-colors">
  Learn more
</a>

{/* Subtle Link */}
<a href="#" className="text-neutral-600 hover:text-neutral-900
                       transition-colors">
  View details
</a>

{/* With Icon */}
<a href="#" className="inline-flex items-center gap-1 text-primary-600
                       hover:text-primary-700">
  View <ChevronRightIcon className="w-4 h-4" />
</a>
```

---

### 12. Forms & Fieldsets

#### Form Group
```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-neutral-900 mb-2">
      Business Name
    </label>
    <input
      type="text"
      placeholder="Enter business name"
      className="w-full px-4 py-2 border border-neutral-300 rounded-lg
                 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
    />
    <p className="mt-1 text-sm text-neutral-500">
      This is your public business name
    </p>
  </div>
</div>
```

#### Error Message
```tsx
<div>
  <input
    type="email"
    className="w-full px-4 py-2 border-2 border-accent-500 rounded-lg"
  />
  <p className="mt-2 text-sm text-accent-600 flex items-center gap-1">
    <AlertCircleIcon className="w-4 h-4" />
    Please enter a valid email address
  </p>
</div>
```

---

### 13. Context Menu

#### "Add Context" Pattern
```tsx
<div className="relative">
  <button className="flex items-center gap-2 px-4 py-2
                    border border-neutral-300 rounded-lg
                    hover:bg-neutral-50 transition-colors">
    <PlusIcon className="w-4 h-4" />
    Add context
  </button>

  {/* Dropdown appears below */}
  <div className="absolute mt-2 bg-white border border-neutral-200
                  rounded-lg shadow-lg p-4">
    <p className="text-sm text-neutral-600 mb-3">
      Ask, search, or make anything...
    </p>
    <input
      type="text"
      placeholder="Type here..."
      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
    />
  </div>
</div>
```

---

## Component Composition Example

### Complete Payment Form
```tsx
<div className="max-w-md mx-auto bg-white rounded-lg p-8">
  <h1 className="text-2xl font-bold text-neutral-900 mb-6">
    Payment Method
  </h1>

  <p className="text-sm text-neutral-600 mb-6">
    All transactions are secure and encrypted
  </p>

  <form className="space-y-6">
    {/* Name on Card */}
    <div>
      <label className="block text-sm font-medium text-neutral-900 mb-2">
        Name on Card
      </label>
      <input
        type="text"
        placeholder="John Doe"
        className="w-full px-4 py-2 border border-neutral-300 rounded-lg
                   focus:border-primary-500"
      />
    </div>

    {/* Card Number */}
    <div>
      <label className="block text-sm font-medium text-neutral-900 mb-2">
        Card Number
      </label>
      <input
        type="text"
        placeholder="1234 5678 9012 3456"
        className="w-full px-4 py-2 border border-neutral-300 rounded-lg
                   focus:border-primary-500"
      />
      <p className="mt-1 text-xs text-neutral-500">
        Enter your 16-digit card number
      </p>
    </div>

    {/* Date & CVV */}
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          Month
        </label>
        <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg">
          <option>MM</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          Year
        </label>
        <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg">
          <option>YYYY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          CVV
        </label>
        <input
          type="text"
          placeholder="123"
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
        />
      </div>
    </div>

    {/* Billing Address */}
    <div>
      <h3 className="font-medium text-neutral-900 mb-3">Billing Address</h3>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          defaultChecked
          className="w-5 h-5 rounded border-neutral-300"
        />
        <span className="text-sm text-neutral-900">
          Same as shipping address
        </span>
      </label>
    </div>

    {/* Agreement */}
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-neutral-300"
      />
      <span className="text-sm text-neutral-900">
        I agree to the terms and conditions
      </span>
    </label>

    {/* Buttons */}
    <div className="flex gap-3 pt-4">
      <button className="flex-1 px-4 py-2 border border-neutral-300
                        rounded-lg hover:bg-neutral-50">
        Previous
      </button>
      <button className="flex-1 px-4 py-2 bg-primary-500 text-white
                        rounded-lg hover:bg-primary-600">
        Next
      </button>
    </div>
  </form>
</div>
```

---

## Accessibility Features

### Keyboard Navigation
- All buttons and interactive elements are keyboard accessible
- Tab order follows visual hierarchy
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers
- Semantic HTML structure
- ARIA labels for icon buttons
- Form labels properly associated
- Error messages announced

### Visual Indicators
- Focus states with visible outlines
- Color + icon/text for status
- Adequate color contrast
- Readable font sizes (min 14px)

---

## Implementation Guide

### Using shadcn/ui

1. **Install components as needed:**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

2. **Use in components:**
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  )
}
```

### Custom Component Structure

```
components/
├── ui/              # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── features/        # Feature-specific components
│   ├── BusinessCard.tsx
│   ├── SearchBar.tsx
│   ├── ReviewForm.tsx
│   └── ...
└── common/          # Reusable utilities
    ├── Badge.tsx
    ├── Modal.tsx
    └── ...
```

---

## Color Application Quick Reference

| Element | Primary Color | Hover | Active |
|---------|---|---|---|
| Primary Button | primary-500 | primary-600 | primary-700 |
| Secondary Button | neutral-100 | neutral-200 | neutral-300 |
| Danger Button | accent-500 | accent-600 | accent-700 |
| Links | primary-600 | primary-700 | primary-800 |
| Focus Ring | primary-500 | - | - |
| Borders | neutral-200 | neutral-300 | - |
| Background | neutral-50 | - | - |
| Text | neutral-900 | - | - |
| Secondary Text | neutral-600 | - | - |

---

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Example Responsive Button
```tsx
<button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base
                   rounded-lg bg-primary-500 text-white
                   hover:bg-primary-600">
  Responsive Button
</button>
```

---

## Animation & Transitions

### Standard Transitions
```tsx
className="transition-colors duration-200"    // 200ms color change
className="transition-all duration-300"        // 300ms all properties
className="transition-transform duration-150"  // 150ms transform
```

### Loading Animation
```tsx
className="animate-pulse"  // Subtle pulse
className="animate-spin"   // Loading spinner
```

---

## Dark Mode Support (Future)

Components are structured to support dark mode:

```tsx
className="bg-white dark:bg-neutral-900
           text-neutral-900 dark:text-white
           border-neutral-200 dark:border-neutral-800"
```

---

## Component Library Status

### Ready to Use (from shadcn/ui)
- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Badge
- ✅ Form
- ✅ Dialog/Modal
- ✅ Select
- ✅ Checkbox
- ✅ Radio
- ✅ Tabs
- ✅ Dropdown Menu
- ✅ Accordion
- ✅ Sheet (Mobile nav)

### To Create (Custom)
- [ ] BusinessCard
- [ ] SearchBar
- [ ] ReviewForm
- [ ] KPICard
- [ ] StatusBadge
- [ ] AdminTable
- [ ] QuoteRequestForm
- [ ] PhotoGallery
- [ ] MapComponent
- [ ] PricingCard
- [ ] ReviewsList
- [ ] TrustIndicators

---

## Testing Components

```tsx
// Example test
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should be clickable", () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click</Button>)
    screen.getByRole("button").click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

---

## Best Practices

1. **Use semantic HTML** - `<button>`, `<form>`, `<nav>`, etc.
2. **Consistent spacing** - Use Tailwind spacing scale
3. **Accessible colors** - Always check contrast ratios
4. **Mobile first** - Design for mobile, enhance for desktop
5. **Keyboard navigation** - Test all components with keyboard
6. **Loading states** - Always indicate processing to users
7. **Error states** - Clear, actionable error messages
8. **Hover/Focus states** - Make interactive elements clear

---

## Notes

- All colors use the project palette (primary, accent, neutral)
- Components follow Tailwind CSS conventions
- Compatible with shadcn/ui components
- Built for accessibility (WCAG AA)
- Responsive design included
- Ready for dark mode implementation
