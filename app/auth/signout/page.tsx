'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ redirect: false })
    router.push('/')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Sign Out
            </h1>
            <p className="text-neutral-600 mt-2">
              Are you sure you want to sign out?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full bg-accent-500 hover:bg-accent-600 active:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? 'Signing out...' : 'Yes, Sign Out'}
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            You will be logged out of Nashville Cleaning Directory
          </p>
        </div>
      </div>
    </div>
  )
}
