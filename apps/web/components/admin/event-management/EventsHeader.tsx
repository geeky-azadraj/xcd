"use client"

import { useState, useEffect } from "react"
import { mockEvents } from "@/app/admin/(event-management)/[userId]/my-events/data"
import { TabKey } from "@/app/admin/(event-management)/[userId]/my-events/page"

interface EventsHeaderProps {
  userId: string
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

function EventsHeader({ userId, activeTab, onTabChange }: EventsHeaderProps) {
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 })

  // For now, using static counts from initial mock data
  // TODO: When integrating with API, pass actual event counts as props from parent
  // The parent component will get these counts from the API response
  // Example: const { data, totalCount, activeCount, inactiveCount } = useGetEvents({ userId })
  
  useEffect(() => {
    // Calculate counts from mock data filtered by userId
    const userEvents = mockEvents.filter(event => event.userId === userId)
    const allCount = userEvents.length
    const activeCount = userEvents.filter(event => event.status === 'ACTIVE').length
    const inactiveCount = userEvents.filter(event => event.status === 'INACTIVE').length
    
    setCounts({
      all: allCount,
      active: activeCount,
      inactive: inactiveCount
    })
  }, [userId]) // Recalculate when userId changes

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

