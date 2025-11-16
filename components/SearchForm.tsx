'use client'

import { useState } from 'react'

interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: {
    serviceType: string
    neighborhood: string
    zipCode: string
  }
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void
  onSearch: (e: React.FormEvent) => void
  onShowAdvanced: (show: boolean) => void
}

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  filters,
  onFilterChange,
  onSearch,
  onShowAdvanced,
}: SearchFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleShowAdvanced = () => {
    const newShowAdvanced = !showAdvanced
    setShowAdvanced(newShowAdvanced)
    onShowAdvanced(newShowAdvanced)
  }

  return (
    <form onSubmit={onSearch} className="space-y-4">
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
        onClick={handleShowAdvanced}
        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
      >
        {showAdvanced ? '- Hide' : '+ Show'} Advanced Search
      </button>

      {/* Advanced Search Filters */}
      {showAdvanced && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Service Type</label>
              <select
                name="serviceType"
                value={filters.serviceType}
                onChange={onFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="both">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Neighborhood</label>
              <select
                name="neighborhood"
                value={filters.neighborhood}
                onChange={onFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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
              <label className="block text-sm font-medium text-white mb-2">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                placeholder="37201"
                value={filters.zipCode}
                onChange={onFilterChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
