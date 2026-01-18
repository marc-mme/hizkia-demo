"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MissionFormProvider,
  useMissionForm,
  StepClientInfo,
  StepArtwork,
  StepPickup,
  StepDelivery,
  StepRequirements,
  StepReview,
} from "@/components/missions"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEP_TITLES = [
  "Client",
  "Artwork",
  "Pickup",
  "Delivery",
  "Requirements",
  "Review",
]

interface MissionModalContentProps {
  onClose: () => void
  onSuccess?: () => void
  initialClientId?: string
  initialClientName?: string
}

function MissionModalContent({
  onClose,
  onSuccess,
  initialClientId,
  initialClientName,
}: MissionModalContentProps) {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    data,
    resetForm,
    updateData,
  } = useMissionForm()

  const [showSuccess, setShowSuccess] = React.useState(false)

  // Pre-fill client if provided
  React.useEffect(() => {
    if (initialClientId && initialClientName && !data.clientId) {
      updateData({ clientId: initialClientId, clientName: initialClientName })
    }
  }, [initialClientId, initialClientName, data.clientId, updateData])

  const handleSubmit = () => {
    console.log("Mission created:", data)
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    resetForm()
    onSuccess?.()
    onClose()
  }

  const steps = [
    <StepClientInfo key="client" />,
    <StepArtwork key="artwork" />,
    <StepPickup key="pickup" />,
    <StepDelivery key="delivery" />,
    <StepRequirements key="requirements" />,
    <StepReview key="review" />,
  ]

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 rounded-full bg-status-ready/20 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-status-ready" />
        </div>
        <h3 className="text-xl font-bold mb-2">Mission Created!</h3>
        <p className="text-muted-foreground text-center mb-6">
          Reference: <span className="font-mono">{data.referenceNumber}</span>
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSuccessClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              setShowSuccess(false)
              resetForm()
            }}
            className="bg-gold text-background hover:bg-gold/90"
          >
            Create Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Step Indicator - Compact */}
      <div className="flex items-center justify-center gap-2 py-3 border-b border-glass-border">
        {STEP_TITLES.map((title, index) => {
          const stepNum = index + 1
          const isActive = currentStep === stepNum
          const isCompleted = currentStep > stepNum
          return (
            <button
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
                isActive
                  ? "bg-gold/10 text-gold"
                  : isCompleted
                  ? "text-foreground hover:bg-accent/30"
                  : "text-muted-foreground hover:bg-accent/30"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                  isActive
                    ? "bg-gold text-background"
                    : isCompleted
                    ? "bg-foreground/20 text-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span className="hidden md:inline">{title}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 max-h-[50vh]">
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {steps[currentStep - 1]}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Navigation */}
      <div className="p-4 border-t border-glass-border flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={prevStep}
          disabled={isFirstStep}
          className="glass-subtle"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="text-xs text-muted-foreground">
          Step {currentStep} of 6
        </div>

        {isLastStep ? (
          <Button
            size="sm"
            onClick={handleSubmit}
            className="bg-gold text-background hover:bg-gold/90"
          >
            <Send className="h-4 w-4 mr-1" />
            Create
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={nextStep}
            className="bg-gold text-background hover:bg-gold/90"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

interface MissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialClientId?: string
  initialClientName?: string
}

export function MissionModal({
  open,
  onOpenChange,
  onSuccess,
  initialClientId,
  initialClientName,
}: MissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-glass-border">
          <DialogTitle>New Mission</DialogTitle>
          <DialogDescription>
            Create a new transport mission
          </DialogDescription>
        </DialogHeader>
        <MissionFormProvider>
          <MissionModalContent
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
            initialClientId={initialClientId}
            initialClientName={initialClientName}
          />
        </MissionFormProvider>
      </DialogContent>
    </Dialog>
  )
}
