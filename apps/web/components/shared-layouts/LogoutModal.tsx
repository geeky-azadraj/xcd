"use client"

import React from "react"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Button } from "../ui/button"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

function LogoutModal({ isOpen, onClose, onConfirm, isLoading }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Black Backdrop - Click to close */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {!isLoading ? (
          // Confirmation Screen
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="px-6 bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, logout
              </Button>
            </div>
          </>
        ) : (
          // Loading Screen
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Logging out</h2>
            
            {/* Spinner */}
            <div className="flex justify-center mb-8">
              <LoadingSpinner />
            </div>
            
            {/* Cancel button */}
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogoutModal