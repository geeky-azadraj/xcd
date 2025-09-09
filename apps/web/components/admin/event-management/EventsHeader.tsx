"use client"

import { useState, useEffect } from "react"
import type { TabKey } from "@/components/admin/event-management/types"

interface EventsHeaderProps {
  userId: string
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  events?: any[] // Array of events from API
}

function EventsHeader({ userId, activeTab, onTabChange, events }: EventsHeaderProps) {
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 })

  // Calculate counts from real events data
  useEffect(() => {
    if (events && events.length > 0) {
      const allCount = events.length
      const activeCount = events.filter((event: any) => event.status === 'active').length
      const inactiveCount = events.filter((event: any) => event.status === 'inactive').length
      
      setCounts({
        all: allCount,
        active: activeCount,
        inactive: inactiveCount
      })
    }
  }, [events]) // Recalculate when events change

  const tabs = [
    { key: "all" as TabKey, label: "All Events", count: counts.all },
    { key: "active" as TabKey, label: "Active", count: counts.active },
    { key: "inactive" as TabKey, label: "Inactive", count: counts.inactive },
  ]

  const isActiveTab = (tabKey: TabKey) => activeTab === tabKey

  return (
    <div className="">
      {/** Tab Container */}
      <div className="mt-4 flex gap-6 text-gray-400">
        {tabs.map((tab) => {
          return (
            <div
              key={tab.key}
              className={`border-b-[3px] ${isActiveTab(tab.key) ? " border-blue-500" : "border-transparent"}`}
            >
              <button
                className={`px-1 pb-4 ${isActiveTab(tab.key) ? "text-black" : "text-gray-400"}`}
                onClick={() => onTabChange(tab.key)}
              > 
                {tab.label}
              </button>
              {isActiveTab(tab.key) && ( 
                <span className="ml-2 rounded-full bg-blue-100 px-2  py-1 text-xs text-blue-800">{tab.count}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EventsHeader;