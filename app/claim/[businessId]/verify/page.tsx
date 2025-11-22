'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ClaimVerifyPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const businessId = params.businessId as string
  const email = searchParams.get('email') || ''
  const codeFromUrl = searchParams.get('code') || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Auto-populate code from URL if provided
  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl)
    }
  }, [codeFromUrl])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/claim/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verification failed')
        setLoading(false)
        return
      }

      // Verification successful - redirect to success page
      router.push(`/claim/success?businessId=${businessId}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendCooldown(60)
    try {
      const response = await fetch('/api/claim/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          firstName: 'Pending',
          lastName: 'User',
          email,
          phone: '',
        }),
      })
      if (!response.ok) {
        setError('Failed to resend code')
      }
    } catch (err) {
      setError('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-md mx-auto pt-8 px-4 sm:pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
              ← Back to Directory
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Verify Your Email</h1>
          <p className="text-neutral-600">
            We've sent a verification code to <br />
            <strong>{email}</strong>
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleVerify} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-700 mb-1">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setError('')
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-sm text-neutral-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-primary-600 hover:text-primary-700 disabled:text-neutral-400 font-medium text-sm transition"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>

        {/* Info section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">What's next?</h3>
          <p className="text-sm text-blue-800">
            After verification, your claim will be reviewed by our team within 24 hours.
            We'll send you an email confirmation once approved.
          </p>
        </div>
      </div>
    </div>
  )
}
