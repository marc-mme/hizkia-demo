"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface Step {
  number: number
  title: string
  shortTitle: string
}

const steps: Step[] = [
  { number: 1, title: "Client & Type", shortTitle: "Client" },
  { number: 2, title: "Artwork Details", shortTitle: "Artwork" },
  { number: 3, title: "Pickup", shortTitle: "Pickup" },
  { number: 4, title: "Delivery", shortTitle: "Delivery" },
  { number: 5, title: "Requirements", shortTitle: "Reqs" },
  { number: 6, title: "Review", shortTitle: "Review" },
]

interface MissionFormStepsProps {
  currentStep: number
  onStepClick?: (step: number) => void
  compact?: boolean
}

export function MissionFormSteps({
  currentStep,
  onStepClick,
  compact = false,
}: MissionFormStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isClickable = onStepClick && (isCompleted || isCurrent)

          return (
            <React.Fragment key={step.number}>
              {/* Step indicator */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.number)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all",
                  isClickable && "cursor-pointer hover:opacity-80",
                  !isClickable && "cursor-default"
                )}
              >
                <motion.div
                  className={cn(
                    "relative flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                    compact ? "h-8 w-8" : "h-10 w-10",
                    isCompleted &&
                      "bg-status-ready text-background",
                    isCurrent &&
                      "bg-gold text-background gold-glow",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-accent/50 text-muted-foreground"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </motion.div>
                {!compact && (
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isCurrent ? "text-gold" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                )}
                {compact && (
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isCurrent ? "text-gold" : "text-muted-foreground"
                    )}
                  >
                    {step.shortTitle}
                  </span>
                )}
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2",
                    currentStep > step.number
                      ? "bg-status-ready"
                      : "bg-glass-border"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
