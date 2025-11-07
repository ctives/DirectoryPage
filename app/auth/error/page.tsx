'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorPageContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    InvalidCallback: 'Invalid callback URL. Please try again.',
    OAuthSignin: 'Failed to sign in with OAuth provider.',
    OAuthCallback: 'OAuth callback failed.',
    OAuthCreateAccount: 'Could not create OAuth account.',
    EmailCreateAccount: 'Could not create email account.',
    Callback: 'An error occurred during callback.',
    OAuthAccountNotLinked:
      'Email already in use with a different sign-in method.',
    EmailSignInError: 'Email sign-in failed.',
    SessionCallback: 'Session callback error.',
    SignOutError: 'Sign out failed.',
    VerifyEmailError: 'Email verification failed.',
    AccessDenied: 'Access denied.',
  }

  const message = error ? errorMessages[error] || error : 'An error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full">
              <svg
                className="w-8 h-8 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-neutral-600 mb-8">{message}</p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Return to Sign In
            </Link>
            <Link
              href="/"
              className="block w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium py-2 px-4 rounded-lg transition"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-sm text-neutral-500">
            Need help?{' '}
            <a
              href="mailto:support@nashvillecleaningdirectory.com"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  )
}
