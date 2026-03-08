import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Camera, MapPin, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { projects } from '../data/mockData'

export default function ReportIssue() {
  const [searchParams] = useSearchParams()
  const preselectedProject = searchParams.get('project')

  const [step, setStep] = useState(1)
  const [selectedProject, setSelectedProject] = useState(preselectedProject || '')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationError('')
      },
      () => {
        setLocationError('Unable to retrieve your location. Please enable GPS.')
      }
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 2000))
    setSubmitting(false)
    setStep(4)
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  return (
    <div className="max-w-xl mx-auto px-5 py-8 animate-in">
      <h1 className="font-semibold text-lg text-gray-900 mb-1 flex items-center gap-2">
        <Camera className="w-5 h-5 text-gray-400" />
        Report an Issue
      </h1>
      <p className="text-gray-500 text-xs mb-6">
        Submit geo-tagged photo evidence. Your identity stays anonymous — only "Verified Citizen" is shown.
      </p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? '✓' : s}
            </div>
            {s < 4 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Project */}
      {step === 1 && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-sm text-gray-900">Step 1: Select Project</h2>
          <p className="text-xs text-gray-500">Which government project are you reporting about?</p>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input"
          >
            <option value="">Select a project...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} — {p.location_name}
              </option>
            ))}
          </select>

          {selectedProjectData && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              <p className="font-medium text-gray-800">{selectedProjectData.title}</p>
              <p className="text-gray-500 mt-0.5">{selectedProjectData.location_name}</p>
              <p className="text-gray-500 mt-0.5">
                Official Status: <span className="text-gray-900">{selectedProjectData.official_status}</span>
              </p>
            </div>
          )}

          <button
            onClick={() => selectedProject && setStep(2)}
            disabled={!selectedProject}
            className="btn-primary w-full text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Upload Photo & Location */}
      {step === 2 && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-sm text-gray-900">Step 2: Capture Evidence</h2>
          <p className="text-xs text-gray-500">Upload a photo from the project site. GPS location will be verified.</p>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Your Location</label>
            {location ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                <MapPin className="w-3.5 h-3.5" />
                GPS Verified: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            ) : (
              <div>
                <button onClick={handleGetLocation} className="btn-secondary flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  Share My Location
                </button>
                {locationError && (
                  <p className="text-[11px] text-red-400 mt-1">{locationError}</p>
                )}
              </div>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Photo Evidence</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Click to upload or take a photo</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG up to 10MB</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 text-sm">← Back</button>
            <button
              onClick={() => location && image && setStep(3)}
              disabled={!location || !image}
              className="btn-primary flex-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-sm text-gray-900">Step 3: Review & Submit</h2>
          <p className="text-xs text-gray-500">Your submission will be analyzed by AI for automated verification.</p>

          <div className="space-y-2.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Project</span>
              <span className="text-gray-800">{selectedProjectData?.title}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Location</span>
              <span className="text-gray-800">{location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Photo</span>
              <span className="text-gray-800">{image?.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Identity</span>
              <span className="text-emerald-600 font-medium">Anonymous (Verified Citizen)</span>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Your photo will be analyzed by Amazon Rekognition to detect road conditions. Results are public.</span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary flex-1 text-sm">← Back</button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 text-sm">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...
                </span>
              ) : (
                'Submit Evidence ✓'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="card p-6 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="font-semibold text-lg text-gray-900">Evidence Submitted!</h2>
          <p className="text-xs text-gray-500">
            AI analysis detected: <span className="text-red-600 font-semibold">Road surface incomplete (93% confidence)</span>
          </p>
          <p className="text-[11px] text-gray-400">
            This evidence will be compared against official records. Discrepancies will flag the project.
          </p>
          <div className="flex gap-3 justify-center pt-3">
            <Link to={`/project/${selectedProject}`} className="btn-primary text-sm">View Project</Link>
            <Link to="/" className="btn-secondary text-sm">Back to Map</Link>
          </div>
        </div>
      )}
    </div>
  )
}
