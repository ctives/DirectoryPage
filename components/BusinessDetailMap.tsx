'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface BusinessDetailMapProps {
  latitude: number
  longitude: number
  businessName: string
}

function MapContent({ latitude, longitude, businessName }: BusinessDetailMapProps) {
  const map = useMap()

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15)
    }
  }, [latitude, longitude, map])

  const customIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2UwNzg1NiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LTggczMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4em0zLjUtOWMuODMgMCAxLjUtLjY3IDEuNS0xLjVTMTYuMzMgOCAxNS41IDggMTQgOC42NyAxNCA5LjVzLjY3IDEuNSAxLjUgMS41eiIvPjwvc3ZnPg==',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={customIcon}>
      </Marker>
    </>
  )
}

export default function BusinessDetailMap({ latitude, longitude, businessName }: BusinessDetailMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: '400px', width: '100%' }}
      minZoom={8}
      maxZoom={20}
    >
      <MapContent latitude={latitude} longitude={longitude} businessName={businessName} />
    </MapContainer>
  )
}
