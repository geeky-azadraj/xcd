"use client"

import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

function BackButton({ onClick, label = "Go Back", className = "" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export default BackButton
