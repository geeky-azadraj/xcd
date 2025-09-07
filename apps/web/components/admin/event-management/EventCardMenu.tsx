
import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ActionDialog } from "@/components/shared-layouts/ActionDialogBox"

interface EventCardMenuProps {
  eventId: string
  eventName: string
  status: 'ACTIVE' | 'INACTIVE'
  onActivate: (id: string) => void
  onDeactivate: (id: string) => void
  onDelete: (id: string) => void
}

type DialogType = 'deactivate' | 'activate' | 'delete' | 'deactivateSuccess' | 'activateSuccess' | 'deleteSuccess' | 'error' | null

function EventCardMenu({ eventId, eventName, status, onActivate, onDeactivate, onDelete }: EventCardMenuProps) {
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleDeactivate = () => {
    try {
      // Simulating API call 
      // if (hasActiveBookings) throw new Error("You cannot deactivate this event as there are active hotel bookings under this event ID")
      
      onDeactivate(eventId)
      setDialogType('deactivateSuccess')
    } catch (error: any) {
      setErrorMessage(error.message || "You cannot deactivate this event as there are active hotel bookings under this event ID")
      setDialogType('error')
    }
  }

  const handleActivate = () => {
    onActivate(eventId)
    setDialogType('activateSuccess')
  }

  const handleDelete = () => {
    try {
      // Simulating Api Call
      // if (hasActiveBookings) throw new Error("You cannot delete this event as there are active hotel bookings under this event ID")
      
      onDelete(eventId)
      setDialogType('deleteSuccess')
    } catch (error: any) {
      setErrorMessage(error.message || "You cannot delete this event as there are active hotel bookings under this event ID")
      setDialogType('error')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-0">
          <div className="p-1">
            {status === 'INACTIVE' ? (
              <DropdownMenuItem 
                onClick={() => setDialogType('activate')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer focus:bg-gray-50 rounded-md outline-none focus:outline-none focus-visible:outline-none focus:ring-offset-0"
              >
                <span className="text-gray-700 font-medium">Active Event</span>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => setDialogType('deactivate')}
                className="flex items-center justify-between px-4 py-3 cursor-pointer  focus:bg-gray-50 rounded-md outline-none focus:outline-none focus-visible:outline-none  focus:ring-offset-0"
              >
                <span className="text-gray-600 text-[15px]">Active Event</span>
                <div className="w-12 h-6 bg-green-700 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#004000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </DropdownMenuItem>
            )}
          </div>
          <div className="border-t">
            <div className="p-1">
              <DropdownMenuItem 
                onClick={() => setDialogType('delete')}
                className="flex items-center px-4 py-3 text-red-600 hover:bg-blue-200 focus:bg-blue-200 cursor-pointer rounded-md outline-none focus:outline-none focus-visible:outline-none focus:ring-offset-0"
              >
                <span className="font-medium">Delete Event</span>
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deactivate Dialog */}
      <ActionDialog
        open={dialogType === 'deactivate'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Deactivate Event"
        description="Are you sure you want to deactivate this event? Users will no longer be able to make future bookings or access their hotel booking portal."
        actionLabel="Yes, deactivate it"
        onAction={handleDeactivate}
        destructive
      />

      {/* Activate Dialog */}
      <ActionDialog
        open={dialogType === 'activate'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Activate Event"
        description="Do you want to activate this event? Users will be able to make bookings and further manage their hotel bookings on their event portal."
        actionLabel="Yes, activate it"
        onAction={handleActivate}
      />

      {/* Delete Dialog */}
      <ActionDialog
        open={dialogType === 'delete'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Delete Event?"
        description="Do you want to permanently delete this event? This action will cause the following:"
        bulletPoints={[
          "All data related to this event will be deleted",
          "Guests and users will no longer be able to access this event portal."
        ]}
        actionLabel="Yes, delete it"
        onAction={handleDelete}
        destructive
      />

      {/* Success Dialogs */}
      <ActionDialog
        open={dialogType === 'deactivateSuccess'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Event Deactivated!"
        type="success"
        eventName={eventName}
      />

      <ActionDialog
        open={dialogType === 'activateSuccess'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Event Activated!"
        type="success"
        eventName={eventName}
      />

      <ActionDialog
        open={dialogType === 'deleteSuccess'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Event Deleted!"
        type="success"
        eventName={eventName}
      />

      {/* Error Dialog */}
      <ActionDialog
        open={dialogType === 'error'}
        onOpenChange={(open) => !open && setDialogType(null)}
        title="Error!"
        description={errorMessage}
        type="error"
      />
    </>
  )
}

export default EventCardMenu