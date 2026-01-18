"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEP_TITLES = [
  "Client & Type",
  "Artwork",
  "Pickup",
  "Delivery",
  "Requirements",
  "Review",
]

interface MissionPanelContentProps {
  onClose: () => void
  onSuccess?: () => void
}

function MissionPanelContent({ onClose, onSuccess }: MissionPanelContentProps) {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    data,
    resetForm,
  } = useMissionForm()

  const [showSuccess, setShowSuccess] = React.useState(false)

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
      <div className="flex flex-col items-center justify-center h-full py-12">
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
    <div className="flex flex-col h-full">
      {/* Step Indicator */}
      <div className="flex items-center gap-1 px-1 py-3 border-b border-glass-border overflow-x-auto">
        {STEP_TITLES.map((title, index) => {
          const stepNum = index + 1
          const isActive = currentStep === stepNum
          const isCompleted = currentStep > stepNum
          return (
            <button
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs whitespace-nowrap transition-colors",
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
              <span className="hidden sm:inline">{title}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
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

        {isLastStep ? (
          <Button
            size="sm"
            onClick={handleSubmit}
            className="bg-gold text-background hover:bg-gold/90"
          >
            <Send className="h-4 w-4 mr-1" />
            Create Mission
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

interface MissionPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function MissionPanel({ open, onOpenChange, onSuccess }: MissionPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-glass-border">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>New Mission</SheetTitle>
              <SheetDescription>
                Quick mission creation
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <MissionFormProvider>
          <MissionPanelContent
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        </MissionFormProvider>
      </SheetContent>
    </Sheet>
  )
}

// Context for global panel state
interface MissionPanelContextType {
  openPanel: () => void
  closePanel: () => void
  isOpen: boolean
}

const MissionPanelContext = React.createContext<MissionPanelContextType | null>(null)

export function useMissionPanel() {
  const context = React.useContext(MissionPanelContext)
  if (!context) {
    throw new Error("useMissionPanel must be used within MissionPanelProvider")
  }
  return context
}

export function MissionPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openPanel = React.useCallback(() => setIsOpen(true), [])
  const closePanel = React.useCallback(() => setIsOpen(false), [])

  return (
    <MissionPanelContext.Provider value={{ openPanel, closePanel, isOpen }}>
      {children}
      <MissionPanel open={isOpen} onOpenChange={setIsOpen} />
    </MissionPanelContext.Provider>
  )
}
