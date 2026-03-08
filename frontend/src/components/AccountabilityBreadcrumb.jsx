import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function AccountabilityBreadcrumb({ chain = [] }) {
  if (!chain || chain.length === 0) return null

  const typeColors = {
    ministry: 'text-purple-600',
    department: 'text-blue-600',
    officer: 'text-emerald-600',
    contractor: 'text-amber-600',
  }

  return (
    <div className="flex items-center gap-1 flex-wrap text-sm">
      {chain.map((entity, idx) => (
        <span key={entity.id} className="flex items-center gap-1">
          <Link
            to={`/accountability/${entity.id}`}
            className={`hover:underline font-medium ${typeColors[entity.type] || 'text-gray-500'}`}
          >
            {entity.name}
          </Link>
          {idx < chain.length - 1 && (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
        </span>
      ))}
    </div>
  )
}
