import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type DialogStep = 'confirmation' | 'success' | 'error'

interface ConfirmationStepProps {
  heading: string
  description?: string
  bulletPoints?: string[]
  cancelButtonLabel?: string
  successButtonLabel?: string
  destructive?: boolean
}

interface SuccessStepProps {
  heading: string
  description?: string
  closeButtonLabel?: string
}

interface ErrorStepProps {
  heading: string
  description?: string
  cancelButtonLabel?: string
}

interface ActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Confirmation step props
  confirmationHeading: string
  confirmationDescription?: string
  confirmationBulletPoints?: string[]
  confirmationCancelButtonLabel?: string
  confirmationSuccessButtonLabel?: string
  destructive?: boolean
  // Success step props
  successHeading?: string
  successDescription?: string
  successCloseButtonLabel?: string
  // Error step props
  errorHeading?: string
  errorDescription?: string
  errorCancelButtonLabel?: string
  // Action handler
  onConfirm: () => Promise<void> | void
  // Optional: For TanStack Query integration
  mutation?: {
    mutate: () => void
    isPending?: boolean
    isSuccess?: boolean
    isError?: boolean
    error?: any
  }
}
export function ActionDialog({
  open,
  onOpenChange,
  // Confirmation step props
  confirmationHeading,
  confirmationDescription,
  confirmationBulletPoints,
  confirmationCancelButtonLabel = 'Cancel',
  confirmationSuccessButtonLabel = 'Confirm',
  destructive = false,
  // Success step props
  successHeading = 'Success!',
  successDescription,
  successCloseButtonLabel = 'Close',
  // Error step props
  errorHeading = 'Error',
  errorDescription,
  errorCancelButtonLabel = 'Close',
  // Action handler
  onConfirm,
  // TanStack Query mutation
  mutation,
}: ActionDialogProps) {
  const [currentStep, setCurrentStep] = useState<DialogStep>('confirmation')
  const [isLoading, setIsLoading] = useState(false)

  // Reset step when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCurrentStep('confirmation')
      setIsLoading(false)
    }
  }, [open])

  // Handle TanStack Query mutation states
  useEffect(() => {
    if (mutation) {
      if (mutation.isSuccess) {
        setCurrentStep('success')
        setIsLoading(false)
      } else if (mutation.isError) {
        setCurrentStep('error')
        setIsLoading(false)
      } else if (mutation.isPending) {
        setIsLoading(true)
      }
    }
  }, [mutation?.isSuccess, mutation?.isError, mutation?.isPending])

  const handleConfirm = async () => {
    if (mutation) {
      // Use TanStack Query mutation
      mutation.mutate()
    } else {
      // Use custom onConfirm handler
      setIsLoading(true)
      try {
        await onConfirm()
        setCurrentStep('success')
      } catch (error) {
        setCurrentStep('error')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setCurrentStep('confirmation')
    setIsLoading(false)
  }

  const renderConfirmationStep = () => (
    <>
      <DialogHeader className="space-y-4">
        <DialogTitle className="text-2xl font-semibold">
          {confirmationHeading}
        </DialogTitle>
        {confirmationDescription && (
          <DialogDescription className="text-gray-600 text-base leading-relaxed">
            {confirmationDescription}
          </DialogDescription>
        )}
        {confirmationBulletPoints && confirmationBulletPoints.length > 0 && (
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-base mt-4">
            {confirmationBulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        )}
      </DialogHeader>
      <DialogFooter className="px-8 pt-4 mt-8 border-t border-gray-200">
        <div className="flex gap-3 w-1/2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-medium h-12 text-base"
          >
            {confirmationCancelButtonLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 font-medium h-12 text-base ${
              destructive
                ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
            }`}
          >
            {isLoading ? 'Processing...' : confirmationSuccessButtonLabel}
          </Button>
        </div>
      </DialogFooter>
    </>
  )

  const renderSuccessStep = () => (
    <>
      <DialogHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-semibold text-center">
          {successHeading}
        </DialogTitle>
        {successDescription && (
          <DialogDescription className="text-gray-600 text-base leading-relaxed text-center">
            {successDescription}
          </DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter className="px-8 py-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleClose}
          className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium h-12 text-base"
        >
          {successCloseButtonLabel}
        </Button>
      </DialogFooter>
    </>
  )

  const renderErrorStep = () => (
    <>
      <DialogHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-semibold text-center">
          {errorHeading}
        </DialogTitle>
        {errorDescription && (
          <DialogDescription className="text-gray-600 text-base leading-relaxed text-center">
            {errorDescription}
          </DialogDescription>
        )}
        {mutation?.error && (
          <DialogDescription className="text-red-600 text-sm text-center mt-2">
            {mutation.error.message || 'An unexpected error occurred'}
          </DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter className="px-8 py-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleClose}
          className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium h-12 text-base"
        >
          {errorCancelButtonLabel}
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="pl-8 pr-4 pb-4 pt-8">
          {currentStep === 'confirmation' && renderConfirmationStep()}
          {currentStep === 'success' && renderSuccessStep()}
          {currentStep === 'error' && renderErrorStep()}
        </div>
      </DialogContent>
    </Dialog>
  )
}