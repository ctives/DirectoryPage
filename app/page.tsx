'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    serviceType: 'both',
    neighborhood: '',
    zipCode: '',
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search:', searchQuery, filters)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Mock business data - will be replaced with actual data from API
  const mockBusinesses = [
    {
      id: '1',
      name: 'Sparkle Clean Services',
      rating: 4.8,
      reviewCount: 145,
      serviceType: 'residential',
      neighborhoods: ['Downtown', 'East Nashville'],
      description: 'Professional residential cleaning with 10+ years experience',
    },
    {
      id: '2',
      name: 'Nashville Office Cleaners',
      rating: 4.9,
      reviewCount: 89,
      serviceType: 'commercial',
      neighborhoods: ['Business District'],
      description: 'Commercial office and janitorial services',
    },
    {
      id: '3',
      name: 'Premier Home Clean',
      rating: 4.7,
      reviewCount: 203,
      serviceType: 'both',
      neighborhoods: ['West Nashville', 'Sylvan Park'],
      description: 'Full-service cleaning for homes and light commercial',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-700 hover:text-primary-800">
              Nashville Cleaning Directory
            </Link>
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

      {/* Search Section */}
      <section className="bg-gradient-to-b from-primary-50 to-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2 text-center">
            Find Cleaning Services in Nashville
          </h1>
          <p className="text-lg text-neutral-600 text-center mb-8">
            Search by business name, zip code, or Nashville neighborhood
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name, zip code, or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition"
              >
                Search
              </button>
            </div>

            {/* Advanced Search Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              {showAdvanced ? '− Hide' : '+ Show'} Advanced Search
            </button>

            {/* Advanced Search Filters */}
            {showAdvanced && (
              <div className="bg-white rounded-lg p-6 border border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={filters.serviceType}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="both">All Services</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  {/* Neighborhood */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Neighborhood
                    </label>
                    <select
                      name="neighborhood"
                      value={filters.neighborhood}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Neighborhoods</option>
                      <option value="downtown">Downtown</option>
                      <option value="east-nashville">East Nashville</option>
                      <option value="west-nashville">West Nashville</option>
                      <option value="sylvan-park">Sylvan Park</option>
                      <option value="business-district">Business District</option>
                    </select>
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="37201"
                      value={filters.zipCode}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            Cleaning Services {searchQuery && `for "${searchQuery}"`}
          </h2>
          <p className="text-neutral-600">{mockBusinesses.length} results</p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBusinesses.map((business) => (
            <Link
              key={business.id}
              href={`/business/${business.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-6">
                {/* Business Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                      {business.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium text-neutral-800">
                        {business.rating}
                      </span>
                      <span className="text-neutral-600 text-sm">
                        ({business.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {business.serviceType === 'both'
                      ? 'Residential & Commercial'
                      : business.serviceType === 'residential'
                      ? 'Residential'
                      : 'Commercial'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-neutral-600 text-sm mb-4">
                  {business.description}
                </p>

                {/* Neighborhoods */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.neighborhoods.map((neighborhood) => (
                    <span
                      key={neighborhood}
                      className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded"
                    >
                      {neighborhood}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 rounded-lg transition">
                  Get Quote
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {mockBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-600 text-lg">No businesses found. Try adjusting your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Nashville Cleaning Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
