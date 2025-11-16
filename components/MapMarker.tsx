'use client'

import { useState } from 'react'
import { Marker, Popup } from 'react-map-gl/maplibre'
import { SERVICE_TYPE_COLORS, MARKER_ICONS } from '@/lib/map-constants'

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

interface MapMarkerProps {
  business: Business
  isActive?: boolean
  onClick?: (businessId: string) => void
  onHover?: (businessId: string | null) => void
}

export default function MapMarker({
  business,
  isActive,
  onClick,
  onHover,
}: MapMarkerProps) {
  const [showPopup, setShowPopup] = useState(false)

  const color = SERVICE_TYPE_COLORS[business.service_type || 'both']
  const markerIcon = isActive
    ? MARKER_ICONS.ACTIVE(color)
    : MARKER_ICONS.BUSINESS(color)

  return (
    <>
      <Marker
        longitude={business.longitude}
        latitude={business.latitude}
        onClick={(e) => {
          e.originalEvent.stopPropagation()
          setShowPopup(true)
          onClick?.(business.id)
        }}
        style={{
          cursor: 'pointer',
        }}
      >
        <div
          onMouseEnter={() => onHover?.(business.id)}
          onMouseLeave={() => onHover?.(null)}
          style={{
            width: '40px',
            height: '40px',
            filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s ease, filter 0.2s ease',
          }}
          dangerouslySetInnerHTML={{ __html: markerIcon }}
        />
      </Marker>

      {showPopup && (
        <Popup
          longitude={business.longitude}
          latitude={business.latitude}
          onClose={() => setShowPopup(false)}
          closeButton={true}
          closeOnClick={true}
          anchor="bottom"
        >
          <div className="p-3 max-w-xs">
            <h3 className="font-bold text-gray-900 mb-2">{business.name}</h3>

            {business.average_rating && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★</span>
                <span className="font-medium text-gray-800">
                  {business.average_rating}
                </span>
                <span className="text-gray-600 text-sm">
                  ({business.review_count || 0})
                </span>
              </div>
            )}

            {business.address && (
              <p className="text-gray-600 text-sm mb-2">{business.address}</p>
            )}

            {business.description && (
              <p className="text-gray-600 text-sm mb-2">{business.description}</p>
            )}

            <button className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 rounded transition text-sm">
              View Details
            </button>
          </div>
        </Popup>
      )}
    </>
  )
}
