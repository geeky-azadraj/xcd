import { redirect } from "next/navigation"

export default function AdminRootPage() {
  // TODO: Get userId from session/auth context
  // For now, using first mock user for testing
  const userId = "user-123"
  
  redirect(`/admin/${userId}/event-management`)
}
