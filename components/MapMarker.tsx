'use client'

import Link from 'next/link'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { SERVICE_TYPE_COLORS } from '@/lib/map-constants'

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

// Create custom icon for marker
function getMarkerIcon(serviceType: string | undefined, isActive: boolean) {
  const color = SERVICE_TYPE_COLORS[serviceType as keyof typeof SERVICE_TYPE_COLORS] || SERVICE_TYPE_COLORS.both

  // Create SVG marker
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40" height="40">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/>
    </svg>
  `

  const iconUrl = `data:image/svg+xml;base64,${btoa(svg)}`

  return L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: isActive ? 'active-marker' : '',
  })
}

export default function MapMarker({
  business,
  isActive,
  onClick,
  onHover,
}: MapMarkerProps) {
  // Skip rendering if coordinates are missing
  if (!business.latitude || !business.longitude) {
    return null
  }

  const icon = getMarkerIcon(business.service_type, isActive || false)

  return (
    <Marker
      position={[business.latitude, business.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onClick?.(business.id)
        },
        mouseover: () => {
          onHover?.(business.id)
        },
        mouseout: () => {
          onHover?.(null)
        },
      }}
    >
      <Popup>
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
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{business.description}</p>
          )}

          <Link
            href={`/business/${business.id}`}
            className="block w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 rounded transition text-sm text-center"
          >
            View Details
          </Link>
        </div>
      </Popup>
    </Marker>
  )
}
