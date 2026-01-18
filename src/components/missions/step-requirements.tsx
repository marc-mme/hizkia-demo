"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import {
  CERTIFICATION_LABELS,
  VEHICLE_LABELS,
  EQUIPMENT_LABELS,
  Certification,
  VehicleType,
  Equipment,
} from "@/types/mission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Award,
  Truck,
  Users,
  Package,
  Snowflake,
  Weight,
  Shield,
  Euro,
  Calculator,
  Plus,
  X,
  RefreshCw,
} from "lucide-react"

const vehicleIcons: Record<VehicleType, typeof Truck> = {
  van: Truck,
  climate_van: Snowflake,
  truck: Truck,
  oversized: Package,
}

export function StepRequirements() {
  const { data, updateData } = useMissionForm()
  const [newFeeLabel, setNewFeeLabel] = React.useState("")
  const [newFeeAmount, setNewFeeAmount] = React.useState("")

  const toggleCertification = (cert: Certification) => {
    const current = data.certifications || []
    if (current.includes(cert)) {
      updateData({ certifications: current.filter((c) => c !== cert) })
    } else {
      updateData({ certifications: [...current, cert] })
    }
  }

  const toggleEquipment = (eq: Equipment) => {
    const current = data.equipment || []
    if (current.includes(eq)) {
      updateData({ equipment: current.filter((e) => e !== eq) })
    } else {
      updateData({ equipment: [...current, eq] })
    }
  }

  // Calculate suggested pricing based on selections
  const calculateSuggestedPricing = React.useCallback(() => {
    let base = 250 // Base rate

    // Vehicle type additions
    if (data.vehicleType === "climate_van") base += 150
    if (data.vehicleType === "truck") base += 200
    if (data.vehicleType === "oversized") base += 400

    // Crew size
    base += (data.crewSize - 1) * 100

    // Special handling fees
    const fees: { label: string; amount: number }[] = []

    if (data.specialHandling?.includes("climate_controlled")) {
      fees.push({ label: "Climate handling", amount: 150 })
    }
    if (data.specialHandling?.includes("high_value")) {
      fees.push({ label: "High-value insurance", amount: 200 })
    }
    if (data.specialHandling?.includes("oversized")) {
      fees.push({ label: "Oversized handling", amount: 175 })
    }
    if (data.certifications?.includes("museum_clearance")) {
      fees.push({ label: "Museum clearance", amount: 100 })
    }

    return { base, fees }
  }, [data.vehicleType, data.crewSize, data.specialHandling, data.certifications])

  // Initialize pricing on first load if not set
  React.useEffect(() => {
    if (data.baseRate === 0) {
      const { base, fees } = calculateSuggestedPricing()
      const additionalTotal = fees.reduce((sum, f) => sum + f.amount, 0)
      updateData({
        baseRate: base,
        additionalFees: fees,
        totalQuote: base + additionalTotal,
      })
    }
  }, [data.baseRate, calculateSuggestedPricing, updateData])

  // Recalculate total when base rate or fees change
  React.useEffect(() => {
    const additionalTotal = (data.additionalFees || []).reduce((sum, f) => sum + f.amount, 0)
    const newTotal = data.baseRate + additionalTotal
    if (newTotal !== data.totalQuote) {
      updateData({ totalQuote: newTotal })
    }
  }, [data.baseRate, data.additionalFees, data.totalQuote, updateData])

  const resetToSuggested = () => {
    const { base, fees } = calculateSuggestedPricing()
    const additionalTotal = fees.reduce((sum, f) => sum + f.amount, 0)
    updateData({
      baseRate: base,
      additionalFees: fees,
      totalQuote: base + additionalTotal,
    })
  }

  const updateFee = (index: number, field: "label" | "amount", value: string | number) => {
    const updated = [...(data.additionalFees || [])]
    if (field === "amount") {
      updated[index] = { ...updated[index], amount: Number(value) || 0 }
    } else {
      updated[index] = { ...updated[index], label: String(value) }
    }
    updateData({ additionalFees: updated })
  }

  const removeFee = (index: number) => {
    const updated = (data.additionalFees || []).filter((_, i) => i !== index)
    updateData({ additionalFees: updated })
  }

  const addFee = () => {
    if (!newFeeLabel.trim()) return
    const amount = Number(newFeeAmount) || 0
    updateData({
      additionalFees: [...(data.additionalFees || []), { label: newFeeLabel.trim(), amount }],
    })
    setNewFeeLabel("")
    setNewFeeAmount("")
  }

  return (
    <div className="space-y-6">
      {/* Certifications */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-5 w-5 text-gold" />
            Required Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(CERTIFICATION_LABELS) as Certification[]).map(
              (cert) => {
                const isSelected = data.certifications?.includes(cert)
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCertification(cert)}
                    className={cn(
                      "p-3 rounded-lg border transition-all flex items-center gap-3 text-left",
                      isSelected
                        ? "bg-gold/10 border-gold/30"
                        : "glass-subtle border-glass-border hover:bg-accent/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-gold border-gold"
                          : "border-muted-foreground"
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-background"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected && "text-gold font-medium"
                      )}
                    >
                      {CERTIFICATION_LABELS[cert]}
                    </span>
                  </button>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Type */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5 text-gold" />
            Vehicle Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(VEHICLE_LABELS) as VehicleType[]).map((vehicle) => {
              const Icon = vehicleIcons[vehicle]
              const isSelected = data.vehicleType === vehicle
              return (
                <button
                  key={vehicle}
                  type="button"
                  onClick={() => updateData({ vehicleType: vehicle })}
                  className={cn(
                    "p-3 rounded-lg border transition-all flex flex-col items-center gap-2",
                    isSelected
                      ? "bg-gold/10 border-gold/30"
                      : "glass-subtle border-glass-border hover:bg-accent/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      isSelected ? "text-gold" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs text-center",
                      isSelected ? "text-gold font-medium" : "text-muted-foreground"
                    )}
                  >
                    {VEHICLE_LABELS[vehicle]}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Crew Size */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-gold" />
            Crew Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {([1, 2, 3] as const).map((size) => {
              const isSelected = data.crewSize === size
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateData({ crewSize: size })}
                  className={cn(
                    "p-4 rounded-lg border transition-all flex flex-col items-center gap-2",
                    isSelected
                      ? "bg-gold/10 border-gold/30"
                      : "glass-subtle border-glass-border hover:bg-accent/30"
                  )}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: size }).map((_, i) => (
                      <Users
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          isSelected ? "text-gold" : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      isSelected && "text-gold font-medium"
                    )}
                  >
                    {size} {size === 1 ? "Person" : "People"}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5 text-gold" />
            Equipment Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(EQUIPMENT_LABELS) as Equipment[]).map((eq) => {
              const isSelected = data.equipment?.includes(eq)
              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleEquipment(eq)}
                  className={cn(
                    "px-3 py-2 rounded-full border text-sm transition-all",
                    isSelected
                      ? "bg-gold/10 border-gold/30 text-gold"
                      : "glass-subtle border-glass-border hover:bg-accent/30"
                  )}
                >
                  {EQUIPMENT_LABELS[eq]}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="glass gold-glow">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-5 w-5 text-gold" />
            Quote Estimate
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToSuggested}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Base Rate - Editable */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Base rate</span>
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                type="number"
                value={data.baseRate || ""}
                onChange={(e) => updateData({ baseRate: Number(e.target.value) || 0 })}
                className="glass-subtle pl-7 text-right h-8"
              />
            </div>
          </div>

          {/* Additional Fees - Editable */}
          {data.additionalFees?.map((fee, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={fee.label}
                onChange={(e) => updateFee(i, "label", e.target.value)}
                className="glass-subtle h-8 text-sm flex-1"
                placeholder="Fee description"
              />
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+€</span>
                <Input
                  type="number"
                  value={fee.amount || ""}
                  onChange={(e) => updateFee(i, "amount", e.target.value)}
                  className="glass-subtle pl-7 text-right h-8"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFee(i)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add New Fee */}
          <div className="flex items-center gap-2 pt-1">
            <Input
              value={newFeeLabel}
              onChange={(e) => setNewFeeLabel(e.target.value)}
              className="glass-subtle h-8 text-sm flex-1"
              placeholder="Add fee..."
              onKeyDown={(e) => e.key === "Enter" && addFee()}
            />
            <div className="relative w-24">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+€</span>
              <Input
                type="number"
                value={newFeeAmount}
                onChange={(e) => setNewFeeAmount(e.target.value)}
                className="glass-subtle pl-7 text-right h-8"
                placeholder="0"
                onKeyDown={(e) => e.key === "Enter" && addFee()}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={addFee}
              disabled={!newFeeLabel.trim()}
              className="h-8 w-8 text-muted-foreground hover:text-gold shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-px bg-glass-border" />
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Quote</span>
            <span className="text-2xl font-bold text-gold">
              €{data.totalQuote}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            * Edit prices above or use Reset to recalculate based on selections.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
