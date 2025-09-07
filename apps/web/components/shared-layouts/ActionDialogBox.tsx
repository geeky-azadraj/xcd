import { AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from './LoadingSpinner'

interface ActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'loading'
  actionLabel?: string
  onAction?: () => void
  closeLabel?: string
  destructive?: boolean
  eventName?: string
  bulletPoints?: string[]
  onCancel?: () => void
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  type = 'default',
  actionLabel,
  onAction,
  closeLabel = 'Close',
  destructive = false,
  eventName,
  bulletPoints,
  onCancel,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-4">
            {type !== 'success' && (
              <DialogTitle className={`text-xl font-bold text-black ${type === 'loading' ? 'text-center' : 'text-left'} mb-2`}>
                {title}
              </DialogTitle>
            )}
            {description && type !== 'success' && (
              <DialogDescription className={`text-sm text-gray-600 ${type === 'loading' ? 'text-center -mt-2' : 'text-left'} mb-4`}>
                {description}
              </DialogDescription>
            )}
            
            {type === 'loading' && (
              <div className="flex justify-center py-6">
                <LoadingSpinner className="w-16 h-16" />
              </div>
            )}
            {type === 'success' && (
              <div className="flex flex-col items-center py-8 space-y-6">
                <div className="relative">
                  {/* Large subtle green gradient background circle */}
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
                    {/* Smaller dark green circle with white tick */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-md">
                      <Image src="/success-tick.svg" alt="Success" width={24} height={24} className="brightness-0 invert" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black text-center">
                  Details fetched
                </h3>
              </div>
            )}
            {type === 'error' && (
              <div className="flex justify-center py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            )}
            {eventName && type === 'success' && (
              <div className="text-center space-y-2">
                <p className="text-base text-gray-600">
                  {title === 'Event Deactivated!' ? (
                    <>
                      <span className="font-semibold">{eventName}</span> is now inactive and hidden from all users
                    </>
                  ) : title === 'Event Activated!' ? (
                    <>
                      <span className="font-semibold">{eventName}</span> is now active and visible to all users
                    </>
                  ) : (
                    <>
                      You have deleted <span className="font-semibold">{eventName}</span> Event
                    </>
                  )}
                </p>
              </div>
            )}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-base mt-4">
                {bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </DialogHeader>
        </div>
        {type !== 'success' && (
          <DialogFooter className="px-6 py-4 border-t border-gray-200">
            <div className={`flex gap-3 ${type === 'default' ? 'justify-end' : 'w-full'}`}>
            {type === 'loading' && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium h-12 text-base"
              >
                Cancel
              </Button>
            )}
            {type === 'default' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-white hover:bg-gray-100 text-gray-700 font-medium h-10 px-6 border-gray-300"
                >
                  {closeLabel}
                </Button>
                {actionLabel && onAction && (
                  <Button
                    onClick={onAction}
                    className={`font-medium h-10 px-6 ${
                      destructive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {actionLabel}
                  </Button>
                )}
              </>
            )}
            {(type === 'error') && (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium h-12 text-base"
              >
                {closeLabel}
              </Button>
            )}
          </div>
        </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
