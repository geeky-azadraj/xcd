"use client"

import { useState } from "react"
import BackButton from "@/components/shared-layouts/BackButton"
import { ChevronRight, ArrowRight } from "lucide-react"

interface ConfigureEventScreenProps {
  userId: string
  onNext: () => void
  onBack: () => void
}

function ConfigureEventScreen({ userId: _userId, onNext, onBack }: ConfigureEventScreenProps) {
  const [selectedStep, setSelectedStep] = useState("about-event")
  
  // Mock selected event name (this would come from previous screen)
  const selectedEventName = "TedX Conference"

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button Area */}
      <div className="bg-white border-b border-gray-200 p-6 pb-4">
        <BackButton onClick={onBack} />
      </div>

      {/* Breadcrumb Area */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-bold">My Events</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-bold">Create Event</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-bold text-black">{selectedEventName}</span>
        </div>
        <h1 className="text-2xl font-bold text-black mt-2">{selectedEventName}</h1>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-100 border-r border-gray-200">
          <div className="p-6">
            {/* Radio Button Options */}
            <div className="space-y-0">
              {/* About Event - Selected */}
              <div 
                className="flex items-center gap-3 py-4 cursor-pointer"
                onClick={() => setSelectedStep("about-event")}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-black">
                  {selectedStep === "about-event" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  )}
                </div>
                <span className={`font-bold text-black`}>
                  About Event
                </span>
              </div>

              {/* Gray line separator */}
              <div className="border-t border-gray-300"></div>

              {/* Primary Support Contact - Unselected */}
              <div 
                className="flex items-center gap-3 py-4 cursor-pointer"
                onClick={() => setSelectedStep("support-contact")}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400">
                  {selectedStep === "support-contact" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  )}
                </div>
                <span className="text-gray-500">
                  Primary Support Contact
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 w-80 bg-white border-t border-gray-200 p-6">
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {selectedStep === "about-event" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">About Event</h2>
                <p className="text-gray-600">Configure your event details here...</p>
              </div>
            )}
            
            {selectedStep === "support-contact" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Primary Support Contact</h2>
                <p className="text-gray-600">Set up your support contact information...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigureEventScreen
