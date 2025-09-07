"use client"

interface AddEventScreenProps {
  onNext: () => void
}

function AddEventScreen({ onNext }: AddEventScreenProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Let&apos;s start by creating an event
          </h1>
          <p className="text-gray-600 mb-8">
            You need to create an event to add and manage hotels for that event
          </p>
          
          {/* Add New Event Button */}
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEventScreen
