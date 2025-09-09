import { MockEventData } from "@/app/admin/(event-management)/[userId]/my-events/data"
import Image from "next/image"
import EventStatusBadge from "./EventsStatusBadge";
import EventCardMenu from "./EventCardMenu"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
// import { ProgressBar } from "@/components/ui/progress-bar" // Uncomment when API integration is ready

interface EventCardProps {
  event: MockEventData
  onActivate: (id: string) => void
  onDeactivate: (id: string) => void
  onDelete: (id: string) => void
}

function EventCard({ event, onActivate, onDeactivate, onDelete }: EventCardProps) {
  const isInactive = event.status === 'inactive'

  const handleManageEvent = () => {
    console.log('Manage event:', event.id)
  }

  return (
    <div className={`
      rounded-lg overflow-hidden shadow-md border
      ${isInactive 
        ? ' border-gray-200' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Image Section - Full Width */}
      <div className="relative h-[262px] w-full">
        {/* Status Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <EventStatusBadge status={event.status} />
        </div>

        {/* Three-dot Menu - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <EventCardMenu 
            eventId={event.id}
            eventName={event.eventName}
            status={event.status}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onDelete={onDelete}
          />
        </div>

        {/* Event Image with Fallback */}
        {event?.eventLogo ? (
          <Image
            src={event.eventLogo}
            alt={event.eventName}
            fill
            className={`object-cover ${isInactive ? " bg-gray-100 grayscale opacity-75": ""}` }
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Fallback - Calendar icon from Lucide
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Progress Bar - Commented for future API integration */}
        {/* 
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-full px-3 py-2 shadow-lg">
            <ProgressBar 
              value={25} 
              label="Set-up" 
              showPercentage 
              className="h-1.5" 
              barClassName="bg-green-500"
            />
          </div>
        </div> 
        */}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <p className={`
          text-sm font-medium mb-2
          ${isInactive ? 'text-gray-600 font-medium' : 'text-gray-500'}
        `}>
          {new Date(event.eventStartDate).toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'short' 
          })} - {new Date(event.eventEndDate).toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })}
        </p>

        {/* Event Name */}
        <h3 className={`
          text-2xl font-semibold mb-4 line-clamp-2 
        `}>
          {event.eventName}
        </h3>

        {/* Manage Event Button */}
        <Button
          onClick={handleManageEvent}
          variant="outline"
          className={`
            w-full bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 py-6
            ${isInactive 
              ? ' hover:font-bold' 
              : ''
            }
          `}
          
        >
          Manage Event
        </Button>
      </div>
    </div>
  )
}

export default EventCard