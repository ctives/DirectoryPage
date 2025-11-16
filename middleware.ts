import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Pages that require authentication
const protectedRoutes = [
  '/dashboard',
  '/dashboard/:path*',
  '/admin',
  '/admin/:path*',
  '/settings',
  '/settings/:path*',
]

// Public routes (no auth required)
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/error', '/', '/terms', '/privacy', '/auth/verify-email']

export default withAuth(
  function middleware(request: NextRequest) {
    const token = (request as any).nextauth?.token
    const pathname = request.nextUrl.pathname

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // Business owner dashboard protection
    if (pathname.startsWith('/dashboard')) {
      if (!token || (token.role !== 'business' && token.role !== 'admin')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // Settings requires authentication
    if (pathname.startsWith('/settings')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if path requires authentication
        const pathname = req.nextUrl.pathname

        // Allow public routes
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Allow public API routes (search)
        if (pathname.startsWith('/api/search')) {
          return true
        }

        return !!token
      },
    },
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder and all its assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|public).*)',
  ],
}
