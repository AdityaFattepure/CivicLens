import { Link, NavLink } from 'react-router-dom'
import { Map, Users, BarChart3, AlertCircle, Info, Shield, Brain } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Map', icon: Map },
  { to: '/accountability', label: 'Accountability', icon: Users },
  { to: '/stats', label: 'Statistics', icon: BarChart3 },
  { to: '/report', label: 'Report', icon: AlertCircle },
  { to: '/ai-demo', label: 'AI Demo', icon: Brain, highlight: true },
  { to: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white tracking-tight">CivicLens</span>
              <span className="hidden md:inline-flex aws-badge">AWS AI</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, highlight }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? highlight ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'bg-white/10 text-white'
                      : highlight ? 'text-blue-400/70 hover:text-blue-300 hover:bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
