"use client"

import * as React from "react"
import { format, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import type { ViewMode } from "./timeline-toolbar"

interface TimelineHeaderProps {
  days: Date[]
  viewMode: ViewMode
  columnWidth: number
}

export function TimelineHeader({ days, viewMode, columnWidth }: TimelineHeaderProps) {
  return (
    <div className="flex border-b border-glass-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      {/* Label column */}
      <div className="w-[180px] shrink-0 px-4 py-3 border-r border-glass-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Operations
        </span>
      </div>

      {/* Day columns */}
      {days.map((day) => {
        const today = isToday(day)
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex flex-col items-center justify-center py-2 border-r border-glass-border/50",
              today && "bg-gold/10"
            )}
            style={{ width: columnWidth }}
          >
            <span
              className={cn(
                "text-xs font-medium",
                today ? "text-gold" : "text-muted-foreground"
              )}
            >
              {viewMode === "month" ? format(day, "d") : format(day, "EEE")}
            </span>
            {viewMode !== "month" && (
              <span
                className={cn(
                  "text-sm font-semibold",
                  today ? "text-gold" : "text-foreground"
                )}
              >
                {format(day, "d")}
              </span>
            )}
            {viewMode === "day" && (
              <span className="text-xs text-muted-foreground">
                {format(day, "MMM yyyy")}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
