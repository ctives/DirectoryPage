'use client'

import { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import MapMarker from './MapMarker'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-defaulticon-compatibility'

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

interface SearchResultsMapProps {
  businesses: Business[]
  selectedBusinessId?: string | null
  onBusinessSelect?: (businessId: string) => void
  onBusinessHover?: (businessId: string | null) => void
  isLoading?: boolean
}

// Inner component to access map instance
function MapController({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
  onBusinessHover,
}: Omit<SearchResultsMapProps, 'isLoading'>) {
  const map = useMap()
  const hasZoomedRef = useRef(false)

  // Auto-zoom to fit all markers on initial load
  useEffect(() => {
    if (businesses.length === 0 || hasZoomedRef.current) return

    const bounds = businesses.map((b) => [b.latitude, b.longitude] as [number, number])
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      hasZoomedRef.current = true
    }
  }, [businesses, map])

  return (
    <MarkerClusterGroup chunkedLoading>
      {businesses.map((business) => (
        <MapMarker
          key={business.id}
          business={business}
          isActive={selectedBusinessId === business.id}
          onClick={() => onBusinessSelect?.(business.id)}
          onHover={(id) => onBusinessHover?.(id)}
        />
      ))}
    </MarkerClusterGroup>
  )
}

export default function SearchResultsMap({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
  onBusinessHover,
  isLoading,
}: SearchResultsMapProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No businesses to display on map</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[36.1627, -86.7816]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        minZoom={8}
        maxZoom={20}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          businesses={businesses}
          selectedBusinessId={selectedBusinessId}
          onBusinessSelect={onBusinessSelect}
          onBusinessHover={onBusinessHover}
        />
      </MapContainer>

      {/* Business Count Badge */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 z-[500]">
        <p className="text-sm font-medium text-gray-800">
          {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  )
}
