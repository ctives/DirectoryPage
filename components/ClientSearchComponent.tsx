'use client'

import { useEffect, useState } from 'react'
import SearchResultsContainer from './SearchResultsContainer'

interface ClientSearchComponentProps {
  showResults?: boolean
}

export default function ClientSearchComponent({ showResults = false }: ClientSearchComponentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    serviceType: 'both',
    neighborhood: '',
    zipCode: '',
  })
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(true)

  // Load all businesses on component mount
  useEffect(() => {
    const loadInitialBusinesses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/search')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load businesses')
        }

        setSearchResults(result.data || [])
        setHasSearched(true)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error loading businesses:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialBusinesses()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('query', searchQuery)
      if (filters.serviceType && filters.serviceType !== 'both') {
        params.append('serviceType', filters.serviceType)
      }
      if (filters.neighborhood) params.append('neighborhood', filters.neighborhood)
      if (filters.zipCode) params.append('zipCode', filters.zipCode)

      const response = await fetch(`/api/search?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      setSearchResults(result.data || [])
      setHasSearched(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setSearchResults([])
      setHasSearched(true)
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Only show search form for hero section
  if (!showResults) {
    return (
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
    )
  }

  // Show results section with map integration
  return (
    <>
      {hasSearched && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {!error && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Cleaning Services {searchQuery && `for "${searchQuery}"`}
                </h2>
                <p className="text-neutral-600">{searchResults.length} results</p>
              </div>

              <SearchResultsContainer
                businesses={searchResults}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
      )}
    </>
  )
}
