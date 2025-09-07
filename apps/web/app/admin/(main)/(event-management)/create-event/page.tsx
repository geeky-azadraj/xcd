"use client"

import { useState } from "react"
import AddEventScreen from "@/components/admin/create-event/AddEventScreen"
import SelectEventScreen from "@/components/admin/create-event/SelectEventScreen"
import ConfigureEventScreen from "@/components/admin/create-event/ConfigureEventScreen"
import AboutEventScreen from "@/components/admin/create-event/AboutEventScreen"
import ContactDetailsScreen from "@/components/admin/create-event/ContactDetailsScreen"
import SetupCompleteScreen from "@/components/admin/create-event/SetupCompleteScreen"

export type CreateEventStep = 
  | 'add-event' 
  | 'select-event' 
  | 'configure' 
  | 'about-event' 
  | 'contact-details' 
  | 'setup-complete'

interface PageProps {
  params: Promise<{ userId: string }>
}

async function CreateEventPage({ params }: PageProps) {
  const { userId } = await params

  return <CreateEventContent userId={userId} />
}

function CreateEventContent({ userId }: { userId: string }) {
  const [currentStep, setCurrentStep] = useState<CreateEventStep>('add-event')

  const handleStepChange = (step: CreateEventStep) => {
    setCurrentStep(step)
  }

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'add-event':
        return <AddEventScreen onNext={() => handleStepChange('select-event')} />
      case 'select-event':
        return <SelectEventScreen userId={userId} onNext={() => handleStepChange('configure')} onBack={() => handleStepChange('add-event')} />
      case 'configure':
        return <ConfigureEventScreen userId={userId} onNext={() => handleStepChange('about-event')} onBack={() => handleStepChange('select-event')} />
      case 'about-event':
        return <AboutEventScreen userId={userId} onNext={() => handleStepChange('contact-details')} onBack={() => handleStepChange('configure')} />
      case 'contact-details':
        return <ContactDetailsScreen userId={userId} onNext={() => handleStepChange('setup-complete')} onBack={() => handleStepChange('about-event')} />
      case 'setup-complete':
        return <SetupCompleteScreen userId={userId} onBack={() => handleStepChange('contact-details')} />
      default:
        return <AddEventScreen onNext={() => handleStepChange('select-event')} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentScreen()}
    </div>
  )
}

export default CreateEventPage
