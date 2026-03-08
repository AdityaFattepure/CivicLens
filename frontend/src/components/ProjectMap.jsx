import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { STATUS_CONFIG, formatINR, MAP_CENTER } from '../utils/constants'

// Custom colored marker icons
function createMarkerIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px; height: 28px; 
      background: ${color}; 
      border: 3px solid rgba(255,255,255,0.9);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    "><div style="
      width: 10px; height: 10px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    "></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })
}

const markerIcons = {}
function getMarkerIcon(status) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Not Started']
  if (!markerIcons[status]) {
    markerIcons[status] = createMarkerIcon(config.markerColor)
  }
  return markerIcons[status]
}

// Component to fly to location
function FlyTo({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

export default function ProjectMap({ projects = [], center, zoom, onMapMove, className = '' }) {
  const [flyTarget, setFlyTarget] = useState(center || [MAP_CENTER.lat, MAP_CENTER.lng])
  const [flyZoom, setFlyZoom] = useState(zoom || MAP_CENTER.zoom)

  useEffect(() => {
    if (center) {
      setFlyTarget(center)
      setFlyZoom(zoom || 13)
    }
  }, [center, zoom])

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={flyTarget}
        zoom={flyZoom}
        className="h-full w-full rounded-2xl"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FlyTo center={flyTarget} zoom={flyZoom} />

        {projects.map((project) => (
          <Marker
            key={project.id}
            position={[project.lat, project.lng]}
            icon={getMarkerIcon(project.official_status)}
          >
            <Popup>
              <div className="min-w-[220px]">
                <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{project.location_name}</p>
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={project.official_status} size="xs" />
                  <span className="text-xs text-gray-500">{formatINR(project.budget)}</span>
                </div>
                <Link
                  to={`/project/${project.id}`}
                  className="block text-center text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg transition-colors font-medium"
                >
                  View Details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
