# Admin Dashboard Design & Implementation

## Overview

The admin dashboard is the control center for the Nashville Cleaning Directory. Based on modern CRM design patterns, it provides insights, management tools, and moderation capabilities for platform administrators.

---

## Dashboard Structure

### Layout Components

```
┌─────────────────────────────────────────────────────────┐
│                    TOP NAVIGATION                        │
│  Logo  |  Dashboard  Analytics  Users  Settings  Account │
└─────────────────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────────────────┐
│             │                                           │
│   SIDEBAR   │          MAIN CONTENT AREA               │
│             │                                           │
│ Dashboard  │  ┌──────────────────────────────────────┐ │
│ Businesses │  │  Page Title      Filter  Search      │ │
│ Reviews    │  ├──────────────────────────────────────┤ │
│ Quotes     │  │                                      │ │
│ Users      │  │   KPI Cards / Tables / Charts        │ │
│ Analytics  │  │                                      │ │
│ Settings   │  │                                      │ │
│            │  │                                      │ │
│            │  └──────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────┘
```

---

## Key Pages & Features

### 1. Dashboard Overview (Home)

**Primary Metrics (KPI Cards)**
```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ Total       │ Pending      │ Premium      │ Quote        │
│ Businesses  │ Approvals    │ Members      │ Requests     │
│             │              │              │              │
│     847     │       12     │      156     │     2,341    │
│ +5.2% ↑     │ -2 pending   │ +12% growth  │ +18% ↑       │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

**Data Structure**
```typescript
interface DashboardMetrics {
  totalBusinesses: {
    value: number
    change: number
    trend: 'up' | 'down'
  }
  pendingApprovals: {
    value: number
    change: number
    list: Business[]
  }
  premiumMembers: {
    value: number
    change: number
    revenue: number
  }
  quoteRequests: {
    value: number
    change: number
    trend: 'up' | 'down'
  }
}
```

**Components**
- KPI Card component (metric, icon, trend)
- Activity feed (recent approvals/rejections)
- Quick action buttons

### 2. Businesses Management

**List View with Filters**
```
┌─ Businesses ────────────────────────────────────────┐
│                                                     │
│ Status: [All ▼]  Tier: [All ▼]  Search: [______]   │
│                                                     │
│ ┌────────────────────────────────────────────────┐  │
│ │ Name        │ Status    │ Rating │ Actions     │  │
│ ├────────────────────────────────────────────────┤  │
│ │ Sparkle     │ Active    │ 4.8★   │ View        │  │
│ │ Clean       │ Pending   │ -      │ Approve     │  │
│ │ Best Clean  │ Suspended │ 2.1★   │ Edit        │  │
│ │ Pro Services│ Active    │ 4.5★   │ Suspend     │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ Showing 1-10 of 847 | < 1 2 3 4 ... >              │
└─────────────────────────────────────────────────────┘
```

**Status Indicators**
- **Pending** (orange badge) - Awaiting approval
- **Active** (green badge) - Live on platform
- **Suspended** (red badge) - Temporarily disabled
- **Rejected** (gray badge) - Not approved

**Detail View Modal**
```
┌─ Business Profile ──────────────────────────────────┐
│  Close [×]                                          │
│                                                    │
│  BUSINESS INFO                    VERIFICATION    │
│  ├─ Name: Sparkle Clean          ├─ Status: Active
│  ├─ Phone: (615) 555-0123        ├─ Verified: Yes
│  ├─ Email: info@sparkle.com      ├─ License: ✓
│  ├─ Website: sparkle.com         ├─ Insurance: ✓
│  ├─ Years: 5                      ├─ Background: ✓
│  │                                │
│  DOCUMENTS                         ACTIONS
│  ├─ [Download License]            [Approve] [Reject]
│  ├─ [Download Insurance]          [Suspend] [Delete]
│  └─ [View Background Check]       [Edit Profile]
│
│  SERVICE AREAS                     RECENT ACTIVITY
│  ├─ Nashville (residential)        • Approved (Nov 1)
│  ├─ Brentwood (commercial)         • Quote sent (Oct 31)
│  └─ Franklin (both)                • Review posted (Oct 28)
│
└─────────────────────────────────────────────────────┘
```

### 3. Reviews Moderation

**Pending Reviews Queue**
```
┌─ Pending Reviews (24) ──────────────────────────────┐
│                                                     │
│ Filter: [All ▼]  Sort: [Newest ▼]  Search: [___]   │
│                                                     │
│ ┌────────────────────────────────────────────────┐  │
│ │ Review by: Jane Doe                            │  │
│ │ Business: Sparkle Clean              ★★★★☆    │  │
│ │ "Great service, very professional!"           │  │
│ │ Service: Residential Deep Clean                │  │
│ │ Service Date: Oct 28, 2024                     │  │
│ │                                                │  │
│ │ [View Photos] [View Business]                  │  │
│ │                                                │  │
│ │ [Approve] [Reject as Spam] [Flag for Review]  │  │
│ └────────────────────────────────────────────────┘  │
│
│ ┌────────────────────────────────────────────────┐  │
│ │ Review by: Mike Roberts                        │  │
│ │ Business: Best Clean Services          ★☆☆☆☆  │  │
│ │ "Did not show up on time, poor work quality" │  │
│ │                                                │  │
│ │ [Approve] [Reject as Spam] [Flag for Review]  │  │
│ └────────────────────────────────────────────────┘  │
│
└─────────────────────────────────────────────────────┘
```

**Moderation Guidelines**
- Verify review is from real customer (quote history)
- Check for spam/fake reviews
- Ensure professional tone
- Respect business responses
- Flag suspicious patterns

### 4. Quote Requests Management

**Quote Queue Dashboard**
```
┌─ Quote Requests ────────────────────────────────────┐
│                                                     │
│ Status: [All ▼]  Assigned: [All ▼]  Days: [7 ▼]   │
│                                                     │
│ ┌────────────────────────────────────────────────┐  │
│ │ ID     │ Customer │ Service │ Status │ Actions │  │
│ ├────────────────────────────────────────────────┤  │
│ │ QT-847 │ J. Smith │ Deep    │ New    │ View    │  │
│ │ QT-846 │ M. Jones │ Move    │ Sent   │ Follow  │  │
│ │ QT-845 │ S. Brown │ Carpet  │ Closed │ Stats   │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Metrics to Track**
- Average response time
- Quote-to-booking conversion
- Customer satisfaction
- Peak service times

