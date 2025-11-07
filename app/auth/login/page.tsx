'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LoginSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type LoginInput = z.infer<typeof LoginSchema>

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (!result?.ok) {
        setError(result?.error || 'Failed to login')
        return
      }

      // Redirect to dashboard or requested page
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
      router.push(callbackUrl)
    } catch (err) {
      setError('An unexpected error occurred')
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
              Nashville Cleaning Directory
            </h1>
            <p className="text-neutral-600 mt-2">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <p className="text-accent-900 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                autoComplete="current-password"
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
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Don&apos;t have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
