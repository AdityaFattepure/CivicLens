import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, IndianRupee, Building2, HardHat, FileText, ArrowLeft, Clock, User, Users, Flame, ExternalLink, Newspaper, Route, Construction, Landmark, Wrench, Layers, Droplets, GitBranch, Bus, Factory, Pipette, Waves, Lightbulb } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import TruthCheck from '../components/TruthCheck'
import AccountabilityBreadcrumb from '../components/AccountabilityBreadcrumb'
import UpvoteButton from '../components/UpvoteButton'
import ProjectMap from '../components/ProjectMap'
import { projects, sampleAudits } from '../data/mockData'
import { formatINR, formatDate, timeAgo, PROJECT_TYPE_CONFIG } from '../utils/constants'

const iconMap = { Route, Construction, Landmark, Wrench, Layers, Droplets, GitBranch, Bus, Factory, Pipette, Waves, Lightbulb }

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const audits = sampleAudits[id] || []

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Project Not Found</h2>
        <Link to="/" className="btn-primary">Back to Map</Link>
      </div>
    )
  }

  const hasTruthCheck = project.ai_verdict != null
  const typeConfig = PROJECT_TYPE_CONFIG[project.project_type] || { icon: 'HardHat', color: 'text-gray-500', bg: 'bg-gray-50' }
  const TypeIcon = iconMap[typeConfig.icon] || HardHat

  const typeColors = {
    ministry: 'border-purple-200 bg-purple-50 text-purple-700',
    department: 'border-blue-200 bg-blue-50 text-blue-700',
    officer: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    contractor: 'border-amber-200 bg-amber-50 text-amber-700',
  }
  const typeLabels = { ministry: 'Ministry', department: 'Department', officer: 'Officer', contractor: 'Contractor' }

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-5 space-y-5 animate-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      {/* Header card */}
      <div className="card overflow-hidden">
        {project.image ? (
          <div className="relative h-48 lg:h-56 overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={project.official_status} size="sm" />
                {project.is_real_incident && (
                  <span className="badge bg-red-600 text-white text-[10px]">
                    <Flame className="w-2.5 h-2.5" /> Verified Incident
                  </span>
                )}
              </div>
              <h1 className="font-semibold text-lg lg:text-xl text-white leading-tight">{project.title}</h1>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                <TypeIcon className={`w-6 h-6 ${typeConfig.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={project.official_status} size="sm" />
                  {project.is_real_incident && (
                    <span className="badge bg-red-600 text-white text-[10px]">
                      <Flame className="w-2.5 h-2.5" /> Verified Incident
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 font-mono ml-auto">{project.tender_ref}</span>
                </div>
                <h1 className="font-semibold text-lg text-gray-900 leading-tight">{project.title}</h1>
              </div>
            </div>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Incident summary */}
          {project.incident_summary && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="w-3.5 h-3.5 text-red-600" />
                <span className="text-xs font-medium text-red-600">What Happened</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{project.incident_summary}</p>
              {project.news_source && (
                <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  {project.news_source}
                </p>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{project.location_name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-900 font-medium">{formatINR(project.budget)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Deadline: <span className="text-gray-900">{formatDate(project.deadline)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Started: <span className="text-gray-900">{formatDate(project.started)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{project.department}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <HardHat className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{project.contractor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Accountability */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Accountability Chain
            </h2>
            <p className="text-[11px] text-gray-400 mb-4">Ministry → Department → Officer → Contractor</p>
            <AccountabilityBreadcrumb chain={project.accountability_chain} />

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
              {project.accountability_chain.map((entity) => (
                <Link
                  key={entity.id}
                  to={`/accountability/${entity.id}`}
                  className={`p-3 rounded-lg border ${typeColors[entity.type]} hover:opacity-80 transition-opacity`}
                >
                  <p className="text-[9px] uppercase tracking-wider opacity-60">{typeLabels[entity.type]}</p>
                  <p className="text-[12px] font-medium text-gray-800 mt-1 truncate">{entity.name}</p>
                </Link>
              ))}
            </div>

            <Link
              to={`/accountability/${project.contractor_id || project.accountability_chain[project.accountability_chain.length - 1]?.id}`}
              className="mt-4 inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              View in Accountability Explorer →
            </Link>
          </div>

          {/* Truth Check */}
          {hasTruthCheck && (
            <div>
              <h2 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Truth Check
              </h2>
              <TruthCheck
                officialStatus={project.official_status}
                aiVerdict={project.ai_verdict}
                tenderData={{
                  budget: formatINR(project.budget),
                  deadline: formatDate(project.deadline),
                  contractor: project.contractor,
                }}
              />
            </div>
          )}

          {/* Citizen Audits */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-gray-900">
                Citizen Audits <span className="text-gray-400 font-normal">({project.audits_count})</span>
              </h2>
              <Link to={`/report?project=${id}`} className="btn-primary text-xs px-3 py-1.5">
                + Submit Evidence
              </Link>
            </div>

            {audits.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">No citizen audits yet</p>
                <p className="text-xs mt-1">Be the first to submit evidence</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {audits.map(audit => (
                    <div key={audit.id} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                    <UpvoteButton count={audit.upvotes} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-medium text-gray-700">{audit.user}</span>
                        <span className="text-[10px] text-gray-400">{timeAgo(audit.timestamp)}</span>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">{audit.ai_analysis}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className={`badge text-[10px] ${
                          audit.verdict.includes('Incomplete') || audit.verdict.includes('Failure') || audit.verdict.includes('Fraud') || audit.verdict.includes('Dangerous') || audit.verdict.includes('Non-Functional') || audit.verdict.includes('Critical') || audit.verdict.includes('Violation')
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {audit.verdict}
                        </span>
                        {audit.source && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <ExternalLink className="w-2.5 h-2.5" />
                            {audit.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="h-48 overflow-hidden">
              <ProjectMap
                projects={[project]}
                center={[project.lat, project.lng]}
                zoom={14}
                className="h-full"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-[11px] text-gray-400">{project.lat.toFixed(4)}°N, {project.lng.toFixed(4)}°E</p>
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</h3>
            {[
              ['Audits', project.audits_count],
              ['Upvotes', project.upvotes?.toLocaleString()],
              ['Type', project.project_type],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
            {project.is_real_incident && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <Flame className="w-3 h-3" />
                  Verified real incident
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