### 5. Analytics & Reports

**Key Metrics Dashboard**
```
PLATFORM HEALTH              BUSINESS GROWTH
├─ Active Users: 12,450      ├─ New Businesses: +23
├─ Monthly Visitors: 45.2K   ├─ Churn Rate: 2.1%
├─ Quote Requests: 2,341     ├─ Avg Rating: 4.2★
├─ Platform Revenue: $4.2K   └─ Premium Growth: +12%

USER ENGAGEMENT              CONTENT QUALITY
├─ Avg Session: 3:42         ├─ Reviewed: 847/847 (100%)
├─ Bounce Rate: 32%          ├─ Avg Reviews: 4.1
├─ Search → Contact: 23%     └─ Spam Detected: 8
└─ Mobile: 68%
```

**Charts & Visualizations**
- Revenue trend (bar chart)
- Quote requests over time (line chart)
- User growth (area chart)
- Service breakdown (pie chart)
- Geographic distribution (map)

### 6. User Management

**Users List**
```
┌─ User Accounts ─────────────────────────────────────┐
│                                                     │
│ Role: [All ▼]  Status: [All ▼]  Search: [______]   │
│                                                     │
│ ┌────────────────────────────────────────────────┐  │
│ │ Email              │ Role      │ Status │ Acts  │  │
│ ├────────────────────────────────────────────────┤  │
│ │ tyler@example.com  │ Admin     │ Active │ View  │  │
│ │ owner1@biz.com     │ Business  │ Active │ View  │  │
│ │ customer@mail.com  │ Customer  │ Active │ View  │  │
│ │ spam@test.com      │ Customer  │ Banned │ View  │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 7. Settings & Configuration

**Admin Settings**
```
┌─ Settings ──────────────────────────────────────────┐
│                                                     │
│ GENERAL                     PLATFORM                │
│ ├─ Site Title              ├─ Auto-approve: Off
│ ├─ Site URL                ├─ Review Moderation: On
│ ├─ Support Email           ├─ Spam Detection: On
│ └─ Timezone                └─ Max Uploads: 50MB
│
│ NOTIFICATIONS              EMAIL TEMPLATES
│ ├─ New Business Signup     ├─ Approval Email
│ ├─ Review Posted           ├─ Rejection Email
│ ├─ Quote Request           ├─ Welcome Email
│ └─ Flagged Content         └─ Reminder Email
│
│ [Save Settings] [Reset to Defaults]
└─────────────────────────────────────────────────────┘
```

---

## Component Library

### KPI Card
```typescript
interface KPICard {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  comparison?: string
  onClick?: () => void
}

// Example
<KPICard
  title="Pending Approvals"
  value={12}
  icon={<CheckCircle />}
  trend={{ value: 2, direction: 'down' }}
  comparison="-2 from yesterday"
/>
```

### Status Badge
```typescript
type Status = 'pending' | 'active' | 'suspended' | 'rejected'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800'
}
```

### Table with Actions
```typescript
interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

