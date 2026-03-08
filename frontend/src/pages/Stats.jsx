import { Link } from 'react-router-dom'
import { BarChart3, TrendingUp, AlertTriangle, MapPin, Users, Flame } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { stats } from '../data/mockData'
import { formatINR } from '../utils/constants'

const statusColors = {
  'Completed': '#10b981',
  'In Progress': '#3b82f6',
  'Delayed': '#f59e0b',
  'Disputed': '#ef4444',
  'Not Started': '#71717a',
}

const pieData = Object.entries(stats.by_status).map(([name, value]) => ({
  name,
  value,
  color: statusColors[name],
}))

const deptData = stats.by_department.map(d => ({
  ...d,
  budget_cr: Math.round(d.budget / 10000000),
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-gray-900">{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-600 text-xs">{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function Stats() {
  return (
    <div className="max-w-[1100px] mx-auto px-5 py-6 space-y-6 animate-in">
      <div>
        <h1 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          Analytics
        </h1>
        <p className="text-gray-500 text-xs">Across all tracked infrastructure projects</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: MapPin, label: 'Projects', value: stats.total_projects, color: 'text-emerald-600' },
          { icon: TrendingUp, label: 'Audits', value: stats.total_audits, color: 'text-blue-600' },
          { icon: AlertTriangle, label: 'Disputed', value: stats.disputed_projects, color: 'text-red-600' },
          { icon: Users, label: 'Signals', value: stats.total_upvotes.toLocaleString(), color: 'text-purple-600' },
          { icon: MapPin, label: 'Cities', value: stats.cities_covered, color: 'text-amber-600' },
          { icon: Flame, label: 'Real Cases', value: stats.real_incidents || 0, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex flex-col gap-1">
            <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
            <span className="text-xl font-semibold text-gray-900">{s.value}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Status Distribution</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Bar */}
        <div className="card p-5">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Budget by Department (Cr)</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#374151', fontSize: 10 }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budget_cr" name="Budget (Cr)" fill="#10b981" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top disputed */}
      <div className="card p-5">
        <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Most Disputed Projects
        </h2>
        <div className="space-y-1.5">
          {stats.top_disputed.map((project, idx) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-300 w-6 text-right">#{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors truncate">{project.title}</p>
                  {project.is_real && (
                    <span className="badge bg-red-50 text-red-700 border border-red-200 text-[9px] flex-shrink-0">
                      <Flame className="w-2.5 h-2.5" /> Real
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">{project.audits} audits · {project.upvotes.toLocaleString()} upvotes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
