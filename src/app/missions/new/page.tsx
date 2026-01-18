"use client"

import * as React from "react"
import {
  MissionFormProvider,
  useMissionForm,
  MissionFormSteps,
  StepClientInfo,
  StepArtwork,
  StepPickup,
  StepDelivery,
  StepRequirements,
  StepReview,
} from "@/components/missions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  RotateCcw,
  CheckCircle,
} from "lucide-react"

function MissionFormContent() {
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
  const [showReset, setShowReset] = React.useState(false)

  const handleSubmit = () => {
    // Simulate saving
    console.log("Mission created:", data)
    setShowSuccess(true)
  }

  const handleReset = () => {
    resetForm()
    setShowReset(false)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    resetForm()
  }

  const steps = [
    <StepClientInfo key="client" />,
    <StepArtwork key="artwork" />,
    <StepPickup key="pickup" />,
    <StepDelivery key="delivery" />,
    <StepRequirements key="requirements" />,
    <StepReview key="review" />,
  ]

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">New Mission</h1>
            <p className="text-muted-foreground">
              Create a new transport operation
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReset(true)}
            className="glass-subtle"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Step Indicator */}
        <Card className="glass p-4">
          <MissionFormSteps
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </Card>
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 pt-4 border-t border-glass-border">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className="glass-subtle"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            {!isLastStep && (
              <Button
                variant="outline"
                className="glass-subtle"
                onClick={() => {
                  // Save as draft functionality would go here
                  console.log("Saved as draft:", data)
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                className="bg-gold text-background hover:bg-gold/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Create Mission
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gold text-background hover:bg-gold/90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="glass">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-status-ready/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-status-ready" />
              </div>
            </div>
            <DialogTitle className="text-center">Mission Created!</DialogTitle>
            <DialogDescription className="text-center">
              Your mission <span className="font-mono">{data.referenceNumber}</span>{" "}
              has been created successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleSuccessClose}
              className="w-full bg-gold text-background hover:bg-gold/90"
            >
              Create Another Mission
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false)
                // Would navigate to planning view
                window.location.href = "/planning"
              }}
              className="w-full"
            >
              Go to Planning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Reset Form?</DialogTitle>
            <DialogDescription>
              This will clear all entered data and start fresh. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
            >
              Reset Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function NewMissionPage() {
  return (
    <MissionFormProvider>
      <MissionFormContent />
    </MissionFormProvider>
  )
}
