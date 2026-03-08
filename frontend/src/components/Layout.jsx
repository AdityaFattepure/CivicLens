import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">CivicLens</span>
            <span className="text-gray-300">·</span>
            <span>The Truth Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="aws-badge">Powered by AWS AI</span>
            <span className="hidden md:inline text-gray-400">AWS AI for Bharat Hackathon 2025</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
