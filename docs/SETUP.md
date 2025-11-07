# Project Setup Guide

Complete guide to setting up the Nashville Cleaning Directory project.

## Prerequisites

- Node.js 18+ and npm
- GitHub account (for version control)
- Supabase account (free)
- NextAuth.js configured

## 1. Project Initialization (✅ COMPLETED)

The Next.js 14 project has been initialized with:
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components (ready to add)
- Zod for validation schemas
- NextAuth.js for authentication
- Supabase for database and auth

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Required Variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `NEXTAUTH_URL` - http://localhost:3000 (for dev)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

## 3. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Music City Cleaning Services
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to Nashville (likely US East)
4. Click "Create new project"

### Get Your Credentials

1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### Create Database Tables

Run the SQL migrations from [docs/AUTHENTICATION.md](./AUTHENTICATION.md) in Supabase SQL Editor:

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy and paste the SQL from AUTHENTICATION.md (Users, Business Owners, Businesses, Quote Requests, Reviews tables)
4. Click "Run"

### Enable Row Level Security

1. Go to Authentication → Policies
2. Enable RLS on all tables
3. Add policies as defined in AUTHENTICATION.md

## 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `.env.local` as `NEXTAUTH_SECRET`

## 5. Install Dependencies

```bash
npm install
```

All dependencies are already in package.json

## 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Project Structure

```
DirectoryPage/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public routes (no auth)
│   ├── (auth)/            # Auth pages
│   ├── (business)/        # Business routes
│   ├── (admin)/           # Admin routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── validations/      # Zod schemas
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── docs/                 # Documentation
└── .env.local           # Environment variables (NOT in git)
```

## 8. Add shadcn/ui Components

To add UI components as needed:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
# etc...
```

## 9. Git Configuration

If you need to fix git author:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 10. Start Building

The foundation is now complete. Next steps:

1. **Set up Supabase** (database + auth)
2. **Configure NextAuth.js** (authentication middleware)
3. **Build homepage** (search functionality)
4. **Create business listing pages** (profile templates)
5. Continue with remaining features per the timeline in BRAINSTORM.md

## Troubleshooting

### Build Fails with TypeScript Errors

```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check ESLint errors
```

### Supabase Connection Issues

1. Verify environment variables are correct
2. Check that your Supabase project is active
3. Ensure API keys have proper permissions

### NextAuth Configuration Issues

1. Make sure `NEXTAUTH_SECRET` is set (min 32 characters)
2. `NEXTAUTH_URL` should match your deployment URL
3. Check auth routes are properly configured

## Next: Set Up Supabase Database

See [docs/AUTHENTICATION.md](./AUTHENTICATION.md) for SQL schemas and RLS policies to create in Supabase.
