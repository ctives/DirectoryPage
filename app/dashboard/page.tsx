import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/auth/login')
  }

  const user = session.user as unknown as {
    email: string
    name?: string
    role?: string
    verified?: boolean
    id?: string
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-700">
              Nashville Cleaning Directory
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-neutral-700">{user.email}</span>
              <Link
                href="/api/auth/signout"
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Welcome to your Dashboard
          </h2>

          {/* User Info Card */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-700 font-medium">Email</p>
                <p className="text-primary-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-primary-700 font-medium">Name</p>
                <p className="text-primary-900">{user.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-primary-700 font-medium">Role</p>
                <p className="text-primary-900 capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-primary-700 font-medium">Status</p>
                <p className="text-primary-900">
                  {user.verified ? '✓ Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.role === 'business' && (
                <>
                  <Link
                    href="/dashboard/business"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    My Business Profile
                  </Link>
                  <Link
                    href="/dashboard/listings"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Manage Listings
                  </Link>
                  <Link
                    href="/dashboard/quotes"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    View Quotes
                  </Link>
                </>
              )}
              {user.role === 'customer' && (
                <>
                  <Link
                    href="/"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Search Services
                  </Link>
                  <Link
                    href="/dashboard/quotes"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    My Quote Requests
                  </Link>
                  <Link
                    href="/dashboard/saved"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Saved Businesses
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Manage Users
                  </Link>
                  <Link
                    href="/admin/businesses"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition text-center"
                  >
                    Manage Businesses
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Settings Link */}
          <div className="border-t border-neutral-200 pt-6">
            <Link
              href="/settings"
              className="inline-block text-primary-600 hover:text-primary-700 font-medium"
            >
              → Go to Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
