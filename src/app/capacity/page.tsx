"use client"

import * as React from "react"
import { operations } from "@/data/operations"
import { crew } from "@/data/crew"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, addDays, startOfWeek, eachDayOfInterval } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Truck,
  Calendar,
  Clock,
} from "lucide-react"

type ViewMode = "week" | "day"

interface TimeSlot {
  hour: number
  operations: typeof operations
}

export default function CapacityPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [hoveredSlot, setHoveredSlot] = React.useState<string | null>(null)

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  })

  const hours = Array.from({ length: 12 }, (_, i) => i + 7) // 07:00 - 18:00

  const getOperationsForSlot = (date: Date, hour: number) => {
    return operations.filter((op) => {
      const opDate = new Date(op.dateTime)
      return (
        opDate.getDate() === date.getDate() &&
        opDate.getMonth() === date.getMonth() &&
        opDate.getHours() === hour
      )
    })
  }

  const getSlotColor = (count: number) => {
    if (count === 0) return "bg-transparent"
    if (count === 1) return "bg-status-ready/30"
    if (count === 2) return "bg-status-visible/30"
    return "bg-status-urgent/30"
  }

  const totalCapacity = crew.filter((c) => c.available).length * 2 // 2 ops per crew
  const usedCapacity = operations.filter((op) => op.status !== "completed").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Capacity Overview</h1>
          <p className="text-muted-foreground">
            Resource utilization and scheduling
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg overflow-hidden border border-glass-border">
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className={viewMode === "week" ? "bg-gold text-background" : ""}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className={viewMode === "day" ? "bg-gold text-background" : ""}
            >
              Day
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="glass-subtle"
              onClick={() =>
                setCurrentDate(addDays(currentDate, viewMode === "week" ? -7 : -1))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {viewMode === "week"
                ? `${format(weekStart, "MMM d")} - ${format(
                    addDays(weekStart, 6),
                    "MMM d"
                  )}`
                : format(currentDate, "EEEE, MMM d")}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="glass-subtle"
              onClick={() =>
                setCurrentDate(addDays(currentDate, viewMode === "week" ? 7 : 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Capacity Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            icon: Calendar,
            label: "Total Slots",
            value: hours.length * (viewMode === "week" ? 7 : 1),
            color: "text-muted-foreground",
          },
          {
            icon: Users,
            label: "Available Crew",
            value: crew.filter((c) => c.available).length,
            color: "text-gold",
          },
          {
            icon: Truck,
            label: "Vehicles Ready",
            value: 4,
            color: "text-status-info",
          },
          {
            icon: Clock,
            label: "Utilization",
            value: `${Math.round((usedCapacity / totalCapacity) * 100)}%`,
            color:
              usedCapacity / totalCapacity > 0.8
                ? "text-status-urgent"
                : "text-status-ready",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-subtle">
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center bg-accent/50",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Calendar Grid */}
      <Card className="glass">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-glass-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <div className="p-3 text-sm font-medium text-muted-foreground">
                  Time
                </div>
                {(viewMode === "week" ? weekDays : [currentDate]).map((day) => (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "p-3 text-center border-l border-glass-border",
                      format(day, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd") && "bg-gold/10"
                    )}
                  >
                    <p className="text-sm font-medium">{format(day, "EEE")}</p>
                    <p className="text-lg font-bold">{format(day, "d")}</p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-glass-border/50"
                >
                  <div className="p-3 text-sm text-muted-foreground">
                    {`${hour.toString().padStart(2, "0")}:00`}
                  </div>
                  {(viewMode === "week" ? weekDays : [currentDate]).map((day) => {
                    const slotOps = getOperationsForSlot(day, hour)
                    const slotKey = `${format(day, "yyyy-MM-dd")}-${hour}`
                    return (
                      <div
                        key={slotKey}
                        className={cn(
                          "p-2 border-l border-glass-border/50 min-h-[60px] transition-colors cursor-pointer",
                          getSlotColor(slotOps.length),
                          hoveredSlot === slotKey && "ring-2 ring-gold ring-inset"
                        )}
                        onMouseEnter={() => setHoveredSlot(slotKey)}
                        onMouseLeave={() => setHoveredSlot(null)}
                      >
                        {slotOps.map((op) => (
                          <motion.div
                            key={op.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-xs p-1.5 rounded bg-gold/20 text-gold mb-1 truncate"
                          >
                            {op.client}
                          </motion.div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-transparent border border-glass-border" />
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-status-ready/30" />
          <span>1 Operation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-status-visible/30" />
          <span>2 Operations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-status-urgent/30" />
          <span>3+ Operations</span>
        </div>
      </div>
    </div>
  )
}
