"use client"

import React from "react"
import { Button } from "@/components/ui/button"

const MainPage: React.FC = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-5 text-3xl font-bold text-tertiary-500">Welcome to Our App</h1>
      <Button>Shadcn Button</Button>
    </div>
  )
}

export default MainPage
