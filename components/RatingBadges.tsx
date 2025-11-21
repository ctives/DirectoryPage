'use client'

import { Star, ExternalLink } from 'lucide-react'

interface RatingInfo {
  source: 'our_rating' | 'google' | 'yelp'
  rating: number
  reviewCount?: number
  url?: string
  verified?: boolean
}

interface RatingBadgesProps {
  ratings: RatingInfo[]
}

export default function RatingBadges({ ratings }: RatingBadgesProps) {
  if (!ratings || ratings.length === 0) {
    return null
  }

  const getRatingColor = (source: string) => {
    switch (source) {
      case 'google':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'yelp':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'our_rating':
        return 'bg-primary-50 border-primary-200 text-primary-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google':
        return '🔍'
      case 'yelp':
        return '★'
      case 'our_rating':
        return '⭐'
      default:
        return '★'
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'google':
        return 'Google Rating'
      case 'yelp':
        return 'Yelp Rating'
      case 'our_rating':
        return 'Our Rating'
      default:
        return 'Rating'
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {ratings.map((rating, idx) => (
        <a
          key={idx}
          href={rating.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition hover:shadow-md ${getRatingColor(
            rating.source
          )} ${rating.url ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-1">
            <span className="text-xl">{getSourceIcon(rating.source)}</span>
            <span className="font-bold text-lg">{rating.rating.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">{getSourceLabel(rating.source)}</span>
            {rating.reviewCount && (
              <span className="text-xs opacity-75">({rating.reviewCount} reviews)</span>
            )}
          </div>
          {rating.url && <ExternalLink size={14} className="ml-1 opacity-60" />}
        </a>
      ))}
    </div>
  )
}
