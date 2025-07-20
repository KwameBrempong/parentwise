import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/auth/verify-request',
          '/api/auth',
        ]

        // Check if current path is public
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // For API routes, require authentication
        if (pathname.startsWith('/api/')) {
          return !!token
        }

        // For dashboard and other protected routes, require authentication
        if (pathname.startsWith('/dashboard') || 
            pathname.startsWith('/onboarding') ||
            pathname.startsWith('/profile') ||
            pathname.startsWith('/family')) {
          return !!token
        }

        // Default to requiring authentication
        return !!token
      },
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
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}