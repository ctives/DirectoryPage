import Link from 'next/link'
import { getServerSession } from 'next-auth'

export default async function Home() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-700">
              Nashville Cleaning Directory
            </h1>
            <div className="flex gap-4 items-center">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-neutral-700 hover:text-primary-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-neutral-700 hover:text-primary-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6">
            Find Trusted Cleaning Services in Nashville
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Connect with vetted cleaning professionals for your residential or commercial needs. Get instant quotes and reviews from real customers.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link
              href="/auth/signup?type=customer"
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
            >
              Find Services
            </Link>
            <Link
              href="/auth/signup?type=business"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
            >
              List Your Business
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <p className="text-neutral-600">Verified Businesses</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">2,000+</div>
            <p className="text-neutral-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.8★</div>
            <p className="text-neutral-600">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Why Choose Nashville Cleaning Directory?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary-50 rounded-lg p-8">
              <h4 className="text-xl font-bold text-primary-900 mb-3">
                ✓ Verified Professionals
              </h4>
              <p className="text-primary-700">
                Every business is verified and insured. Background checks and insurance verification for your peace of mind.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-8">
              <h4 className="text-xl font-bold text-primary-900 mb-3">
                ✓ Real Customer Reviews
              </h4>
              <p className="text-primary-700">
                See honest reviews from verified customers. No spam or fake ratings. True community feedback.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-8">
              <h4 className="text-xl font-bold text-primary-900 mb-3">
                ✓ Instant Quotes
              </h4>
              <p className="text-primary-700">
                Get multiple quotes from competitors. Compare prices and services easily. Free quote requests.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-8">
              <h4 className="text-xl font-bold text-primary-900 mb-3">
                ✓ Local Expertise
              </h4>
              <p className="text-primary-700">
                Focused on Nashville and surrounding areas. Local knowledge means better service recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">
            Ready to find your perfect cleaning service?
          </h3>
          <p className="text-lg mb-8 text-primary-100">
            Join thousands of Nashville residents getting professional cleaning services
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Nashville Cleaning Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
