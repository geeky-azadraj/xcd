"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import EventsBody from "@/components/admin/event-management/EventsBody"
import EventsHeader from "@/components/admin/event-management/EventsHeader"
import { TabKey } from "./page"

interface MyEventsContentProps {
  userId: string
  initialActiveTab: TabKey
}

function MyEventsContent({ userId, initialActiveTab }: MyEventsContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialActiveTab)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(initialActiveTab)
  }, [initialActiveTab])

  const handleTabChange = (newTab: TabKey) => {
    setActiveTab(newTab)
    
    // Update URL with new status parameter
    const params = new URLSearchParams(searchParams.toString())
    
    if (newTab === 'all') {
      params.delete('status')
    } else {
      params.set('status', newTab)
    }
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl)
  }

  return (
    <div>
      <div className="mt-[24px] border-b border-gray-200">
        <div className="ml-[150px] bg-white">
          <div>
            <h1 className="text-2xl font-semibold">My Events</h1>
            
          </div>
          <div>
            <EventsHeader 
              userId={userId}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>

      {/** The table data will come here */}

      <div className="bg-gray-50 min-h-screen">
        <EventsBody userId={userId} activeTab={activeTab} />
      </div>
    </div>
  )
}

export default MyEventsContent
