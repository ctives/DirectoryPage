'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Photo {
  id: string
  photo_url: string
  thumbnail_url?: string
  caption?: string
  photo_type?: 'portfolio' | 'before_after' | 'team' | 'facility'
  is_primary?: boolean
}

interface BusinessPhotoGalleryProps {
  photos: Photo[]
  businessName: string
}

export default function BusinessPhotoGallery({
  photos,
  businessName,
}: BusinessPhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  if (!photos || photos.length === 0) {
    return null
  }

  // Sort photos: primary first, then by type, then by display order
  const sortedPhotos = [...photos].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return 0
  })

  const currentPhoto = sortedPhotos[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedPhotos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === sortedPhotos.length - 1 ? 0 : prev + 1))
  }

  const getPhotoTypeLabel = (type?: string) => {
    switch (type) {
      case 'before_after':
        return 'Before & After'
      case 'team':
        return 'Team'
      case 'facility':
        return 'Facility'
      case 'portfolio':
      default:
        return 'Portfolio'
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Main Image */}
        <div className="relative bg-gray-100 aspect-video overflow-hidden">
          <Image
            src={currentPhoto.photo_url}
            alt={currentPhoto.caption || `${businessName} photo`}
            fill
            className="object-cover"
            priority
            unoptimized
          />

          {/* Navigation Buttons */}
          {sortedPhotos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-lg z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-lg z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-900 px-3 py-2 rounded-lg transition text-sm font-medium shadow-lg z-10"
          >
            View Full Size
          </button>

          {/* Photo Counter */}
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {sortedPhotos.length}
          </div>

          {/* Photo Type Badge */}
          {currentPhoto.photo_type && (
            <div className="absolute bottom-4 right-4 bg-primary-sage text-white px-3 py-1 rounded-full text-sm font-medium">
              {getPhotoTypeLabel(currentPhoto.photo_type)}
            </div>
          )}
        </div>

        {/* Photo Caption and Info */}
        <div className="p-4 md:p-6">
          {currentPhoto.caption && (
            <p className="text-gray-700 mb-3">{currentPhoto.caption}</p>
          )}

          {/* Thumbnail Strip */}
          {sortedPhotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    index === selectedIndex
                      ? 'border-primary-sage shadow-md'
                      : 'border-gray-200 hover:border-primary-sage'
                  }`}
                  aria-label={`View photo ${index + 1}`}
                >
                  <Image
                    src={photo.thumbnail_url || photo.photo_url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition p-2"
            aria-label="Previous photo"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
            <Image
              src={currentPhoto.photo_url}
              alt={currentPhoto.caption || `${businessName} photo`}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition p-2"
            aria-label="Next photo"
          >
            <ChevronRight size={40} />
          </button>

          {/* Lightbox Photo Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedIndex + 1} / {sortedPhotos.length}
          </div>
        </div>
      )}
    </>
  )
}
