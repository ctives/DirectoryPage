'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Map from 'react-map-gl/maplibre'
import { MAP_CONSTANTS } from '@/lib/map-constants'
import MapMarker from './MapMarker'
import ClusterMarker from './ClusterMarker'
import Supercluster from 'supercluster'

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

interface Viewport {
  latitude: number
  longitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

interface ClusterData {
  id: number
  properties: {
    cluster: boolean
    cluster_id: number
    point_count: number
    point_count_abbreviated: string
  }
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

interface PointData {
  id: string
  properties: Business & { cluster: false }
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

type ClusterOrPoint = ClusterData | PointData

export default function SearchResultsMap({
  businesses,
  selectedBusinessId,
  onBusinessSelect,
  onBusinessHover,
  isLoading,
}: SearchResultsMapProps) {
  const mapRef = useRef<any>(null)
  const [viewport, setViewport] = useState<Viewport>({
    latitude: MAP_CONSTANTS.DEFAULT_CENTER.latitude,
    longitude: MAP_CONSTANTS.DEFAULT_CENTER.longitude,
    zoom: MAP_CONSTANTS.DEFAULT_ZOOM,
  })
  const [clusters, setClusters] = useState<ClusterOrPoint[]>([])
  const superclusterRef = useRef<Supercluster<Business> | null>(null)

  // Initialize Supercluster with business data
  useEffect(() => {
    if (!businesses || businesses.length === 0) {
      setClusters([])
      return
    }

    // Create Supercluster instance
    const index = new Supercluster<Business>({
      radius: MAP_CONSTANTS.CLUSTER_RADIUS,
      maxZoom: MAP_CONSTANTS.MAX_ZOOM_BEFORE_UNCLUSTERING,
    })

    // Add business points with GeoJSON format
    const points = businesses.map((business) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [business.longitude, business.latitude] as [number, number],
      },
      properties: business,
    }))

    index.load(points)
    superclusterRef.current = index

    // Get clusters and points for current viewport
    updateClusters(index)
  }, [businesses])

  const updateClusters = useCallback(
    (index: Supercluster<Business> | null) => {
      if (!index) return

      const zoom = Math.floor(viewport.zoom)
      const clustersAndPoints = index.getClusters(
        [
          viewport.longitude - 5,
          viewport.latitude - 5,
          viewport.longitude + 5,
          viewport.latitude + 5,
        ],
        zoom
      )

      // Type the clusters and points
      const typedResults = clustersAndPoints.map((item) => {
        const props = item.properties as any
        if (props?.cluster) {
          return {
            id: props.cluster_id,
            properties: {
              cluster: true,
              cluster_id: props.cluster_id,
              point_count: props.point_count,
              point_count_abbreviated: props.point_count_abbreviated,
            },
            geometry: {
              type: 'Point',
              coordinates: item.geometry.coordinates,
            },
          } as ClusterData
        } else {
          return {
            id: (props as Business).id,
            properties: { ...(props as Business), cluster: false },
            geometry: {
              type: 'Point',
              coordinates: item.geometry.coordinates,
            },
          } as PointData
        }
      })

      setClusters(typedResults)
    },
    [viewport]
  )

  const handleViewportChange = (newViewport: Viewport) => {
    setViewport(newViewport)
  }

  // Update clusters when viewport changes
  useEffect(() => {
    if (superclusterRef.current) {
      updateClusters(superclusterRef.current)
    }
  }, [viewport, updateClusters])

  const handleClusterClick = (clusterId: number) => {
    if (!superclusterRef.current) return

    const cluster = superclusterRef.current.getClusterExpansionZoom(clusterId)
    const clusterCenter = superclusterRef.current
      .getClusters([-180, -85, 180, 85], Math.floor(viewport.zoom))
      .find((item) => {
        const props = item.properties as any
        return props?.cluster_id === clusterId
      })

    if (clusterCenter) {
      setViewport({
        ...viewport,
        latitude: clusterCenter.geometry.coordinates[1],
        longitude: clusterCenter.geometry.coordinates[0],
        zoom: cluster,
      })
    }
  }

  const handleResetView = () => {
    if (businesses.length === 0) return

    // Calculate bounds from all businesses
    let minLat = businesses[0].latitude
    let maxLat = businesses[0].latitude
    let minLon = businesses[0].longitude
    let maxLon = businesses[0].longitude

    businesses.forEach((business) => {
      minLat = Math.min(minLat, business.latitude)
      maxLat = Math.max(maxLat, business.latitude)
      minLon = Math.min(minLon, business.longitude)
      maxLon = Math.max(maxLon, business.longitude)
    })

    // Center map on bounds with padding
    const centerLat = (minLat + maxLat) / 2
    const centerLon = (minLon + maxLon) / 2
    const distance = Math.max(maxLat - minLat, maxLon - minLon)

    setViewport({
      latitude: centerLat,
      longitude: centerLon,
      zoom: Math.max(8, 12 - Math.log2(distance * 55)),
    })
  }

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
      <Map
        ref={mapRef}
        {...viewport}
        onMove={(evt) => handleViewportChange(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_CONSTANTS.MAP_STYLE_URL}
        minZoom={MAP_CONSTANTS.MIN_ZOOM}
        maxZoom={MAP_CONSTANTS.MAX_ZOOM}
      >
        {/* Render clusters and individual markers */}
        {clusters.map((item) => {
          const isCluster = 'properties' in item && item.properties.cluster === true
          const coords = item.geometry.coordinates as [number, number]

          if (isCluster) {
            const clusterItem = item as ClusterData
            return (
              <ClusterMarker
                key={`cluster-${clusterItem.properties.cluster_id}`}
                clusterId={clusterItem.properties.cluster_id}
                longitude={coords[0]}
                latitude={coords[1]}
                count={clusterItem.properties.point_count}
                onClick={() => handleClusterClick(clusterItem.properties.cluster_id)}
              />
            )
          } else {
            const pointItem = item as PointData
            return (
              <MapMarker
                key={`marker-${pointItem.id}`}
                business={pointItem.properties}
                isActive={selectedBusinessId === pointItem.id}
                onClick={() => onBusinessSelect?.(pointItem.id)}
                onHover={(id) => onBusinessHover?.(id)}
              />
            )
          }
        })}
      </Map>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleResetView}
          className="bg-white hover:bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-lg shadow-md transition border border-gray-200"
          title="Fit all businesses in view"
        >
          Reset View
        </button>
      </div>

      {/* Business Count Badge */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 z-10">
        <p className="text-sm font-medium text-gray-800">
          {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
        </p>
      </div>
    </div>
  )
}
