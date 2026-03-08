import { ShieldCheck, ShieldAlert, ShieldQuestion, Eye, FileText } from 'lucide-react'

const verdictConfig = {
  match: {
    icon: ShieldCheck,
    title: 'VERIFIED — Status Matches',
    subtitle: 'Ground reality aligns with official records',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-200',
  },
  mismatch: {
    icon: ShieldAlert,
    title: 'DISPUTED — Discrepancy Detected',
    subtitle: 'Ground reality contradicts official records',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    ring: 'ring-red-200',
  },
  inconclusive: {
    icon: ShieldQuestion,
    title: 'INCONCLUSIVE — Needs More Evidence',
    subtitle: 'Unable to determine with current data',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-200',
  },
}

export default function TruthCheck({ officialStatus, aiVerdict, auditImageUrl, tenderData }) {
  let verdict = 'inconclusive'
  if (officialStatus === 'Completed' && aiVerdict === 'Incomplete') verdict = 'mismatch'
  else if (officialStatus === 'Completed' && aiVerdict === 'Complete') verdict = 'match'
  else if (officialStatus === 'In Progress' && aiVerdict === 'Incomplete') verdict = 'match'
  else if (officialStatus === 'In Progress' && aiVerdict === 'Complete') verdict = 'match'
  else if (aiVerdict) verdict = aiVerdict === 'Complete' ? 'match' : 'mismatch'

  const config = verdictConfig[verdict]
  const Icon = config.icon

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} p-5`}>
      {/* Verdict Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <Icon className={`w-6 h-6 ${config.color}`} />
        <div>
          <h3 className={`font-semibold text-sm ${config.color}`}>{config.title}</h3>
          <p className="text-xs text-gray-500">{config.subtitle}</p>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: What government says */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-sm text-blue-600">THE PROMISE</h4>
          </div>
          <p className="text-xs text-gray-500 mb-2">What official tender records say</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Official Status</span>
              <span className="font-medium text-gray-800">{officialStatus || 'N/A'}</span>
            </div>
            {tenderData?.budget && (
              <div className="flex justify-between">
                <span className="text-gray-500">Budget</span>
                <span className="font-medium text-gray-800">{tenderData.budget}</span>
              </div>
            )}
            {tenderData?.deadline && (
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline</span>
                <span className="font-medium text-gray-800">{tenderData.deadline}</span>
              </div>
            )}
            {tenderData?.contractor && (
              <div className="flex justify-between">
                <span className="text-gray-500">Contractor</span>
                <span className="font-medium text-gray-800">{tenderData.contractor}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: What the ground shows */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-amber-500" />
            <h4 className="font-semibold text-sm text-amber-600">THE REALITY</h4>
          </div>
          <p className="text-xs text-gray-500 mb-2">What citizen evidence reveals</p>
          {auditImageUrl && (
            <img
              src={auditImageUrl}
              alt="Citizen audit evidence"
              className="w-full h-32 object-cover rounded-lg mb-3 border border-gray-200"
            />
          )}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">AI Verdict</span>
              <span className={`font-medium ${
                aiVerdict === 'Complete' ? 'text-emerald-600' :
                aiVerdict === 'Incomplete' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {aiVerdict || 'No evidence yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
