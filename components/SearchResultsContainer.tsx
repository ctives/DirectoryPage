'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import map component to avoid SSR issues
const SearchResultsMap = dynamic(() => import('./SearchResultsMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>,
})

interface Business {
  id: string
  name: string
  latitude: number
  longitude: number
  average_rating?: number
  review_count?: number
  address?: string
  service_type?: 'residential' | 'commercial' | 'both'
  description?: string
  zip_code?: string
}

interface SearchResultsContainerProps {
  businesses: Business[]
  isLoading?: boolean
}

const ITEMS_PER_PAGE = 10

export default function SearchResultsContainer({
  businesses,
  isLoading,
}: SearchResultsContainerProps) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [hoveredBusinessId, setHoveredBusinessId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleBusinessSelect = useCallback((businessId: string) => {
    setSelectedBusinessId(businessId)
    // Scroll list item into view
    const element = document.getElementById(`business-card-${businessId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const handleBusinessHover = useCallback((businessId: string | null) => {
    setHoveredBusinessId(businessId)
  }, [])

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1)
  }, [businesses])

  // Calculate pagination
  const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedBusinesses = businesses.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Loading results...</p>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 text-lg">No businesses found. Try adjusting your search.</p>
      </div>
    )
  }

  // Mobile view: toggle between list and map
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(false)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              !showMap
                ? 'bg-primary-sage text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            List ({businesses.length})
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              showMap
                ? 'bg-primary-sage text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Map
          </button>
        </div>

        {showMap ? (
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <SearchResultsMap
              businesses={businesses}
              selectedBusinessId={selectedBusinessId}
              onBusinessSelect={handleBusinessSelect}
              onBusinessHover={handleBusinessHover}
            />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  isActive={business.id === selectedBusinessId}
                  isHovered={business.id === hoveredBusinessId}
                  onSelect={handleBusinessSelect}
                  onHover={handleBusinessHover}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 mt-4 px-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Tablet and desktop: side-by-side layout
  return (
    <div className="flex gap-6 h-full">
      {/* Left: Business List */}
      <div className="flex-1 lg:flex-0 lg:w-2/5 overflow-y-auto">
        <div className="space-y-4">
          {paginatedBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              isActive={business.id === selectedBusinessId}
              isHovered={business.id === hoveredBusinessId}
              onSelect={handleBusinessSelect}
              onHover={handleBusinessHover}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-3 mt-6 p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium text-sm"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition font-medium text-sm"
              >
                Next
              </button>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Showing {startIndex + 1}–{Math.min(endIndex, businesses.length)} of {businesses.length}
            </div>
          </div>
        )}
      </div>

      {/* Right: Map */}
      <div className="flex-1 lg:flex-0 lg:w-3/5 rounded-lg overflow-hidden shadow-lg sticky top-0 h-96 lg:h-[600px]">
        <SearchResultsMap
          businesses={businesses}
          selectedBusinessId={selectedBusinessId}
          onBusinessSelect={handleBusinessSelect}
          onBusinessHover={handleBusinessHover}
        />
      </div>
    </div>
  )
}

// Business Card Component
interface BusinessCardProps {
  business: Business
  isActive?: boolean
  isHovered?: boolean
  onSelect?: (id: string) => void
  onHover?: (id: string | null) => void
}

function BusinessCard({
  business,
  isActive,
  isHovered,
  onSelect,
  onHover,
}: BusinessCardProps) {
  return (
    <div
      id={`business-card-${business.id}`}
      onClick={() => onSelect?.(business.id)}
      onMouseEnter={() => onHover?.(business.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`business-card-result p-4 rounded-lg border-2 transition cursor-pointer ${
        isActive || isHovered
          ? 'border-primary-sage bg-primary-100 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-sage hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">{business.name}</h3>
          {business.average_rating && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="font-medium text-gray-800 text-sm">
                {business.average_rating}
              </span>
              <span className="text-gray-600 text-xs">
                ({business.review_count || 0} reviews)
              </span>
            </div>
          )}
        </div>
        <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
          {business.service_type === 'both'
            ? 'Residential & Commercial'
            : business.service_type === 'residential'
            ? 'Residential'
            : 'Commercial'}
        </span>
      </div>

      {business.description && (
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{business.description}</p>
      )}

      {business.address && (
        <p className="text-gray-500 text-xs mb-3">
          {business.address}
          {business.zip_code && ` • ${business.zip_code}`}
        </p>
      )}

      <Link
        href={`/business/${business.id}`}
        className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 rounded text-center transition text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </Link>
    </div>
  )
}
