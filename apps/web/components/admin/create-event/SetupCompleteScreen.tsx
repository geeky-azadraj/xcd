"use client"

interface SetupCompleteScreenProps {
  userId: string
  onBack: () => void
}

function SetupCompleteScreen({ userId, onBack }: SetupCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Setup Complete Screen</h1>
        <p className="mb-4">UserId: {userId}</p>
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetupCompleteScreen
