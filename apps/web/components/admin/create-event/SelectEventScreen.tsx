"use client"

import { useState } from "react"
import { SearchWithSuggestions } from "@/components/shared-layouts/SearchWithSuggestions"
import BackButton from "@/components/shared-layouts/BackButton"
import { ActionDialog } from "@/components/shared-layouts/ActionDialogBox"
import { ChevronRight } from "lucide-react"
import { mockEvents } from "@/app/admin/(main)/(event-management)/[userId]/my-events/data"

interface SelectEventScreenProps {
  onNext: () => void
  onBack: () => void
  userId: string
}

function SelectEventScreen({ onNext, onBack, userId }: SelectEventScreenProps) {
  const [searchValue, setSearchValue] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Filter events for the specific user
  const userEvents = mockEvents.filter(event => event.userId === userId)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleEventSelect = (eventName: string) => {
    setSearchValue(eventName)
    setSelectedEvent(eventName)
  }

  const handleClear = () => {
    setSearchValue("")
    setSelectedEvent(null)
  }

  const handleNext = async () => {
    if (selectedEvent) {
      // Show loading dialog
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Hide loading and show success
      setIsLoading(false)
      setShowSuccessDialog(true)
      
      // Auto-close success dialog and proceed after 1.5 seconds
      setTimeout(() => {
        setShowSuccessDialog(false)
        onNext()
      }, 1500)
    }
  }

  const handleBackClick = () => {
    if (selectedEvent || searchValue) {
      // Show exit confirmation if there are unsaved changes
      setShowExitDialog(true)
    } else {
      onBack()
    }
  }

  const handleExitConfirm = () => {
    setShowExitDialog(false)
    onBack()
  }

  const handleLoadingCancel = () => {
    setIsLoading(false)
    // Cancel any ongoing API request here
    // Do NOT show success dialog when cancelled
  }

  // Create suggestions array from user's event names
  const suggestions = userEvents.map(event => event.eventName)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button - separate at top with white background */}
      <div className="bg-white border-b border-gray-200 p-6 pb-4">
        <BackButton onClick={handleBackClick} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center px-6 py-8">
        {/* Breadcrumb - above the white container */}
        <div className="w-full max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">My Events</span>
            <ChevronRight className="w-4 h-4" />
            <span>Create Event</span>
          </div>
        </div>

        {/* White container with shadow - centered and limited width */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Select the event
          </h1>

          {/* Search Bar */}
          <div className="space-y-4">
            <SearchWithSuggestions
              placeholder="Search by event name"
              suggestions={suggestions}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              onSearchChange={handleSearchChange}
              onSuggestionClick={handleEventSelect}
              borderColor={selectedEvent ? "border-blue-200" : "border-gray-300"}
            />

            {/* Clear and Next buttons - shown when event is selected */}
            {selectedEvent && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Dialog */}
      <ActionDialog
        open={isLoading}
        onOpenChange={(_open) => {/* Prevent closing during loading */}}
        title="Fetching Event details"
        description="Please wait, this may take a few seconds"
        type="loading"
        onCancel={handleLoadingCancel}
      />

      {/* Exit Confirmation Dialog */}
      <ActionDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        title="Exit Page?"
        description="Are you sure you want to leave the event creation page? Please note that any unsaved changes will be lost."
        type="default"
        actionLabel="Yes, exit"
        closeLabel="Cancel"
        destructive={true}
        onAction={handleExitConfirm}
      />

      {/* Success Dialog */}
      <ActionDialog
        open={showSuccessDialog}
        onOpenChange={(_open) => {/* Auto-managed, no manual close */}}
        title="Details fetched"
        type="success"
      />
    </div>
  )
}

export default SelectEventScreen
