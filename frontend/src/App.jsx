import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import Accountability from './pages/Accountability'
import ReportIssue from './pages/ReportIssue'
import Stats from './pages/Stats'
import About from './pages/About'
import AIDemo from './pages/AIDemo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="project/:id" element={<ProjectDetail />} />
        <Route path="accountability" element={<Accountability />} />
        <Route path="accountability/:entityId" element={<Accountability />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="stats" element={<Stats />} />
        <Route path="ai-demo" element={<AIDemo />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}
