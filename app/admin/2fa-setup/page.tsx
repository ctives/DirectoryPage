'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Copy, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function AdminTwoFASetupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState<'loading' | 'qrcode' | 'verify' | 'complete'>(
    'loading'
  )
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  // Load 2FA setup on mount
  useEffect(() => {
    const loadSetup = async () => {
      try {
        const response = await fetch('/api/admin/2fa/setup', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to generate 2FA setup')
        }

        const data = await response.json()
        setQrCode(data.qrCode)
        setSecret(data.secret)
        setBackupCodes(data.backupCodes)
        setStep('qrcode')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setStep('qrcode')
      }
    }

    if (session?.user?.role === 'admin') {
      loadSetup()
    }
  }, [session])

  const handleVerify = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          token: verificationCode,
          backupCodes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Verification failed')
      }

      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading' || step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enable Two-Factor Authentication
          </h1>
          <p className="text-gray-600">
            Secure your admin account with 2FA
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === 'qrcode' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Step 1: Scan QR Code
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>

              {qrCode && (
                <div className="bg-gray-50 p-4 rounded-lg flex justify-center mb-4">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  Can't scan? Enter this code manually:
                </p>
                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-300">
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {secret}
                  </code>
                  <button
                    onClick={() => copyToClipboard(secret)}
                    className="ml-2 p-2 hover:bg-gray-100 rounded transition"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Step 2: Verify
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app
              </p>

              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none mb-4"
              />

              <button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6 || loading}
                className="w-full bg-primary-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Enable 2FA'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                2FA Enabled!
              </h2>
              <p className="text-gray-600">
                Your account is now protected with two-factor authentication
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">
                Save Your Backup Codes
              </h3>
              <p className="text-sm text-amber-800 mb-3">
                Save these codes somewhere safe. Use them to access your account if you lose access to your authenticator app.
              </p>

              <div className="bg-white p-4 rounded border border-amber-200 mb-3 max-h-40 overflow-y-auto">
                {backupCodes.map((code, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700 py-1">
                    {index + 1}. {code}
                  </div>
                ))}
              </div>

              <button
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
                className="w-full text-sm bg-white border border-amber-300 text-amber-700 py-2 px-3 rounded hover:bg-amber-50 transition flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy All Codes'}
              </button>
            </div>

            <button
              onClick={() => router.push('/admin/claims')}
              className="w-full bg-primary-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
