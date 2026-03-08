import { useParams } from 'react-router-dom'
import { Users, AlertTriangle, Building, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import AccountabilityTree from '../components/AccountabilityTree'
import ProjectCard from '../components/ProjectCard'
import { accountabilityTree, accountabilityMap, projects } from '../data/mockData'

export default function Accountability() {
  const { entityId } = useParams()
  const [search, setSearch] = useState('')

  const selectedEntity = entityId ? accountabilityMap[entityId] : null

  const entityProjects = useMemo(() => {
    if (!selectedEntity) return []
    return projects.filter(p => {
      return p.accountability_chain.some(e => e.id === entityId) ||
        p.officer_id === entityId ||
        p.contractor_id === entityId
    })
  }, [entityId, selectedEntity])

  const filterTree = (nodes, query) => {
    if (!query) return nodes
    return nodes
      .map(node => {
        const matchesSelf = node.name.toLowerCase().includes(query.toLowerCase()) ||
          (node.designation && node.designation.toLowerCase().includes(query.toLowerCase()))
        const filteredChildren = node.children ? filterTree(node.children, query) : []
        if (matchesSelf || filteredChildren.length > 0) {
          return { ...node, children: matchesSelf ? node.children : filteredChildren }
        }
        return null
      })
      .filter(Boolean)
  }

  const filteredTree = useMemo(() => filterTree(accountabilityTree, search), [search])

  const totalOfficers = Object.values(accountabilityMap).filter(e => e.type === 'officer').length
  const totalContractors = Object.values(accountabilityMap).filter(e => e.type === 'contractor').length
  const totalFlagged = Object.values(accountabilityMap)
    .filter(e => (e.flagged_projects || 0) > 0).length

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-6 animate-in">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          Accountability Explorer
        </h1>
        <p className="text-gray-500 text-xs max-w-xl">
          Navigate the chain of responsibility — from union ministries to the street-level contractor.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="card p-4 flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ministries</span>
          <span className="text-xl font-semibold text-gray-900">{accountabilityTree.length}</span>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Officers</span>
          <span className="text-xl font-semibold text-gray-900">{totalOfficers}</span>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Contractors</span>
          <span className="text-xl font-semibold text-gray-900">{totalContractors}</span>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5 text-red-400" /> Red Flags
          </span>
          <span className="text-xl font-semibold text-red-400">{totalFlagged}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tree */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="font-medium text-sm text-gray-800">Government Hierarchy</h2>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search officers, departments, contractors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>

          <AccountabilityTree data={filteredTree} selectedId={entityId} />
        </div>

        {/* Right panel */}
        <div className="card p-5">
          {selectedEntity ? (
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{selectedEntity.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{selectedEntity.designation}</p>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-800 capitalize">{selectedEntity.type}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total Projects</span>
                  <span className="text-gray-800">{selectedEntity.projects_count || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Flagged Projects</span>
                  <span className={selectedEntity.flagged_projects > 0 ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                    {selectedEntity.flagged_projects || 0}
                  </span>
                </div>
              </div>

              <h4 className="font-semibold text-xs text-gray-500 mb-2">Associated Projects</h4>
              <div className="space-y-2.5">
                {entityProjects.length > 0 ? (
                  entityProjects.map(p => <ProjectCard key={p.id} project={p} />)
                ) : (
                  <p className="text-[11px] text-gray-500">No projects found for this entity.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="font-medium text-xs">Select an entity</p>
              <p className="text-[11px] mt-1 text-gray-400">Click "View →" on any node to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
