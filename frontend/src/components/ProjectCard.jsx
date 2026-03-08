import { Link } from 'react-router-dom'
import { MapPin, IndianRupee, ArrowUpRight, AlertTriangle, Flame, Route, Construction, Landmark, Wrench, Layers, Droplets, GitBranch, Bus, Factory, Pipette, Waves, Lightbulb, HardHat } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatINR, PROJECT_TYPE_CONFIG } from '../utils/constants'

const iconMap = { Route, Construction, Landmark, Wrench, Layers, Droplets, GitBranch, Bus, Factory, Pipette, Waves, Lightbulb }

function CategoryPlaceholder({ projectType }) {
  const config = PROJECT_TYPE_CONFIG[projectType] || { icon: 'HardHat', color: 'text-gray-500', bg: 'bg-gray-100' }
  const Icon = iconMap[config.icon] || HardHat
  return (
    <div className={`h-32 flex items-center justify-center ${config.bg} border-b border-gray-200`}>
      <Icon className={`w-8 h-8 ${config.color} opacity-60`} />
    </div>
  )
}

export default function ProjectCard({ project }) {
  const { id, title, location_name, budget, official_status, audits_count, upvotes, image, is_real_incident, truth_check, project_type } = project
  const isMismatch = truth_check === 'mismatch'

  return (
    <Link
      to={`/project/${id}`}
      className={`card-hover group overflow-hidden flex flex-col ${isMismatch ? 'border-red-200' : ''}`}
    >
      {/* Image or category placeholder */}
      {image ? (
        <div className="relative h-32 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
      ) : (
        <CategoryPlaceholder projectType={project_type} />
      )}

      {/* Badges overlay */}
      <div className="relative">
        <div className="absolute -top-6 left-3 right-3 flex items-center gap-1.5">
          {is_real_incident && (
            <span className="badge bg-red-600 text-white text-[10px]">
              <Flame className="w-2.5 h-2.5" /> Verified
            </span>
          )}
          {isMismatch && (
            <span className="badge bg-red-50 text-red-700 border border-red-200 text-[10px]">
              <AlertTriangle className="w-2.5 h-2.5" /> Disputed
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[13px] text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {title}
          </h3>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{location_name}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <StatusBadge status={official_status} size="xs" />
            <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
              <IndianRupee className="w-2.5 h-2.5" />
              {formatINR(budget)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>{audits_count || 0} audits</span>
            <span>·</span>
            <span>{upvotes || 0} ▲</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
