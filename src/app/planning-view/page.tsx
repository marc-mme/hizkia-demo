"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { operations } from "@/data/operations"
import { crew } from "@/data/crew"
import {
  GanttTimeline,
  TimelineToolbar,
  OperationDetailSheet,
} from "@/components/planning-view"
import type { ViewMode, Filters } from "@/components/planning-view/timeline-toolbar"
import type { Operation, OperationStatus } from "@/data/operations"
import { motion } from "framer-motion"

export default function PlanningViewPage() {
  const t = useTranslations("planningView")
  const [viewMode, setViewMode] = React.useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [filters, setFilters] = React.useState<Filters>({
    status: "all",
    client: "all",
    crew: "all",
  })
  const [showResourceOverlay, setShowResourceOverlay] = React.useState(false)
  const [selectedOperation, setSelectedOperation] = React.useState<Operation | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Filtered operations based on current filters
  const filteredOperations = React.useMemo(() => {
    return operations.filter((op) => {
      if (filters.status !== "all" && op.status !== filters.status) return false
      if (filters.client !== "all" && op.client !== filters.client) return false
      if (filters.crew !== "all" && !op.crew.includes(filters.crew)) return false
      return true
    })
  }, [filters])

  // Unique clients for filter dropdown
  const uniqueClients = React.useMemo(() => {
    return [...new Set(operations.map((op) => op.client))]
  }, [])

  const handleOperationClick = (op: Operation) => {
    setSelectedOperation(op)
    setSheetOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-10rem)] gap-4"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("description")}
        </p>
      </div>

      {/* Toolbar */}
      <TimelineToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        filters={filters}
        onFiltersChange={setFilters}
        uniqueClients={uniqueClients}
        crewMembers={crew}
        showResourceOverlay={showResourceOverlay}
        onResourceOverlayToggle={setShowResourceOverlay}
      />

      {/* Timeline */}
      <GanttTimeline
        operations={filteredOperations}
        viewMode={viewMode}
        currentDate={currentDate}
        showResourceOverlay={showResourceOverlay}
        crew={crew}
        onOperationClick={handleOperationClick}
      />

      {/* Operation Detail Sheet */}
      <OperationDetailSheet
        operation={selectedOperation}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        crew={crew}
      />
    </motion.div>
  )
}
