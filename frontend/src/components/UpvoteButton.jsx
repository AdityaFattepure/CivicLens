import { useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function UpvoteButton({ count = 0, onUpvote, disabled = false }) {
  const [voted, setVoted] = useState(false)
  const [localCount, setLocalCount] = useState(count)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (voted || disabled) return
    setVoted(true)
    setLocalCount(prev => prev + 1)
    onUpvote?.()
  }

  return (
    <button
      onClick={handleClick}
      disabled={voted || disabled}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all duration-200 ${
        voted
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      <ChevronUp className={`w-4 h-4 ${voted ? 'text-emerald-400' : ''}`} />
      <span className="text-xs font-bold">{localCount}</span>
    </button>
  )
}
