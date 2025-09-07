"use client"

interface AboutEventScreenProps {
  userId: string
  onNext: () => void
  onBack: () => void
}

function AboutEventScreen({ userId, onNext, onBack }: AboutEventScreenProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">About Event Screen</h1>
        <p className="mb-4">UserId: {userId}</p>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Back
          </button>
          <button 
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AboutEventScreen
