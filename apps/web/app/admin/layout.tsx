import React from "react"
import AdminHeader from "@/components/shared-layouts/AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>
    </div>
  )
}