interface TableAction {
  label: string
  icon?: React.ReactNode
  onClick: (item: any) => void
  variant?: 'primary' | 'secondary' | 'danger'
}
```

### Modal/Dialog
```typescript
interface AdminModal {
  title: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  actions?: {
    primary?: { label: string; onClick: () => void }
    secondary?: { label: string; onClick: () => void }
  }
}
```

---

## Navigation Structure

### Sidebar Menu
```
📊 Dashboard          (Overview, Metrics)
🏢 Businesses        (List, Approve, Manage)
⭐ Reviews           (Moderate, Stats)
💬 Quote Requests    (Queue, Follow-up)
👥 Users             (Manage, Roles)
📈 Analytics         (Reports, Charts)
⚙️ Settings          (Configuration)
```

### Color Scheme (Using our palette)

- **Sidebar**: `neutral-900` (dark background)
- **Sidebar Text**: `white`
- **Active Menu**: `primary-500` background
- **Main Content**: `neutral-50` background
- **Cards**: `white` with `neutral-200` border
- **KPI Cards**: Subtle colored backgrounds
  - Revenue: `accent-50`
  - Approvals: `primary-50`
  - Growth: `primary-50`
  - Alerts: `accent-50`

---

## Data Flow

### Business Approval Workflow
```
New Registration
    ↓
Status: "pending"
Admin Reviews Documents
    ├─ Approve → Status: "active" → Email: Approved
    ├─ Reject → Status: "rejected" → Email: Rejection
    └─ Request Info → Status: "pending" → Email: Requested

Active Business
    ├─ Can post listings
    ├─ Receive quote requests
    ├─ Post reviews
    └─ View analytics
```

### Review Moderation Workflow
```
Customer Posts Review
    ↓
Status: "pending"
Admin Reviews
    ├─ Approve → Status: "approved" → Shows on profile
    ├─ Reject → Status: "rejected" → Removed
    └─ Flag → Status: "flagged" → Manual review

Approved Review
    ├─ Visible to all users
    ├─ Counts toward rating
    └─ Business can respond
```

---

## Implementation Priority

### Phase 1 (MVP - Week 4)
- [x] Dashboard overview with KPI cards
- [x] Businesses list with approval workflow
- [x] Reviews moderation queue
- [x] Basic settings

### Phase 2 (Week 5-6)
- [ ] Advanced analytics & charts
- [ ] User management system
- [ ] Email notification settings
- [ ] Quote tracking dashboard
- [ ] Detailed reports

### Phase 3 (Post-MVP)
- [ ] AI-powered spam detection
- [ ] Automated business verification
- [ ] Custom report builder
- [ ] Webhook integrations
- [ ] API management console

---

## UI Framework & Components

### Recommended Libraries
- **shadcn/ui**: Pre-built accessible components
- **Recharts**: Data visualization
- **react-data-table-component**: Advanced tables
- **react-hook-form**: Form management
- **zustand**: State management

### Admin-Specific Components to Create
```
components/admin/
├── Sidebar.tsx
├── TopNav.tsx
├── KPICard.tsx
├── AdminTable.tsx
├── StatusBadge.tsx
├── ActionButton.tsx
├── Modal.tsx
├── Chart.tsx
├── ActivityFeed.tsx
└── QuickActions.tsx
```

### Page Structure
```
app/(admin)/
├── layout.tsx          # Admin layout with sidebar
├── page.tsx           # Dashboard overview
├── businesses/        # Business management
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── reviews/           # Review moderation
├── quotes/            # Quote management
├── users/             # User management
├── analytics/         # Analytics & reports
└── settings/          # Admin settings
```

---

## Accessibility & UX

### Keyboard Navigation
- Tab through all interactive elements
- Enter to activate buttons
- Escape to close modals
- Arrow keys in tables

### Screen Reader Support
- Semantic HTML (nav, main, section)
- ARIA labels for icons
- Table headers properly marked
- Form labels associated with inputs

### Mobile Considerations
- Responsive sidebar (collapsible)
- Touch-friendly buttons
- Scrollable tables
- Bottom navigation option

---

## Security Considerations

- ✅ Role-based access control
- ✅ Audit logs for all admin actions
- ✅ Two-factor authentication (Phase 2)
- ✅ IP whitelisting (Phase 2)
- ✅ Session timeout (30 min inactivity)
- ✅ CSRF protection
- ✅ Rate limiting on approvals

---

## Performance Goals

- Dashboard loads in < 2 seconds
- Table with 1,000 rows in < 3 seconds
- Charts render in < 1 second
- Modal opens instantly (< 300ms)
- Lazy load heavy components (charts, images)

---

## Success Metrics

- Admin can approve 10 businesses in < 5 minutes
- Moderate 20 reviews in < 10 minutes
- Find business info in < 30 seconds
- Create custom report in < 2 minutes
