import { Link } from 'react-router-dom'
import {
  Shield, Eye, ShieldAlert, Users, ArrowRight, CheckCircle, Zap,
  FileText, Camera, Map, BarChart3, Brain, Globe, Lock, Cloud, Database,
  Cpu, Sparkles, Server, GitBranch
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'AI Tender Analysis',
    desc: 'Amazon Textract + Bedrock (Claude 3) extracts Budget, Deadline, Contractor, and Location from government tender PDFs automatically.',
    color: 'text-blue-600 bg-blue-50',
    service: 'Bedrock + Textract',
  },
  {
    icon: Eye,
    title: 'Truth Check Engine',
    desc: 'Compares official project status against AI-analyzed citizen photos. Flags discrepancies in real-time.',
    color: 'text-red-600 bg-red-50',
    service: 'Rekognition',
  },
  {
    icon: Users,
    title: 'Accountability Chain',
    desc: 'Maps the full hierarchy from Ministry → Department → Officer → Contractor. Shows who is actually responsible.',
    color: 'text-purple-600 bg-purple-50',
    service: 'DynamoDB',
  },
  {
    icon: Camera,
    title: 'Citizen Auditing',
    desc: 'Geo-tagged photo evidence analyzed by Amazon Rekognition for potholes, debris, and construction status.',
    color: 'text-amber-600 bg-amber-50',
    service: 'S3 + Rekognition',
  },
  {
    icon: Map,
    title: 'Interactive Map',
    desc: 'Every government project plotted on a live map. Color-coded by status. Zoom into your neighborhood.',
    color: 'text-emerald-600 bg-emerald-50',
    service: 'Location Service',
  },
  {
    icon: Zap,
    title: 'Signal-Based Priority',
    desc: 'No comments, no noise. Citizens upvote issues — the most critical problems rise to the top.',
    color: 'text-amber-600 bg-amber-50',
    service: 'Lambda + DynamoDB',
  },
]

const awsServices = [
  { name: 'Amazon Bedrock', desc: 'Claude 3 Haiku for structured extraction from tender documents', icon: Brain, color: 'text-emerald-600', bg: 'bg-emerald-50', role: 'Generative AI' },
  { name: 'Amazon Textract', desc: 'OCR for scanned government PDFs — converts images to machine-readable text', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', role: 'Document AI' },
  { name: 'Amazon Rekognition', desc: 'Computer vision for detecting road conditions from citizen photos', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', role: 'Vision AI' },
  { name: 'Amazon Location Service', desc: 'Geocoding addresses → coordinates and 200m geofence validation', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50', role: 'Geospatial' },
  { name: 'AWS Lambda', desc: '6 Python 3.12 functions (ARM64) — serverless compute for all API logic', icon: Server, color: 'text-orange-600', bg: 'bg-orange-50', role: 'Compute' },
  { name: 'Amazon API Gateway', desc: 'REST API with CORS — connects frontend to all Lambda functions', icon: GitBranch, color: 'text-cyan-600', bg: 'bg-cyan-50', role: 'API Layer' },
  { name: 'Amazon DynamoDB', desc: 'Two tables with GSIs — PAY_PER_REQUEST for cost-efficient scaling', icon: Database, color: 'text-teal-600', bg: 'bg-teal-50', role: 'Database' },
  { name: 'Amazon S3', desc: 'Two buckets — tender PDFs (trigger Lambda) and citizen photos (CORS enabled)', icon: Cloud, color: 'text-gray-600', bg: 'bg-gray-50', role: 'Storage' },
]

export default function About() {
  return (
    <div className="max-w-[1000px] mx-auto px-5 py-10 space-y-14 animate-in">
      {/* Hero */}
      <div className="text-center space-y-5 mesh-gradient rounded-2xl py-12 px-6 -mx-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium tracking-wide">
          <Shield className="w-3.5 h-3.5" />
          AWS AI for Bharat Hackathon 2025
        </div>
        <h1 className="font-semibold text-3xl lg:text-4xl text-gray-900 leading-tight">
          CivicLens<br />
          <span className="text-gradient">The Truth Engine</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          We blame the PM or CM for every pothole and broken pipe. But there are{' '}
          <span className="text-gray-900 font-semibold">hundreds of departments, officers, and contractors</span>{' '}
          responsible. The government releases data, but no one can read it all. CivicLens takes off the blindfold.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary flex items-center gap-2 text-sm">
            Explore the Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/ai-demo" className="btn-secondary flex items-center gap-2 text-sm">
            <Brain className="w-3.5 h-3.5" /> See AI in Action
          </Link>
        </div>
      </div>

      {/* The Problem */}
      <div className="card p-6 text-center glow-red">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h2 className="font-semibold text-lg text-gray-900 mb-2">The Visibility Void</h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
          India spends <span className="text-gray-900 font-semibold">₹15+ Lakh Crore</span> annually on infrastructure. Citizens see dug-up roads,
          waterlogged streets, and stalled bridges — but have <span className="text-red-600 font-semibold">zero visibility</span> into
          official deadlines, budgets, or who’s accountable. Filing an RTI takes 30 days. CivicLens gives you the answer in{' '}
          <span className="text-emerald-600 font-semibold">3 seconds</span>.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto">
          <div>
            <p className="text-2xl font-semibold text-red-600">30 days</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">RTI Response</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-300">→</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-600">3 sec</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">CivicLens</p>
          </div>
        </div>
      </div>

      {/* Why AI is Required */}
      <div className="card p-6 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-gray-900">Why AI is Essential</h2>
            <p className="text-[11px] text-gray-400">Problems that can only be solved with AI</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { problem: 'Government tenders are unstructured scanned PDFs', solution: 'Textract OCR + Bedrock Claude 3 extracts structured data in seconds' },
            { problem: 'Manual RTI takes 30+ days for a single project', solution: 'AI processes thousands of tenders automatically on upload' },
            { problem: 'No way to verify if a road is actually repaired', solution: 'Rekognition detects potholes, debris, and road conditions from photos' },
            { problem: 'Citizens don\'t know who is responsible', solution: 'NLP-extracted accountability chain maps Ministry → Contractor' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-red-600 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3 h-3" /> {item.problem}
              </p>
              <p className="text-xs text-emerald-600 flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" /> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="font-semibold text-lg text-gray-900 mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {features.map(f => (
            <div key={f.title} className="card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-4 h-4" />
                </div>
                <span className="aws-badge">{f.service}</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AWS Services - Detailed */}
      <div>
        <h2 className="font-semibold text-lg text-gray-900 mb-1 text-center">Powered by AWS</h2>
        <p className="text-xs text-gray-400 text-center mb-6">8 AWS services purpose-built for India-scale civic transparency</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {awsServices.map(t => (
            <div key={t.name} className="card p-3.5 flex items-start gap-3 group hover:border-gray-300 transition-colors">
              <div className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center flex-shrink-0`}>
                <t.icon className={`w-4 h-4 ${t.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-xs text-gray-800">{t.name}</p>
                  <span className="text-[9px] text-gray-500 px-1.5 py-0.5 rounded bg-gray-100 font-mono">{t.role}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3 pb-6">
        <h2 className="font-semibold text-lg text-gray-900">See the truth. Hold power accountable.</h2>
        <p className="text-sm text-gray-500">Every citizen is an auditor. Every photo is evidence. Every vote is a signal.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-sm">
            Start Exploring <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/ai-demo" className="btn-secondary inline-flex items-center gap-2 text-sm">
            <Cpu className="w-3.5 h-3.5" /> Watch AI Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
