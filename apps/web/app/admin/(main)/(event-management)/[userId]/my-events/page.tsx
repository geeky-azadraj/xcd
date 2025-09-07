import { Suspense } from "react"
import MyEventsContent from "./MyEventsContent"

export type TabKey = "all" | "active" | "inactive"

interface PageProps {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ status?: string }>
}

async function MyEventsPage({ params, searchParams }: PageProps) {
  const { userId } = await params
  const { status } = await searchParams
  
  // Convert status to TabKey, default to 'all'
  const activeTab: TabKey = (status === 'active' || status === 'inactive') ? status : 'all'

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyEventsContent userId={userId} initialActiveTab={activeTab} />
    </Suspense>
  )
}

export default MyEventsPage
