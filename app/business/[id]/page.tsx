'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MapPin, Phone, Mail, Globe, ArrowLeft, Share2, Shield, Check } from 'lucide-react'
import BusinessPhotoGallery from '@/components/BusinessPhotoGallery'
import RatingBadges from '@/components/RatingBadges'
import SocialMediaLinks from '@/components/SocialMediaLinks'

// Dynamically import map to avoid SSR issues
const BusinessDetailMap = dynamic(
  () => import('@/components/BusinessDetailMap'),
  { ssr: false, loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">Loading map...</div> }
)

interface Photo {
  id: string
  photo_url: string
  thumbnail_url?: string
  caption?: string
  photo_type?: 'portfolio' | 'before_after' | 'team' | 'facility'
  is_primary?: boolean
}

interface Rating {
  source: 'our_rating' | 'google' | 'yelp'
  rating: number
  reviewCount?: number
  url?: string
}

interface SocialMedia {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
  url: string
  handle?: string
}

interface Business {
  id: string
  name: string
  description?: string
  address?: string
  zip_code?: string
  phone?: string
  email?: string
  website?: string
  latitude?: number
  longitude?: number
  average_rating?: number
  review_count?: number
  service_type?: 'residential' | 'commercial' | 'both'
  years_in_business?: number
  insurance_verified?: boolean
  background_check_verified?: boolean
  services?: string[]
  photos?: Photo[]
  ratings?: Rating[]
  socialMedia?: SocialMedia[]
  owner_name?: string
  owner_email?: string
  created_at?: string
}

interface PageParams {
  id: string
}

export default function BusinessDetailPage() {
  const params = useParams() as PageParams
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/business/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Business not found')
          } else {
            setError('Failed to load business details')
          }
          return
        }

        const data = await response.json()
        setBusiness(data)
      } catch (err) {
        setError('Error loading business details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBusiness()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-sage hover:text-primary-sage-dark mb-8">
            <ArrowLeft size={20} />
            Back to Search
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The business you are looking for does not exist.'}</p>
            <Link href="/" className="inline-block bg-primary-sage hover:bg-primary-sage-dark text-white font-medium py-2 px-6 rounded transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/business/${business.id}`
    const text = `Check out ${business.name} on our directory`

    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: text,
          url: url,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary-sage hover:text-primary-sage-dark mb-8">
          <ArrowLeft size={20} />
          Back to Search
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{business.name}</h1>

              {business.average_rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-semibold text-gray-900">{business.average_rating}</span>
                    <span className="text-gray-600">({business.review_count || 0} reviews)</span>
                  </div>
                  {business.service_type && (
                    <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded">
                      {business.service_type === 'both'
                        ? 'Residential & Commercial'
                        : business.service_type === 'residential'
                        ? 'Residential'
                        : 'Commercial'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>

          {business.description && (
            <p className="text-gray-600 text-lg mb-6">{business.description}</p>
          )}

        {/* Ratings */}
        {business.ratings && business.ratings.length > 0 && (
          <div className="mb-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ratings</h3>
            <RatingBadges ratings={business.ratings} />
          </div>
        )}

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 mb-6">
          {business.insurance_verified && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
              <Shield size={18} className="text-green-600" />
              <span className="font-medium text-green-700 text-sm">Insurance Verified</span>
            </div>
          )}
          {business.background_check_verified && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
              <Check size={18} className="text-blue-600" />
              <span className="font-medium text-blue-700 text-sm">Background Checked</span>
            </div>
          )}
        </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
            {business.years_in_business && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-gray-600">In Business</p>
                  <p className="font-semibold text-gray-900">{business.years_in_business} years</p>
                </div>
              </div>
            )}
            {business.insurance_verification && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="font-semibold text-gray-900">Insurance Verified</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        {business.photos && business.photos.length > 0 && (
          <BusinessPhotoGallery photos={business.photos} businessName={business.name} />
        )}

        {/* Map Section */}
        {business.latitude && business.longitude && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <BusinessDetailMap
              latitude={business.latitude}
              longitude={business.longitude}
              businessName={business.name}
            />
          </div>
        )}

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

            <div className="space-y-4">
              {business.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition"
                >
                  <MapPin size={24} className="text-primary-sage flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-medium text-gray-900 hover:text-primary-sage">{business.address}</p>
                    {business.zip_code && (
                      <p className="text-sm text-gray-600">{business.zip_code}</p>
                    )}
                  </div>
                </a>
              )}

              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition"
                >
                  <Phone size={24} className="text-primary-sage flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900 hover:text-primary-sage">{business.phone}</p>
                  </div>
                </a>
              )}

              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition"
                >
                  <Mail size={24} className="text-primary-sage flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900 hover:text-primary-sage break-all">{business.email}</p>
                  </div>
                </a>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition"
                >
                  <Globe size={24} className="text-primary-sage flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Website</p>
                    <p className="font-medium text-gray-900 hover:text-primary-sage break-all">{business.website}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Business</h2>

            <div className="space-y-3">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="block w-full bg-primary-sage hover:bg-primary-sage-dark text-white font-medium py-3 rounded text-center transition"
                >
                  Call Business
                </a>
              )}

              {business.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 rounded text-center transition"
                >
                  Get Directions
                </a>
              )}

              <Link
                href={`/quote-request?businessId=${business.id}`}
                className="block w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded text-center transition"
              >
                Request Quote
              </Link>
            </div>

            {business.email && (
              <p className="text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
                Questions? <a href={`mailto:${business.email}`} className="text-primary-sage hover:text-primary-sage-dark font-medium">Send an email</a>
              </p>
            )}

            {/* Social Media Links */}
            {business.socialMedia && business.socialMedia.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3">Follow on Social Media</p>
                <SocialMediaLinks socialMedia={business.socialMedia} />
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        {business.services && business.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Offered</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {business.services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-primary-100 text-primary-700 rounded px-3 py-2 font-medium text-sm"
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review CTA Section */}
        <div className="bg-gradient-to-r from-primary-sage to-primary-sage-dark rounded-lg shadow-md p-6 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">Share Your Experience</h2>
          <p className="mb-6">Have you used this business? Leave a review to help others make informed decisions.</p>
          <Link
            href={`/review?businessId=${business.id}&businessName=${encodeURIComponent(business.name)}`}
            className="inline-block bg-white text-primary-sage hover:bg-gray-100 font-medium py-2 px-6 rounded transition"
          >
            Write a Review
          </Link>
        </div>
      </div>
    </div>
  )
}
