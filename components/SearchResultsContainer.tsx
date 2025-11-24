'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  photo_url: string
  thumbnail_url?: string
  is_primary?: boolean
}

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
  photos?: Photo[]
  business_photos?: Photo[]
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

  // Mobile view: show just the list
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
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
      </div>
    )
  }

  // Tablet and desktop: show just the list
  return (
    <div className="flex flex-col gap-4">
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
        <div className="flex flex-col gap-3 mt-6 p-4 bg-white border border-gray-200 rounded-lg">
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const photos = (business.photos || business.business_photos || []) as Photo[]
  const hasImages = photos && photos.length > 0
  const primaryPhoto = photos?.find(p => p.is_primary) || photos?.[0]
  const displayedPhoto = photos?.[selectedImageIndex] || primaryPhoto

  const handleImageSelect = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    setSelectedImageIndex(index)
  }

  return (
    <Link
      href={`/business/${business.id}`}
      id={`business-card-${business.id}`}
      onClick={() => onSelect?.(business.id)}
      onMouseEnter={() => onHover?.(business.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`business-card-result block rounded-lg border-2 transition cursor-pointer no-underline ${
        isActive || isHovered
          ? 'border-primary-sage bg-primary-100 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-sage hover:shadow-md'
      }`}
    >
      {/* Main Image and Meta Content */}
      <div className="p-4">
        {/* Top Section: Main Image (left) + Meta Info (right) */}
        <div className="flex gap-4 mb-4">
          {/* Main Image - Left Side */}
          {hasImages && (
            <div className="relative bg-gray-200 h-32 w-32 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={displayedPhoto?.thumbnail_url || displayedPhoto?.photo_url || ''}
                alt={business.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          )}

          {/* Content Section - Right Side (floats next to main image) */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1 min-w-0">
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
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
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
              <p className="text-gray-500 text-xs">
                {business.address}
                {business.zip_code && ` • ${business.zip_code}`}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section: Additional Images Gallery */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={(e) => handleImageSelect(e, index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  selectedImageIndex === index
                    ? 'border-primary-sage shadow-lg'
                    : 'border-gray-300 hover:border-primary-sage'
                }`}
              >
                <Image
                  src={photo.thumbnail_url || photo.photo_url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
