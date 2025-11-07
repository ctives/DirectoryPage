# Authentication Implementation Guide

## Overview

This document details the complete authentication implementation for the Nashville Cleaning Directory, supporting three distinct user types with role-based access control.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- NULL if social login only
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'customer',  -- 'admin', 'business', 'customer'
  role_metadata JSONB,  -- Store additional role-specific data
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',  -- 'active', 'suspended', 'deleted'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

### Business Owners Table
```sql
CREATE TABLE business_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  ownership_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'verified', 'rejected'
  verification_method VARCHAR(50),  -- 'document', 'phone', 'email'
  verification_document_urls JSONB,  -- Array of document URLs
  verification_notes TEXT,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),  -- Admin who approved
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_owners_user_id ON business_owners(user_id);
CREATE INDEX idx_business_owners_business_id ON business_owners(business_id);
CREATE INDEX idx_business_owners_status ON business_owners(ownership_status);
```

### Businesses Table (Updates)
```sql
-- Add these columns to the existing businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';  -- 'pending', 'active', 'suspended', 'archived'
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified';  -- 'unverified', 'verified', 'flagged'
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Indexes
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_verification ON businesses(verification_status);
```

### Quote Requests Table
```sql
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL if customer not logged in
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  property_type VARCHAR(50),  -- 'residential', 'commercial'
  property_size_sqft INTEGER,
  service_address TEXT,
  zip_code VARCHAR(10),
  preferred_date DATE,
  frequency VARCHAR(50),  -- 'one_time', 'weekly', 'bi_weekly', 'monthly'
  message TEXT,
  photos JSONB,  -- Array of photo URLs
  status VARCHAR(50) DEFAULT 'new',  -- 'new', 'sent_to_business', 'responded', 'closed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quote_requests_business_id ON quote_requests(business_id);
CREATE INDEX idx_quote_requests_customer_id ON quote_requests(customer_id);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  service_type VARCHAR(100),
  service_date DATE,
  verified BOOLEAN DEFAULT FALSE,  -- TRUE if verified as legitimate customer
  verification_method VARCHAR(50),  -- 'quote_request', 'receipt_upload', 'email'
  verification_photo_url TEXT,
  helpful_count INTEGER DEFAULT 0,
  photos JSONB,  -- Array of review photo URLs
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected', 'spam'
  flagged_reason TEXT,  -- Reason if flagged
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_verified ON reviews(verified);
```

## Next.js Implementation

### Environment Variables (.env.local)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# Google OAuth (Phase 2)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
RESEND_API_KEY=your_resend_key

# Application
NEXT_PUBLIC_APP_NAME="Nashville Cleaning Directory"
```

### NextAuth Configuration (lib/auth.ts)
```typescript
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (error || !user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.email_verified_at
        }
      }
    }),
    // Add Google OAuth in Phase 2
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60  // 30 days
  }
}
```

### Middleware (middleware.ts)
```typescript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes
    if (path.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
    }

    // Business routes
    if (path.startsWith("/business/dashboard")) {
      if (!token || (token.role !== "business" && token.role !== "admin")) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
    }

    // Customer dashboard
    if (path.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/business/dashboard/:path*",
    "/dashboard/:path*"
  ]
}
```

### Auth Routes

#### Sign Up (app/auth/signup/page.tsx)
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-actions"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const userType = formData.get("userType") as string

    try {
      await signUp(email, password, name, userType)
      router.push("/auth/verify-email")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">I am a...</label>
          <select name="userType" required className="w-full border rounded px-3 py-2">
            <option value="customer">Customer (Looking for cleaning service)</option>
            <option value="business">Business Owner (Cleaning service)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account? <a href="/auth/login" className="text-blue-600">Login</a>
      </p>
    </div>
  )
}
```

#### Login (app/auth/login/page.tsx)
```typescript
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  async function handleGoogleSignIn() {
    await signIn("google", { redirect: true })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        className="w-full border border-gray-300 rounded py-2 px-3 hover:bg-gray-50 font-medium"
      >
        Google
      </button>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account? <a href="/auth/signup" className="text-blue-600">Sign up</a>
      </p>
    </div>
  )
}
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Business owners can view their business
CREATE POLICY "Business owners can view their business"
  ON businesses FOR SELECT
  USING (
    owner_id = auth.uid() OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Customers can submit quote requests
CREATE POLICY "Users can insert quote requests"
  ON quote_requests FOR INSERT
  WITH CHECK (true);

-- Businesses can view their quote requests
CREATE POLICY "Businesses can view their quote requests"
  ON quote_requests FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    ) OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
```

## Implementation Checklist

- [ ] Create database tables and RLS policies
- [ ] Set up NextAuth.js configuration
- [ ] Implement auth middleware
- [ ] Create signup page (email/password)
- [ ] Create login page (email/password)
- [ ] Add Google OAuth provider (Phase 2)
- [ ] Create password reset flow (Phase 2)
- [ ] Add email verification (Phase 2)
- [ ] Create business verification workflow
- [ ] Add review verification system
- [ ] Build admin dashboard for user management
- [ ] Write tests for auth flows
- [ ] Document API endpoints

## Security Considerations

1. **Password Security**: Use bcrypt with salt rounds = 12
2. **JWT Tokens**: Expire after 30 days
3. **HTTP-only Cookies**: Used for session management
4. **CORS**: Properly configured for allowed origins
5. **Rate Limiting**: Apply to auth endpoints to prevent brute force
6. **Input Validation**: Use Zod for all form inputs
7. **HTTPS**: Enforced in production
8. **CSRF Protection**: NextAuth.js handles automatically
