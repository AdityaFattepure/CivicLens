import { useState, useEffect, useCallback } from 'react'
import { Brain, FileText, Eye, MapPin, ArrowRight, CheckCircle, Loader2, Sparkles, Cpu, ImageIcon, AlertTriangle, ChevronRight, Play, RotateCcw, Database, Globe, Cloud, Shield, Zap } from 'lucide-react'

// Sample tender text for demo
const SAMPLE_TENDER = `GOVERNMENT OF INDIA
Ministry of Road Transport and Highways
National Highways Authority of India (NHAI)

TENDER NOTICE NO: NHAI/2024/NH-48/WD/0347

Subject: Construction of 4-Lane Elevated Corridor on NH-48
         Rajiv Gandhi Nagar to Hebbal Flyover, Bangalore

Estimated Cost: ₹847,00,00,000 (₹847 Crore)
Earnest Money Deposit: ₹4,23,50,000
Completion Period: 36 months from date of award

Contractor: Larsen & Toubro Infrastructure Ltd.
Supervising Officer: Er. Suresh Ramachandran, SE (NH)
Department: NHAI Regional Office, Bangalore

Location: NH-48 Corridor, Rajiv Gandhi Nagar Junction
to Hebbal Flyover, Bangalore North, Karnataka

Scope: Construction of elevated corridor including
6 ramps, 2 interchanges, drainage systems,
LED street lighting, and noise barriers.

Deadline: 15th March 2027`

// Simulated AI extraction result
const AI_RESULT = {
  project_title: 'NH-48 Elevated Corridor — Rajiv Gandhi Nagar to Hebbal',
  budget_inr: 84700000000,
  budget_display: '₹847 Cr',
  contractor: 'Larsen & Toubro Infrastructure Ltd.',
  officer: 'Er. Suresh Ramachandran, SE (NH)',
  department: 'NHAI Regional Office, Bangalore',
  location: 'NH-48, Rajiv Gandhi Nagar to Hebbal Flyover, Bangalore',
  coordinates: { lat: 13.0358, lng: 77.5970 },
  deadline: '2027-03-15',
  project_type: 'Expressway Construction',
  scope_items: ['6 ramps', '2 interchanges', 'drainage systems', 'LED street lighting', 'noise barriers'],
  confidence: 96.7,
}

// Photo analysis demo
const PHOTO_LABELS = [
  { name: 'Road', confidence: 98.2, category: 'positive' },
  { name: 'Pothole', confidence: 94.8, category: 'negative' },
  { name: 'Debris', confidence: 87.3, category: 'negative' },
  { name: 'Construction Equipment', confidence: 72.1, category: 'neutral' },
  { name: 'Vehicle', confidence: 99.1, category: 'neutral' },
  { name: 'Rubble', confidence: 81.5, category: 'negative' },
]

