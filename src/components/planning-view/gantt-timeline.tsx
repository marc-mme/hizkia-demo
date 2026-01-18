"use client"

import * as React from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TimelineOperationBar } from "./timeline-operation-bar"
import { TodayMarker } from "./today-marker"
import { ResourceOverlay } from "./resource-overlay"
import { TimelineHeader } from "./timeline-header"
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  parseISO,
  isToday,
  startOfDay,
} from "date-fns"
import type { ViewMode } from "./timeline-toolbar"
import type { Operation } from "@/data/operations"
import type { CrewMember } from "@/data/crew"

interface GanttTimelineProps {
  operations: Operation[]
  viewMode: ViewMode
  currentDate: Date
  showResourceOverlay: boolean
  crew: CrewMember[]
  onOperationClick: (op: Operation) => void
}

export function GanttTimeline({
  operations,
  viewMode,
  currentDate,
  showResourceOverlay,
  crew,
  onOperationClick,
}: GanttTimelineProps) {
  // Calculate date range based on view mode
  const { startDate, endDate, days } = React.useMemo(() => {
    if (viewMode === "day") {
      return {
        startDate: currentDate,
        endDate: currentDate,
        days: [currentDate],
      }
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      return {
        startDate: start,
        endDate: addDays(start, 6),
        days: Array.from({ length: 7 }, (_, i) => addDays(start, i)),
      }
    } else {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const dayCount = differenceInDays(end, start) + 1
      return {
        startDate: start,
        endDate: end,
        days: Array.from({ length: dayCount }, (_, i) => addDays(start, i)),
      }
    }
  }, [viewMode, currentDate])

  // Filter operations to those within the visible date range
  const visibleOperations = React.useMemo(() => {
    return operations.filter((op) => {
      const opDate = startOfDay(parseISO(op.dateTime))
      return opDate >= startOfDay(startDate) && opDate <= startOfDay(endDate)
    })
  }, [operations, startDate, endDate])

  // Group operations into rows (to handle visual stacking)
  const operationRows = React.useMemo(() => {
    return groupOperationsIntoRows(visibleOperations, startDate)
  }, [visibleOperations, startDate])

  // Detect conflicts (same crew, same day)
  const conflictingOps = React.useMemo(() => {
    const conflicts = new Set<string>()
    visibleOperations.forEach((op) => {
      const opDate = format(parseISO(op.dateTime), "yyyy-MM-dd")
      visibleOperations.forEach((other) => {
        if (op.id === other.id) return
        const otherDate = format(parseISO(other.dateTime), "yyyy-MM-dd")
        if (opDate === otherDate) {
          const sharedCrew = op.crew.filter((c) => other.crew.includes(c))
          if (sharedCrew.length > 0) {
            conflicts.add(op.id)
            conflicts.add(other.id)
          }
        }
      })
    })
    return conflicts
  }, [visibleOperations])

  // Calculate column width based on view mode
  const columnWidth = viewMode === "month" ? 40 : viewMode === "week" ? 120 : 200

  return (
    <div className="flex-1 glass rounded-xl overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <div
          className="relative min-w-max"
          style={{
            width: `calc(180px + ${days.length * columnWidth}px)`,
          }}
        >
          {/* Header with day columns */}
          <TimelineHeader days={days} viewMode={viewMode} columnWidth={columnWidth} />

          {/* Timeline body */}
          <div className="relative" style={{ minHeight: Math.max(operationRows.length * 56, 200) }}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-[180px] shrink-0 border-r border-glass-border" />
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-r border-glass-border/30",
                    isToday(day) && "bg-gold/5"
                  )}
                  style={{ width: columnWidth }}
                />
              ))}
            </div>

            {/* Operation rows */}
            {operationRows.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                No operations in this time range
              </div>
            ) : (
              operationRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="relative h-14 border-b border-glass-border/30"
                >
                  {row.map((op) => (
                    <TimelineOperationBar
                      key={op.id}
                      operation={op}
                      startDate={startDate}
                      columnWidth={columnWidth}
                      onOperationClick={onOperationClick}
                      hasConflict={conflictingOps.has(op.id)}
                    />
                  ))}
                </div>
              ))
            )}

            {/* Today marker */}
            <TodayMarker
              startDate={startDate}
              endDate={endDate}
              columnWidth={columnWidth}
              viewMode={viewMode}
            />
          </div>

          {/* Resource overlay (conditionally rendered) */}
          {showResourceOverlay && (
            <ResourceOverlay
              crew={crew}
              operations={operations}
              days={days}
              columnWidth={columnWidth}
            />
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

// Helper function to group operations into non-overlapping rows
function groupOperationsIntoRows(operations: Operation[], startDate: Date): Operation[][] {
  const sorted = [...operations].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )

  const rows: Operation[][] = []

  sorted.forEach((op) => {
    const opDate = format(parseISO(op.dateTime), "yyyy-MM-dd")

    // Find row where this operation fits without overlap
    let placed = false
    for (const row of rows) {
      const hasConflict = row.some((existingOp) => {
        // Check if same day
        return format(parseISO(existingOp.dateTime), "yyyy-MM-dd") === opDate
      })
      if (!hasConflict) {
        row.push(op)
        placed = true
        break
      }
    }
    if (!placed) {
      rows.push([op])
    }
  })

  return rows
}
