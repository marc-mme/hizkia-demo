"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { differenceInDays, startOfDay, isWithinInterval, addDays } from "date-fns"
import type { ViewMode } from "./timeline-toolbar"

interface TodayMarkerProps {
  startDate: Date
  endDate: Date
  columnWidth: number
  viewMode: ViewMode
}

export function TodayMarker({ startDate, endDate, columnWidth, viewMode }: TodayMarkerProps) {
  const today = new Date()
  const todayStart = startOfDay(today)

  // Only show if today is within the visible range
  const isVisible = isWithinInterval(todayStart, {
    start: startOfDay(startDate),
    end: startOfDay(addDays(endDate, 1)),
  })

  if (!isVisible) return null

  const dayOffset = differenceInDays(todayStart, startOfDay(startDate))
  const leftPosition = 180 + dayOffset * columnWidth + columnWidth / 2

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute top-0 bottom-0 w-0.5 bg-gold z-20 pointer-events-none"
      style={{ left: leftPosition }}
    >
      {/* Today label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-gold text-background text-xs font-medium whitespace-nowrap">
        Today
      </div>
    </motion.div>
  )
}
