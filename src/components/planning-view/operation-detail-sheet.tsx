"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { Clock, MapPin, Truck, AlertTriangle, ArrowRight } from "lucide-react"
import type { Operation } from "@/data/operations"
import type { CrewMember } from "@/data/crew"

interface OperationDetailSheetProps {
  operation: Operation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  crew: CrewMember[]
}

export function OperationDetailSheet({
  operation,
  open,
  onOpenChange,
  crew,
}: OperationDetailSheetProps) {
  if (!operation) return null

  const assignedCrew = crew.filter((c) => operation.crew.includes(c.id))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle>{operation.client}</SheetTitle>
            <StatusBadge status={operation.status} />
          </div>
          <SheetDescription>{operation.id}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Operation Type */}
          <div>
            <Badge variant="outline" className="capitalize text-sm">
              {operation.type}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              <span>{format(parseISO(operation.dateTime), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <span className="text-muted-foreground">
                {format(parseISO(operation.dateTime), "HH:mm")}
              </span>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Locations</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent/50">
                <p className="text-xs text-status-visible font-medium mb-1">PICKUP</p>
                <p className="text-sm">{operation.location.pickup}</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-3 rounded-lg bg-accent/50">
                <p className="text-xs text-status-ready font-medium mb-1">DELIVERY</p>
                <p className="text-sm">{operation.location.delivery}</p>
              </div>
            </div>
          </div>

          {/* Crew */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Assigned Crew</h4>
            <div className="space-y-2">
              {assignedCrew.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No crew assigned</p>
              ) : (
                assignedCrew.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-accent/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-sm font-semibold text-black">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Vehicle</h4>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{operation.vehicle}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
            <p className="text-sm">{operation.notes}</p>
          </div>

          {/* Special Requirements */}
          {operation.specialRequirements && operation.specialRequirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-status-visible" />
                Special Requirements
              </h4>
              <div className="flex flex-wrap gap-2">
                {operation.specialRequirements.map((req) => (
                  <Badge key={req} variant="secondary" className="capitalize">
                    {req.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
