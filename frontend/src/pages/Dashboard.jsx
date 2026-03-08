import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, AlertTriangle, ChevronDown, Flame, Eye, TrendingUp, Shield, Brain } from 'lucide-react'
import ProjectMap from '../components/ProjectMap'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/mockData'
import { CITIES, PROJECT_STATUS, STATUS_CONFIG, formatINR } from '../utils/constants'

const statusFilters = ['All', ...Object.values(PROJECT_STATUS)]

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedCity, setSelectedCity] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [mapZoom, setMapZoom] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location_name.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase()) ||
        p.contractor.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || p.official_status === statusFilter
      const matchesCity = !selectedCity || p.city === selectedCity
      return matchesSearch && matchesStatus && matchesCity
    })
  }, [search, statusFilter, selectedCity])

  const handleCitySelect = (city) => {
    if (selectedCity === city.name) {
      setSelectedCity(null)
      setMapCenter(null)
      setMapZoom(null)
    } else {
      setSelectedCity(city.name)
      setMapCenter([city.lat, city.lng])
      setMapZoom(city.zoom)
    }
  }

  const disputed = projects.filter(p => p.truth_check === 'mismatch').length
  const totalAudits = projects.reduce((sum, p) => sum + (p.audits_count || 0), 0)
  const realIncidents = projects.filter(p => p.is_real_incident)
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top bar with gradient accent */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="max-w-[1400px] mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-blue-600" />
              <span className="text-gray-900 font-medium">{filteredProjects.length}</span>
              <span className="text-gray-500">projects tracked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span className="text-red-600 font-medium">{disputed}</span>
              <span className="text-gray-500">disputed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-blue-500" />
              <span className="text-gray-900 font-medium">{totalAudits.toLocaleString()}</span>
              <span className="text-gray-500">citizen audits</span>
            </div>
            <span className="hidden md:flex items-center gap-1.5 text-gray-500">Budget: <span className="text-gray-900 font-medium">{formatINR(totalBudget)}</span></span>
          </div>

          {/* City tabs + AI Demo CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-0.5">
              {CITIES.map(city => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedCity === city.name
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            <Link to="/ai-demo" className="hidden lg:flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-700 transition-colors">
              <Brain className="w-3 h-3" />
              <span>AI Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real incidents strip */}
      {realIncidents.length > 0 && !search && statusFilter === 'All' && !selectedCity && (
        <div className="border-b border-gray-200 px-5 py-2.5 bg-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-3 h-3 text-red-500" />
              <span className="text-[11px] font-medium text-red-600 uppercase tracking-wider">Verified incidents</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {realIncidents.map(p => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="flex-shrink-0 card-hover p-2.5 pr-4 flex items-center gap-3 border-red-200"
                >
                  <div className="w-10 h-10 rounded-md bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{p.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{formatINR(p.budget)} · {p.audits_count} audits</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className="w-full lg:w-[380px] flex flex-col border-r border-gray-200 bg-white">
          {/* Search */}
          <div className="p-3 space-y-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, contractors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Filter className="w-3 h-3" />
              Filters
              <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="flex flex-wrap gap-1.5">
                {statusFilters.map(status => {
                  const config = STATUS_CONFIG[status]
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                        statusFilter === status
                          ? status === 'All'
                            ? 'bg-gray-100 text-gray-800 border-gray-300'
                            : `${config?.bg} ${config?.text} ${config?.border}`
                          : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {status === 'All' ? 'All' : config?.label || status}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MapPin className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No projects found</p>
                <p className="text-xs mt-1">Try adjusting your search</p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="hidden lg:block flex-1">
          <ProjectMap
            projects={filteredProjects}
            center={mapCenter}
            zoom={mapZoom}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
