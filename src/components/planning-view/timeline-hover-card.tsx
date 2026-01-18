"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { format, parseISO } from "date-fns"
import { Clock, MapPin, Users } from "lucide-react"
import type { Operation } from "@/data/operations"

interface TimelineHoverCardProps {
  operation: Operation
  children: React.ReactNode
}

export function TimelineHoverCard({ operation, children }: TimelineHoverCardProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" className="glass w-72 p-4" sideOffset={8}>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{operation.client}</p>
                <p className="text-xs text-muted-foreground">{operation.id}</p>
              </div>
              <StatusBadge status={operation.status} />
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(parseISO(operation.dateTime), "MMM d, HH:mm")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{operation.location.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{operation.crew.length} crew assigned</span>
              </div>
            </div>

            {/* Operation Type Badge */}
            <Badge variant="outline" className="capitalize">
              {operation.type}
            </Badge>

            <p className="text-xs text-muted-foreground">Click for full details</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
