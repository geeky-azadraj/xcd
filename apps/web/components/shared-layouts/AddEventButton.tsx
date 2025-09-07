"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddButtonProps {
  text: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  disabled?: boolean
}

export function AddButton({ 
  text, 
  onClick, 
  icon, 
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false 
}: AddButtonProps) {
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    default: "h-12 px-6 text-lg",
    lg: "h-14 px-8 text-xl"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-7 w-7"
  }

  const baseClasses = "flex items-center gap-2 font-thin transition-all duration-200 ease-in-out"
  
  const variantClasses = {
    default: "bg-[#007BFF] hover:bg-blue-700 text-white",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50"
  }

  return (
    <Button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon || <Plus className={iconSizes[size]} />}
      <span>{text}</span>
    </Button>
  )
}
