"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TimelineHoverCard } from "./timeline-hover-card"
import { differenceInDays, startOfDay, parseISO } from "date-fns"
import { AlertTriangle } from "lucide-react"
import type { Operation, OperationStatus } from "@/data/operations"

interface TimelineOperationBarProps {
  operation: Operation
  startDate: Date
  columnWidth: number
  onOperationClick: (op: Operation) => void
  hasConflict?: boolean
}

const statusColors: Record<OperationStatus, string> = {
  visible: "bg-status-visible/80 border-status-visible",
  ready: "bg-status-ready/80 border-status-ready",
  in_progress: "bg-status-info/80 border-status-info",
  completed: "bg-muted/80 border-muted-foreground/30",
}

const statusGlow: Record<OperationStatus, string> = {
  visible: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
  ready: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
  in_progress: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
  completed: "",
}

export function TimelineOperationBar({
  operation,
  startDate,
  columnWidth,
  onOperationClick,
  hasConflict = false,
}: TimelineOperationBarProps) {
  const opDate = parseISO(operation.dateTime)
  const dayOffset = differenceInDays(startOfDay(opDate), startOfDay(startDate))

  // Calculate position (180px for label column + day offset)
  const leftPosition = 180 + dayOffset * columnWidth

  // Operation duration visualization (default width based on column)
  const barWidth = Math.max(columnWidth * 0.85, 100)

  // Time-based offset within the day column (7am-7pm range)
  const hourOffset = opDate.getHours()
  const minuteOffset = opDate.getMinutes() / 60
  const timeOffset = ((hourOffset + minuteOffset - 7) / 12) * (columnWidth * 0.15)

  return (
    <TimelineHoverCard operation={operation}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute top-2 h-10 rounded-lg border cursor-pointer",
          "flex items-center gap-2 px-3 text-xs font-medium text-white",
          "transition-all hover:scale-[1.02] hover:z-10",
          statusColors[operation.status],
          statusGlow[operation.status]
        )}
        style={{
          left: leftPosition + Math.max(timeOffset, 0),
          width: barWidth,
        }}
        onClick={() => onOperationClick(operation)}
      >
        <span className="truncate flex-1">{operation.client}</span>
        <span className="text-white/70 text-[10px] capitalize shrink-0">
          {operation.type}
        </span>

        {/* Conflict indicator */}
        {hasConflict && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-urgent flex items-center justify-center">
            <AlertTriangle className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </motion.div>
    </TimelineHoverCard>
  )
}