const PIPELINE_STEPS = [
  { id: 'upload', label: 'Document Upload', service: 'Amazon S3', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'ocr', label: 'OCR Extraction', service: 'Amazon Textract', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'ai', label: 'AI Analysis', service: 'Amazon Bedrock (Claude 3)', icon: Brain, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'geo', label: 'Geocoding', service: 'Amazon Location Service', icon: MapPin, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'store', label: 'Store & Index', service: 'Amazon DynamoDB', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
]

function TypewriterText({ text, speed = 15, onDone }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(timer)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return <span>{displayed}</span>
}

export default function AIDemo() {
  const [activeDemo, setActiveDemo] = useState('tender') // 'tender' | 'photo'
  const [tenderStep, setTenderStep] = useState(-1) // -1 = not started
  const [tenderRunning, setTenderRunning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [ocrLines, setOcrLines] = useState([])
  const [photoStep, setPhotoStep] = useState(-1)
  const [photoRunning, setPhotoRunning] = useState(false)
  const [photoLabels, setPhotoLabels] = useState([])
  const [photoVerdict, setPhotoVerdict] = useState(null)

  const runTenderDemo = useCallback(async () => {
    setTenderRunning(true)
    setShowResult(false)
    setOcrLines([])

    // Step 1: Upload
    setTenderStep(0)
    await delay(1200)

    // Step 2: OCR
    setTenderStep(1)
    const lines = SAMPLE_TENDER.split('\n').filter(l => l.trim())
    for (let i = 0; i < lines.length; i++) {
      await delay(80)
      setOcrLines(prev => [...prev, lines[i]])
    }
    await delay(600)

    // Step 3: AI Analysis
    setTenderStep(2)
    await delay(2500)

    // Step 4: Geocoding
    setTenderStep(3)
    await delay(1500)

    // Step 5: Store
    setTenderStep(4)
    await delay(800)

    setShowResult(true)
    setTenderRunning(false)
  }, [])

  const resetTenderDemo = () => {
    setTenderStep(-1)
    setTenderRunning(false)
    setShowResult(false)
    setOcrLines([])
  }

  const runPhotoDemo = useCallback(async () => {
    setPhotoRunning(true)
    setPhotoLabels([])
    setPhotoVerdict(null)

    // Step 1: Upload photo
    setPhotoStep(0)
    await delay(1000)

    // Step 2: Geofence check
    setPhotoStep(1)
    await delay(1200)

    // Step 3: Rekognition analysis
    setPhotoStep(2)
    for (let i = 0; i < PHOTO_LABELS.length; i++) {
      await delay(400)
      setPhotoLabels(prev => [...prev, PHOTO_LABELS[i]])
    }
    await delay(600)

    // Step 4: Truth comparison
    setPhotoStep(3)
    await delay(1500)
    setPhotoVerdict({
      official: 'Completed',
      detected: 'Incomplete — Potholes & Debris detected',
      match: false,
      confidence: 91.4,
    })

    setPhotoRunning(false)
  }, [])

  const resetPhotoDemo = () => {
    setPhotoStep(-1)
    setPhotoRunning(false)
    setPhotoLabels([])
    setPhotoVerdict(null)
  }

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-6 space-y-8 animate-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Live AI Pipeline Demo
        </div>
        <h1 className="font-semibold text-2xl text-gray-900">
          See <span className="text-gradient">AWS AI Services</span> in Action
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Watch how CivicLens uses Amazon Bedrock, Textract, Rekognition, and Location Service
          to automatically analyze government tenders and citizen evidence.
        </p>
      </div>

      {/* Demo Selector Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => { setActiveDemo('tender'); resetPhotoDemo() }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeDemo === 'tender'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Tender Analysis Pipeline
        </button>
        <button
          onClick={() => { setActiveDemo('photo'); resetTenderDemo() }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeDemo === 'photo'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Photo Verification Pipeline
        </button>
      </div>

      {/* ═══════════════ TENDER ANALYSIS DEMO ═══════════════ */}
      {activeDemo === 'tender' && (
        <div className="space-y-6">
          {/* Pipeline Steps */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-400" />
                Tender Ingestion Pipeline
              </h2>
              {tenderStep === -1 ? (
                <button onClick={runTenderDemo} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                  <Play className="w-3 h-3" /> Run Demo
                </button>
              ) : (
                <button onClick={resetTenderDemo} className="btn-ghost text-xs flex items-center gap-1.5" disabled={tenderRunning}>
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
              {PIPELINE_STEPS.map((step, idx) => {
                const isActive = tenderStep === idx
                const isDone = tenderStep > idx
                const isPending = tenderStep < idx
                return (
                  <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
                      isDone ? 'bg-emerald-50 border-emerald-200' :
                      isActive ? `${step.bg} ${step.border} shadow-md` :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isDone ? 'bg-emerald-600' : isActive ? step.bg : 'bg-gray-200'
                      }`}>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        ) : isActive ? (
                          <Loader2 className={`w-3.5 h-3.5 ${step.color} animate-spin`} />
                        ) : (
                          <step.icon className={`w-3.5 h-3.5 ${isPending ? 'text-gray-400' : step.color}`} />
                        )}
                      </div>
                      <div>
                        <p className={`text-[11px] font-medium ${isDone ? 'text-emerald-600' : isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[9px] text-gray-400">{step.service}</p>
                      </div>
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${tenderStep > idx ? 'text-emerald-500' : 'text-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Live output area */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Left: Input document */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Input: Government Tender PDF</p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-80 overflow-y-auto font-mono text-[11px] leading-relaxed">
                  {tenderStep >= 1 ? (
                    <div className="space-y-0.5">
                      {ocrLines.map((line, i) => (
                        <div key={i} className={`${
                          line.includes('₹') ? 'text-emerald-400' :
                          line.includes('Contractor') ? 'text-amber-400' :
                          line.includes('Location') || line.includes('NH-48') ? 'text-blue-400' :
                          line.includes('TENDER') || line.includes('GOVERNMENT') ? 'text-slate-200 font-semibold' :
                          'text-slate-400'
                        } animate-in`}>
                          {line}
                        </div>
                      ))}
                      {tenderStep === 1 && tenderRunning && (
                        <span className="cursor-blink text-slate-500">Scanning...</span>
                      )}
                    </div>
                  ) : tenderStep === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                        <p className="text-slate-400">Uploading to S3...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>Tender document will appear here</p>
                        <p className="text-[10px] mt-1">Click "Run Demo" to start</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: AI output */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Output: AI-Extracted Data</p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-80 overflow-y-auto">
                  {tenderStep >= 2 ? (
                    <div className="space-y-3">
                      {tenderStep === 2 && tenderRunning && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 text-xs">
                            <Brain className="w-3.5 h-3.5 animate-pulse" />
                            <span className="cursor-blink">Claude 3 Haiku analyzing document</span>
                          </div>
                          <div className="space-y-1.5">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      {(tenderStep > 2 || showResult) && (
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center gap-2 text-emerald-400 mb-3">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="font-medium">Extraction Complete — {AI_RESULT.confidence}% confidence</span>
                          </div>
                          {[
                            ['Project', AI_RESULT.project_title],
                            ['Budget', AI_RESULT.budget_display],
                            ['Contractor', AI_RESULT.contractor],
                            ['Officer', AI_RESULT.officer],
                            ['Department', AI_RESULT.department],
                            ['Location', AI_RESULT.location],
                            ['Deadline', AI_RESULT.deadline],
                            ['Type', AI_RESULT.project_type],
                          ].map(([label, value]) => (
                            <div key={label} className="flex gap-2">
                              <span className="text-slate-400 w-20 flex-shrink-0">{label}</span>
                              <span className={`text-slate-200 ${label === 'Budget' ? 'text-emerald-400 font-semibold' : ''}`}>{value}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-slate-700 mt-3">
                            <p className="text-slate-400 mb-1.5">Scope Items:</p>
                            {AI_RESULT.scope_items.map(item => (
                              <div key={item} className="flex items-center gap-1.5 text-slate-300 mb-1">
                                <ChevronRight className="w-3 h-3 text-emerald-600" />
                                {item}
                              </div>
                            ))}
                          </div>
                          {tenderStep >= 3 && (
                            <div className="pt-2 border-t border-slate-700 mt-2">
                              <div className="flex items-center gap-2 text-blue-400 mb-1">
                                <MapPin className="w-3 h-3" />
                                <span>Geocoded: {AI_RESULT.coordinates.lat}°N, {AI_RESULT.coordinates.lng}°E</span>
                              </div>
                            </div>
                          )}
                          {showResult && (
                            <div className="pt-2 border-t border-slate-700 mt-2">
                              <div className="flex items-center gap-2 text-cyan-400">
                                <Database className="w-3 h-3" />
                                <span>Saved to DynamoDB ✓ — Project ID: proj-nh48-blr-001</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>AI analysis output will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ PHOTO VERIFICATION DEMO ═══════════════ */}
      {activeDemo === 'photo' && (
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                Citizen Photo Verification Pipeline
              </h2>
              {photoStep === -1 ? (
                <button onClick={runPhotoDemo} className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                  <Play className="w-3 h-3" /> Run Demo
                </button>
              ) : (
                <button onClick={resetPhotoDemo} className="btn-ghost text-xs flex items-center gap-1.5" disabled={photoRunning}>
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Photo pipeline steps */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'upload', label: 'Photo Upload', service: 'Amazon S3', icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { id: 'geo', label: 'Geofence Check', service: 'Location Service (200m)', icon: MapPin, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { id: 'rekognition', label: 'Image Analysis', service: 'Amazon Rekognition', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { id: 'truth', label: 'Truth Comparison', service: 'CivicLens Engine', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
              ].map((step, idx) => {
                const isActive = photoStep === idx
                const isDone = photoStep > idx
                const isPending = photoStep < idx
                return (
                  <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${
                      isDone ? 'bg-emerald-50 border-emerald-200' :
                      isActive ? `${step.bg} ${step.border}` :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isDone ? 'bg-emerald-600' : isActive ? step.bg : 'bg-gray-200'
                      }`}>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        ) : isActive ? (
                          <Loader2 className={`w-3.5 h-3.5 ${step.color} animate-spin`} />
                        ) : (
                          <step.icon className={`w-3.5 h-3.5 ${isPending ? 'text-gray-400' : step.color}`} />
                        )}
                      </div>
                      <div>
                        <p className={`text-[11px] font-medium ${isDone ? 'text-emerald-600' : isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[9px] text-gray-400">{step.service}</p>
                      </div>
                    </div>
                    {idx < 3 && (
                      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${photoStep > idx ? 'text-emerald-500' : 'text-gray-300'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Left: Simulated photo */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Input: Citizen Photo</p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg h-72 flex items-center justify-center relative overflow-hidden">
                  {photoStep >= 0 ? (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-stone-700 to-slate-800 flex items-center justify-center relative">
                      {/* Simulated construction site */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/30 to-transparent" />
                        <div className="absolute top-4 left-4 w-16 h-16 rounded bg-orange-500/20" />
                        <div className="absolute top-8 right-8 w-24 h-8 rounded bg-slate-600/30" />
                        <div className="absolute bottom-12 left-1/3 w-4 h-4 rounded-full bg-red-500/40" />
                        <div className="absolute bottom-16 right-1/4 w-6 h-3 rounded bg-red-500/30" />
                      </div>
                      <div className="text-center relative z-10">
                        <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">Simulated construction site photo</p>
                        <p className="text-[10px] text-slate-500 mt-1">GPS: 13.0358°N, 77.5970°E</p>
                      </div>
                      {/* Rekognition bounding boxes */}
                      {photoStep >= 2 && photoLabels.length > 0 && (
                        <div className="absolute inset-0">
                          <div className="absolute top-6 left-6 w-20 h-14 border-2 border-red-500/60 rounded animate-in" />
                          <div className="absolute bottom-10 left-1/3 w-8 h-8 border-2 border-red-500/60 rounded-full animate-in" />
                          <div className="absolute bottom-14 right-1/4 w-12 h-8 border-2 border-amber-500/60 rounded animate-in" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Citizen photo will be simulated here</p>
                      <p className="text-[10px] mt-1">Click "Run Demo" to start</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Analysis output */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-medium">Output: AI Analysis</p>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 h-72 overflow-y-auto">
                  {photoStep >= 0 ? (
                    <div className="space-y-3 text-xs">
                      {/* Upload */}
                      {photoStep >= 0 && (
                        <div className="flex items-center gap-2 text-blue-400 animate-in">
                          <CheckCircle className="w-3 h-3" />
                          <span>Photo uploaded to S3 (2.4 MB)</span>
                        </div>
                      )}

                      {/* Geofence */}
                      {photoStep >= 1 && (
                        <div className="animate-in">
                          <div className="flex items-center gap-2 text-amber-400">
                            {photoStep === 1 && photoRunning ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span>Geofence: Citizen is <span className="text-emerald-400 font-medium">47m</span> from project site ✓</span>
                          </div>
                          <p className="text-slate-400 ml-5 mt-0.5">Within 200m radius — evidence valid</p>
                        </div>
                      )}

                      {/* Rekognition labels */}
                      {photoStep >= 2 && (
                        <div className="animate-in space-y-1.5">
                          <div className="flex items-center gap-2 text-purple-400 mb-2">
                            {photoStep === 2 && photoRunning ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span>Rekognition Labels Detected:</span>
                          </div>
                          {photoLabels.map(label => (
                            <div key={label.name} className="flex items-center justify-between p-1.5 rounded bg-slate-800 animate-in">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  label.category === 'negative' ? 'bg-red-400' :
                                  label.category === 'positive' ? 'bg-emerald-400' : 'bg-slate-500'
                                }`} />
                                <span className="text-slate-200">{label.name}</span>
                              </div>
                              <span className={`font-mono ${
                                label.category === 'negative' ? 'text-red-400' : 'text-slate-400'
                              }`}>{label.confidence}%</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Truth verdict */}
                      {photoVerdict && (
                        <div className="animate-in pt-3 border-t border-slate-700 space-y-2">
                          <div className="flex items-center gap-2 text-red-400 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Truth Check: MISMATCH DETECTED
                          </div>
                          <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 space-y-1.5">
                            <div className="flex gap-2">
                              <span className="text-slate-400 w-16">Official</span>
                              <span className="text-emerald-400">{photoVerdict.official}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-slate-400 w-16">Detected</span>
                              <span className="text-red-400">{photoVerdict.detected}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-slate-400 w-16">Confidence</span>
                              <span className="text-slate-200 font-mono">{photoVerdict.confidence}%</span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-[10px]">→ Project flagged as Disputed. Accountability chain notified.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <div className="text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>Analysis output will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ ARCHITECTURE OVERVIEW ═══════════════ */}
      <div className="card p-6 mesh-gradient">
        <h2 className="font-semibold text-lg text-gray-900 mb-1 text-center">Architecture</h2>
        <p className="text-xs text-gray-500 text-center mb-6">How CivicLens uses AWS AI services to create transparency at scale</p>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Data Ingestion */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Data Ingestion</p>
                <p className="text-[10px] text-gray-500">Automated tender processing</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] pl-10">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-blue-400" /> PDF uploaded to S3 bucket
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-purple-400" /> Amazon Textract extracts text
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Bedrock Claude 3 structures data
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-amber-400" /> Location Service geocodes address
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-cyan-400" /> DynamoDB stores with geohash index
              </div>
            </div>
          </div>

          {/* Citizen Verification */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Citizen Verification</p>
                <p className="text-[10px] text-gray-500">Photo-based truth checking</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] pl-10">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-blue-400" /> Geo-tagged photo to S3
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-amber-400" /> 200m geofence validation
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-purple-400" /> Rekognition detects conditions
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-red-400" /> AI vs Official status comparison
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Auto-flag discrepancies
              </div>
            </div>
          </div>

          {/* Why AI is Required */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Why AI is Essential</p>
                <p className="text-[10px] text-gray-500">Problems AI uniquely solves</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] pl-10">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Tenders are unstructured PDFs
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Manual analysis takes 30+ days (RTI)
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Photo verification needs CV
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Scale: 1000s of tenders per day
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 rounded-full bg-emerald-400" /> Accountability mapping needs NLP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AWS Services Used */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 animate-stagger">
        {[
          { name: 'Amazon Bedrock', desc: 'Claude 3 Haiku', icon: Brain, color: 'text-emerald-400' },
          { name: 'Amazon Textract', desc: 'Document OCR', icon: FileText, color: 'text-purple-400' },
          { name: 'Amazon Rekognition', desc: 'Image Analysis', icon: Eye, color: 'text-blue-400' },
          { name: 'Location Service', desc: 'Geocoding', icon: Globe, color: 'text-amber-400' },
          { name: 'DynamoDB', desc: 'NoSQL Database', icon: Database, color: 'text-cyan-400' },
          { name: 'Lambda + API GW', desc: 'Serverless API', icon: Cloud, color: 'text-gray-500' },
        ].map(svc => (
          <div key={svc.name} className="card p-3 flex flex-col items-center text-center gap-1.5">
            <svc.icon className={`w-5 h-5 ${svc.color}`} />
            <p className="text-[11px] font-medium text-gray-800">{svc.name}</p>
            <p className="text-[9px] text-gray-500">{svc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
