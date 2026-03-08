import { STATUS_CONFIG } from '../utils/constants'
import { CheckCircle, Clock, AlertTriangle, XOctagon, Circle } from 'lucide-react'

const iconMap = { CheckCircle, Clock, AlertTriangle, XOctagon, Circle }

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Not Started']
  const Icon = iconMap[config.icon] || Circle
  
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 rounded',
    sm: 'text-[11px] px-2 py-1 gap-1 rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 rounded-md',
  }

  return (
    <span className={`badge ${config.bg} ${config.text} border ${config.border} ${sizeClasses[size]}`}>
      <Icon className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {config.label}
    </span>
  )
}
