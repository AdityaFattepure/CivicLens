// Status constants
export const PROJECT_STATUS = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  DELAYED: 'Delayed',
  DISPUTED: 'Disputed',
  NOT_STARTED: 'Not Started',
}

export const STATUS_CONFIG = {
  [PROJECT_STATUS.COMPLETED]: {
    color: 'green',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    markerColor: '#10b981',
    label: 'Completed',
    icon: 'CheckCircle',
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    markerColor: '#3b82f6',
    label: 'In Progress',
    icon: 'Clock',
  },
  [PROJECT_STATUS.DELAYED]: {
    color: 'yellow',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    markerColor: '#f59e0b',
    label: 'Delayed',
    icon: 'AlertTriangle',
  },
  [PROJECT_STATUS.DISPUTED]: {
    color: 'red',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    markerColor: '#ef4444',
    label: 'Disputed',
    icon: 'XOctagon',
  },
  [PROJECT_STATUS.NOT_STARTED]: {
    color: 'slate',
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
    markerColor: '#64748b',
    label: 'Not Started',
    icon: 'Circle',
  },
}

// Indian cities for the demo
export const CITIES = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, zoom: 12 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: 'Chhatrapati Sambhaji Nagar', lat: 17.3850, lng: 78.4867, zoom: 12 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, zoom: 12 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, zoom: 13 },
  { name: 'Patna', lat: 25.6093, lng: 85.1376, zoom: 12 },
]

// Default map center (India)
export const MAP_CENTER = { lat: 22.5, lng: 78.9, zoom: 5 }

// Departments
export const DEPARTMENTS = [
  'Public Works Department (PWD)',
  'Municipal Corporation',
  'Water Supply & Sewerage',
  'Urban Development',
  'National Highways Authority',
  'Smart City Mission',
]

// Project type categories for icon fallbacks when no image
export const PROJECT_TYPE_CONFIG = {
  'Rail Over Bridge':    { icon: 'Construction',  color: 'text-orange-600', bg: 'bg-orange-50' },
  'Public Monument':     { icon: 'Landmark',    color: 'text-purple-600', bg: 'bg-purple-50' },
  'River Bridge':        { icon: 'Construction', color: 'text-blue-600',   bg: 'bg-blue-50' },
  'Road Widening':       { icon: 'Route',       color: 'text-gray-600',   bg: 'bg-gray-100' },
  'Expressway Construction': { icon: 'Route',   color: 'text-gray-600',   bg: 'bg-gray-100' },
  'Road Repair':         { icon: 'Wrench',      color: 'text-amber-600',  bg: 'bg-amber-50' },
  'Flyover Repair':      { icon: 'Layers',      color: 'text-gray-600',   bg: 'bg-gray-100' },
  'Drainage':            { icon: 'Droplets',    color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  'Coastal Road':        { icon: 'Route',       color: 'text-teal-600',   bg: 'bg-teal-50' },
  'Link Road':           { icon: 'GitBranch',   color: 'text-gray-600',   bg: 'bg-gray-100' },
  'BRT Corridor':        { icon: 'Bus',         color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Sewage Treatment':    { icon: 'Factory',     color: 'text-red-600',    bg: 'bg-red-50' },
  'Water Pipeline':      { icon: 'Pipette',     color: 'text-blue-600',   bg: 'bg-blue-50' },
  'Lake Rejuvenation':   { icon: 'Waves',       color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  'Lake Restoration':    { icon: 'Waves',       color: 'text-cyan-600',   bg: 'bg-cyan-50' },
  'Smart Lighting':      { icon: 'Lightbulb',   color: 'text-yellow-600', bg: 'bg-yellow-50' },
  'Expressway':          { icon: 'Route',       color: 'text-gray-600',   bg: 'bg-gray-100' },
}

// Format Indian currency
export function formatINR(amount) {
  if (!amount) return '₹0'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toLocaleString('en-IN')}`
}

// Format date
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Time ago
export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateStr)
}

// Haversine distance (km)
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
