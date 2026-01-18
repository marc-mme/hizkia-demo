"use client"

import * as React from "react"
import {
  MissionFormData,
  defaultMissionFormData,
} from "@/types/mission"

interface MissionFormContextType {
  data: MissionFormData
  updateData: (updates: Partial<MissionFormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
  resetForm: () => void
}

const MissionFormContext = React.createContext<MissionFormContextType | null>(
  null
)

export function useMissionForm() {
  const context = React.useContext(MissionFormContext)
  if (!context) {
    throw new Error("useMissionForm must be used within MissionFormProvider")
  }
  return context
}

interface MissionFormProviderProps {
  children: React.ReactNode
  initialData?: Partial<MissionFormData>
  totalSteps?: number
}

export function MissionFormProvider({
  children,
  initialData,
  totalSteps = 6,
}: MissionFormProviderProps) {
  const [data, setData] = React.useState<MissionFormData>({
    ...defaultMissionFormData,
    ...initialData,
  })
  const [currentStep, setCurrentStep] = React.useState(1)

  // Auto-save to localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("mission-form-draft")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData((prev) => ({ ...prev, ...parsed }))
      } catch {
        // Ignore invalid JSON
      }
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem("mission-form-draft", JSON.stringify(data))
  }, [data])

  const updateData = React.useCallback((updates: Partial<MissionFormData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }, [totalSteps])

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  const resetForm = React.useCallback(() => {
    setData(defaultMissionFormData)
    setCurrentStep(1)
    localStorage.removeItem("mission-form-draft")
  }, [])

  const value = React.useMemo(
    () => ({
      data,
      updateData,
      currentStep,
      setCurrentStep,
      totalSteps,
      nextStep,
      prevStep,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === totalSteps,
      resetForm,
    }),
    [data, updateData, currentStep, totalSteps, nextStep, prevStep, resetForm]
  )

  return (
    <MissionFormContext.Provider value={value}>
      {children}
    </MissionFormContext.Provider>
  )
}
