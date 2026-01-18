"use client"

import * as React from "react"
import { operations, type Operation } from "@/data/operations"
import { crew } from "@/data/crew"
import { PhoneMockup } from "@/components/layout/phone-mockup"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Phone,
  Navigation,
  Camera,
  CheckCircle,
  Clock,
  Truck,
  ChevronRight,
  Package,
} from "lucide-react"

type FieldStatus = "upcoming" | "en_route" | "arrived" | "completed"

interface FieldOperation extends Operation {
  fieldStatus: FieldStatus
}

const statusConfig: Record<FieldStatus, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "bg-muted text-muted-foreground" },
  en_route: { label: "En Route", color: "bg-status-info text-white" },
  arrived: { label: "On Site", color: "bg-status-visible text-white" },
  completed: { label: "Completed", color: "bg-status-ready text-white" },
}

export default function FieldPage() {
  const [fieldOps, setFieldOps] = React.useState<FieldOperation[]>(
    operations
      .filter((op) => op.status !== "completed")
      .slice(0, 3)
      .map((op, i) => ({
        ...op,
        fieldStatus: i === 0 ? "en_route" : "upcoming",
      }))
  )
  const [selectedOp, setSelectedOp] = React.useState<FieldOperation | null>(null)

  const updateFieldStatus = (id: string, status: FieldStatus) => {
    setFieldOps((prev) =>
      prev.map((op) => (op.id === id ? { ...op, fieldStatus: status } : op))
    )
    if (selectedOp?.id === id) {
      setSelectedOp((prev) => (prev ? { ...prev, fieldStatus: status } : null))
    }
  }

  const currentCrew = crew[0] // Simulated logged-in crew member

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Mobile Field View</h1>
        <p className="text-muted-foreground">
          What delivery crews see on their phones
        </p>
      </div>

      <PhoneMockup>
        <div className="p-4 bg-background min-h-full">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Good morning, {currentCrew.name}
            </p>
            <h2 className="text-xl font-bold">
              You have {fieldOps.length} operations today
            </h2>
          </div>

          {/* Operations List or Detail */}
          <AnimatePresence mode="wait">
            {selectedOp ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Back Button */}
                <button
                  onClick={() => setSelectedOp(null)}
                  className="text-sm text-gold flex items-center gap-1"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to list
                </button>

                {/* Operation Detail */}
                <div className="glass-subtle p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{selectedOp.client}</h3>
                    <Badge className={statusConfig[selectedOp.fieldStatus].color}>
                      {statusConfig[selectedOp.fieldStatus].label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(selectedOp.dateTime), "HH:mm")}
                    <Badge variant="outline" className="capitalize ml-2">
                      {selectedOp.type}
                    </Badge>
                  </div>

                  {/* Locations */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/50">
                      <MapPin className="h-5 w-5 text-status-visible shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Pickup</p>
                        <p className="text-sm font-medium">
                          {selectedOp.location.pickup}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/50">
                      <MapPin className="h-5 w-5 text-status-ready shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <p className="text-sm font-medium">
                          {selectedOp.location.delivery}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedOp.notes && (
                    <div className="p-3 rounded-xl bg-status-visible/10 border border-status-visible/30 mb-4">
                      <p className="text-xs text-status-visible font-medium mb-1">
                        Special Instructions
                      </p>
                      <p className="text-sm">{selectedOp.notes}</p>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedOp.specialRequirements && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedOp.specialRequirements.map((req) => (
                        <Badge key={req} variant="secondary" className="text-xs">
                          {req.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {selectedOp.fieldStatus === "upcoming" && (
                    <Button
                      className="w-full h-14 text-lg bg-status-info hover:bg-status-info/90"
                      onClick={() => updateFieldStatus(selectedOp.id, "en_route")}
                    >
                      <Truck className="h-5 w-5 mr-2" />
                      Start - En Route
                    </Button>
                  )}

                  {selectedOp.fieldStatus === "en_route" && (
                    <Button
                      className="w-full h-14 text-lg bg-status-visible hover:bg-status-visible/90"
                      onClick={() => updateFieldStatus(selectedOp.id, "arrived")}
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Arrived on Site
                    </Button>
                  )}

                  {selectedOp.fieldStatus === "arrived" && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full h-12 glass-subtle"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Take Photo
                      </Button>
                      <Button
                        className="w-full h-14 text-lg bg-status-ready hover:bg-status-ready/90"
                        onClick={() =>
                          updateFieldStatus(selectedOp.id, "completed")
                        }
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Complete Delivery
                      </Button>
                    </>
                  )}

                  {selectedOp.fieldStatus === "completed" && (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-status-ready mx-auto mb-2" />
                      <p className="font-medium">Operation Completed!</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 glass-subtle">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Client
                  </Button>
                  <Button variant="outline" className="flex-1 glass-subtle">
                    <Package className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Next Up */}
                {fieldOps.filter((op) => op.fieldStatus !== "completed").length >
                  0 && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Next Up
                    </p>
                    {fieldOps
                      .filter((op) => op.fieldStatus !== "completed")
                      .slice(0, 1)
                      .map((op) => (
                        <div
                          key={op.id}
                          onClick={() => setSelectedOp(op)}
                          className="glass p-4 rounded-2xl cursor-pointer gold-glow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{op.client}</h3>
                            <Badge className={statusConfig[op.fieldStatus].color}>
                              {statusConfig[op.fieldStatus].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {op.type} - {format(parseISO(op.dateTime), "HH:mm")}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-status-ready" />
                            <span className="truncate">
                              {op.location.delivery}
                            </span>
                          </div>
                          <div className="flex justify-end mt-3">
                            <span className="text-xs text-gold flex items-center">
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Later */}
                {fieldOps.filter(
                  (op) =>
                    op.fieldStatus === "upcoming" &&
                    fieldOps.indexOf(op) > 0
                ).length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Later Today
                    </p>
                    {fieldOps
                      .filter((op) => op.fieldStatus === "upcoming")
                      .slice(1)
                      .map((op) => (
                        <div
                          key={op.id}
                          onClick={() => setSelectedOp(op)}
                          className="glass-subtle p-3 rounded-xl cursor-pointer mb-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{op.client}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(parseISO(op.dateTime), "HH:mm")} -{" "}
                                {op.type}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Completed */}
                {fieldOps.filter((op) => op.fieldStatus === "completed").length >
                  0 && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Completed
                    </p>
                    {fieldOps
                      .filter((op) => op.fieldStatus === "completed")
                      .map((op) => (
                        <div
                          key={op.id}
                          className="p-3 rounded-xl bg-accent/30 mb-2 opacity-60"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-status-ready" />
                            <span className="font-medium">{op.client}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PhoneMockup>
    </div>
  )
}
