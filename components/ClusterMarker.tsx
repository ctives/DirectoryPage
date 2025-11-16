'use client'

import { useState } from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { MARKER_ICONS, BRAND_COLORS } from '@/lib/map-constants'

interface ClusterMarkerProps {
  clusterId: number
  longitude: number
  latitude: number
  count: number
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const getSizeClass = (count: number): 'small' | 'medium' | 'large' => {
  if (count < 10) return 'small'
  if (count < 100) return 'medium'
  return 'large'
}

const getSizePixels = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small':
      return 45
    case 'medium':
      return 55
    case 'large':
      return 70
    default:
      return 55
  }
}

export default function ClusterMarker({
  longitude,
  latitude,
  count,
  size: sizeOverride,
  onClick,
}: ClusterMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const size = sizeOverride || getSizeClass(count)
  const sizePixels = getSizePixels(size)
  const clusterIcon = MARKER_ICONS.CLUSTER(count, BRAND_COLORS.PRIMARY_SAGE)

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick?.()
      }}
      style={{
        cursor: 'pointer',
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: `${sizePixels}px`,
          height: `${sizePixels}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
        dangerouslySetInnerHTML={{ __html: clusterIcon }}
      />
    </Marker>
  )
}
