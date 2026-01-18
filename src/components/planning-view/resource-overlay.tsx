"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Operation } from "@/data/operations"
import type { CrewMember } from "@/data/crew"

interface ResourceOverlayProps {
  crew: CrewMember[]
  operations: Operation[]
  days: Date[]
  columnWidth: number
}

export function ResourceOverlay({
  crew,
  operations,
  days,
  columnWidth,
}: ResourceOverlayProps) {
  // Calculate crew availability per day
  const getCrewAvailabilityForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const opsOnDay = operations.filter((op) => op.dateTime.startsWith(dateStr))
    const busyCrew = new Set(opsOnDay.flatMap((op) => op.crew))
    const availableCrew = crew.filter((c) => c.available && !busyCrew.has(c.id))
    const totalAvailable = crew.filter((c) => c.available).length

    return {
      available: availableCrew.length,
      busy: busyCrew.size,
      total: totalAvailable,
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t-2 border-gold/30 bg-gold/5"
    >
      {/* Header */}
      <div className="flex items-center h-10 border-b border-glass-border/50">
        <div className="w-[180px] shrink-0 px-4 text-xs font-semibold text-gold uppercase tracking-wider">
          Crew Availability
        </div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="text-center text-xs text-muted-foreground border-r border-glass-border/30"
            style={{ width: columnWidth }}
          >
            {format(day, "EEE")}
          </div>
        ))}
      </div>

      {/* Availability bars */}
      <div className="flex items-center h-14">
        <div className="w-[180px] shrink-0 px-4 text-xs text-muted-foreground">
          Available / Total
        </div>
        {days.map((day) => {
          const { available, total } = getCrewAvailabilityForDay(day)
          const percentage = total > 0 ? (available / total) * 100 : 0

          return (
            <div
              key={day.toISOString()}
              className="flex flex-col items-center justify-center gap-1 border-r border-glass-border/30"
              style={{ width: columnWidth }}
            >
              <div className="h-4 w-3/4 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full transition-colors",
                    percentage > 50
                      ? "bg-status-ready"
                      : percentage > 25
                        ? "bg-status-visible"
                        : "bg-status-urgent"
                  )}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {available}/{total}
              </span>
            </div>
          )
        })}
      </div>

      {/* Crew list */}
      <div className="px-4 py-3 border-t border-glass-border/50">
        <div className="flex flex-wrap gap-2">
          {crew.map((member) => (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-full text-xs",
                member.available
                  ? "bg-status-ready/20 text-status-ready"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold",
                  member.available ? "bg-status-ready text-white" : "bg-muted-foreground text-background"
                )}
              >
                {member.avatar}
              </div>
              <span>{member.name}</span>
              {member.todayOps > 0 && (
                <span className="text-muted-foreground">({member.todayOps} ops)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
