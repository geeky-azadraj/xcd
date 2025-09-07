"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface SearchWithSuggestionsProps {
  placeholder?: string
  suggestions: string[]
  onSearchChange?: (value: string) => void
  onSuggestionClick?: (suggestion: string) => void
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  borderColor?: string
}

export function SearchWithSuggestions({
  placeholder = "Search the event name",
  suggestions = [],
  onSearchChange,
  onSuggestionClick,
  searchValue: externalSearchValue,
  onSearchValueChange,
  borderColor = "border-gray-300"
}: SearchWithSuggestionsProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [internalSearchValue, setInternalSearchValue] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Use external value if provided, otherwise use internal state
  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue
  const setSearchValue = onSearchValueChange || setInternalSearchValue

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    
    // Filter suggestions based on search value
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    )
    
    setShowSuggestions(value.trim().length > 0 && filtered.length > 0)
    
    // TODO: Implement debouncing here to avoid excessive API calls
    // Example with debounce:
    // clearTimeout(debounceTimer)
    // debounceTimer = setTimeout(() => {
    //     onSearchChange?.(value)
    // }, 300)
    
    // For now, call immediately
    onSearchChange?.(value)
  }

  // Filter suggestions based on search value
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion)
    setShowSuggestions(false)
    onSuggestionClick?.(suggestion)
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input Box */}
      <div className={`relative transition-[width] duration-200 ease-in-out ${isFocused ? "w-[350px]" : "w-[330px]"}`}>
        <input 
          type="text" 
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`w-full h-12 pl-12 pr-4 rounded-lg text-gray-700 bg-white placeholder:text-gray-500 shadow-lg shadow-gray-200 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 border ${borderColor}`}
          onFocus={() => {
            setIsFocused(true)
            if (searchValue.trim() && filteredSuggestions.length > 0) setShowSuggestions(true)
          }}
          onBlur={() => setIsFocused(false)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image src="/search-icon.svg" alt="search-icon" width={16} height={16} className="opacity-80"/>
        </span>
      </div>
      
      {/* Search Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-14 inset-x-0 bg-white rounded-lg shadow-lg shadow-gray-200 z-50 overflow-hidden">
          {filteredSuggestions.slice(0, 4).map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-200 ease-in-out ${
                searchValue.toLowerCase() === suggestion.toLowerCase() 
                  ? 'bg-blue-50' 
                  : 'hover:bg-blue-200'
              } ${index < filteredSuggestions.slice(0, 4).length - 1 ? 'border-b border-gray-100' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Image src="/search-icon.svg" alt="search-icon" width={14} height={14} className="opacity-100" />
              <span className="text-gray-700">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
