'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SignUpSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

type SignUpInput = z.infer<typeof SignUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'type' | 'details'>('type')
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      userType: userType || undefined,
    },
  })

  async function onSubmit(data: SignUpInput) {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            userType: data.userType,
          },
        },
      })

      if (authError || !authData.user) {
        setError(
          authError?.message || 'Failed to create account'
        )
        return
      }

      // Create user record in database
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.userType,
            verified: false,
            created_at: new Date().toISOString(),
          },
        ])

      if (dbError) {
        setError('Failed to complete registration')
        return
      }

      // Redirect to verification page
      router.push('/auth/verify-email')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Join Nashville Cleaning Directory
            </h1>
            <p className="text-neutral-600 mt-2">
              {step === 'type'
                ? 'Choose your account type'
                : 'Create your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <p className="text-accent-900 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: User Type Selection */}
          {step === 'type' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setUserType('customer')
                  setStep('details')
                }}
                className="w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
              >
                <h3 className="font-semibold text-neutral-900">
                  I&apos;m Looking for Services
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Find and hire cleaning businesses in Nashville
                </p>
              </button>

              <button
                onClick={() => {
                  setUserType('business')
                  setStep('details')
                }}
                className="w-full p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
              >
                <h3 className="font-semibold text-neutral-900">
                  I&apos;m a Cleaning Business
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  List your services and get customer leads
                </p>
              </button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {step === 'details' && userType && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  {userType === 'business' ? 'Business Name' : 'Full Name'}
                </label>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  placeholder={
                    userType === 'business'
                      ? 'Sparkle Clean Services'
                      : 'John Doe'
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.name
                      ? 'border-accent-500 focus:ring-accent-500'
                      : 'border-neutral-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-accent-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Email Address
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.email
                      ? 'border-accent-500 focus:ring-accent-500'
                      : 'border-neutral-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-accent-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Password
                </label>
                <input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.password
                      ? 'border-accent-500 focus:ring-accent-500'
                      : 'border-neutral-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-accent-600">
                    {errors.password.message}
                  </p>
                )}
                <p className="mt-2 text-xs text-neutral-500">
                  At least 8 characters with uppercase, number, and special character
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.confirmPassword
                      ? 'border-accent-500 focus:ring-accent-500'
                      : 'border-neutral-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-accent-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 text-primary-500 rounded focus:ring-primary-500 border-neutral-300"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-3 text-sm text-neutral-700"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-500 hover:bg-accent-600 active:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Back Button (Step 2 only) */}
          {step === 'details' && (
            <button
              onClick={() => {
                setStep('type')
                setUserType(null)
              }}
              className="w-full mt-4 text-neutral-600 hover:text-neutral-900 font-medium py-2 px-4 transition"
            >
              ← Back
            </button>
          )}

          {/* Sign In Link */}
          {step === 'type' && (
            <div className="mt-8 text-center border-t border-neutral-200 pt-6">
              <p className="text-neutral-600">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
