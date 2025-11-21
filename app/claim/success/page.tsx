'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId') || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Email Verified!</h1>

          <p className="text-neutral-600 mb-6">
            Your email has been verified successfully. Your claim has been submitted for review.
          </p>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What happens now?</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Our team will review your claim (typically within 24 hours)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>You'll receive an email confirmation once approved</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Log in to your dashboard to manage your business listing</span>
              </li>
            </ol>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg text-center transition duration-200"
            >
              Back to Directory
            </Link>
            <p className="text-xs text-neutral-500">
              Check your email for updates on your claim status
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
