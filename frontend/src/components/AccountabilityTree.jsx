import { useState } from 'react'
import { ChevronRight, ChevronDown, User, Building, Landmark, HardHat, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const typeIcons = {
  ministry: Landmark,
  department: Building,
  officer: User,
  contractor: HardHat,
}

const typeColors = {
  ministry: 'text-purple-600 bg-purple-50 border-purple-200',
  department: 'text-blue-600 bg-blue-50 border-blue-200',
  officer: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  contractor: 'text-amber-600 bg-amber-50 border-amber-200',
}

function containsId(node, id) {
  if (!id) return false
  if (node.id === id) return true
  return node.children?.some(c => containsId(c, id)) || false
}

function TreeNode({ node, depth = 0, expandedByDefault = true, selectedId }) {
  // When a selectedId is present, ONLY expand the branch leading to it; collapse everything else
  const isOnSelectedPath = selectedId ? containsId(node, selectedId) : false
  const shouldAutoExpand = selectedId ? isOnSelectedPath : (depth < 2 || expandedByDefault)
  const [expanded, setExpanded] = useState(shouldAutoExpand)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = node.id === selectedId
  const Icon = typeIcons[node.type] || User
  const colorClass = typeColors[node.type] || typeColors.officer

  return (
    <div className={depth > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}>
      <div
        className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors cursor-pointer group ${isSelected ? 'bg-blue-50 ring-2 ring-blue-400' : 'hover:bg-gray-50'}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand toggle */}
        <div className="w-5 flex-shrink-0">
          {hasChildren && (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          )}
        </div>

        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 truncate">{node.name}</span>
            {node.flagged_projects > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                <AlertTriangle className="w-2.5 h-2.5" />
                {node.flagged_projects}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {node.designation || node.type.charAt(0).toUpperCase() + node.type.slice(1)}
            {node.projects_count != null && (
              <span className="ml-2 text-gray-400">· {node.projects_count} projects</span>
            )}
          </div>
        </div>

        {/* Link to filter */}
        <Link
          to={`/accountability/${node.id}`}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-500 transition-all"
        >
          View →
        </Link>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AccountabilityTree({ data, selectedId }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Building className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>No accountability data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-2" key={selectedId || 'all'}>
      {data.map((root) => (
        <TreeNode key={root.id} node={root} selectedId={selectedId} />
      ))}
    </div>
  )
}
