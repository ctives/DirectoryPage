'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [resentEmail, setResentEmail] = useState(false)

  const handleResendEmail = () => {
    // TODO: Implement resend verification email logic
    setResentEmail(true)
    setTimeout(() => setResentEmail(false), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-neutral-600 mb-4">
            We&apos;ve sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>

          {/* Info Box */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-primary-900">
              <strong>Can&apos;t find the email?</strong>
              <br />
              Check your spam or junk folder. If you still don&apos;t see it, you can
              request a new verification link below.
            </p>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition mb-3"
          >
            {resentEmail ? '✓ Email Resent' : 'Resend Verification Email'}
          </button>

          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="block w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium py-2 px-4 rounded-lg transition text-center"
          >
            Back to Sign In
          </Link>

          {/* Help Text */}
          <p className="mt-6 text-sm text-neutral-500">
            Questions?{' '}
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
