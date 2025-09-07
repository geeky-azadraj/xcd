"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number // 0-100
  max?: number
  className?: string
  barClassName?: string
  showPercentage?: boolean
  label?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, barClassName, value = 0, max = 100, showPercentage = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div className="w-full">
        {(label || showPercentage) && (
          <div className="flex items-center justify-between mb-1">
            {label && <span className="text-xs text-gray-600">{label}</span>}
            {showPercentage && <span className="text-xs text-gray-600">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full bg-green-500 transition-all duration-300 ease-out",
              barClassName
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
