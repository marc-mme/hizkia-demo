"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Download,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react"
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OperationStatus } from "@/data/operations"
import type { CrewMember } from "@/data/crew"

export type ViewMode = "day" | "week" | "month"

export interface Filters {
  status: OperationStatus | "all"
  client: string | "all"
  crew: string | "all"
}

interface TimelineToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  currentDate: Date
  onDateChange: (date: Date) => void
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  uniqueClients: string[]
  crewMembers: CrewMember[]
  showResourceOverlay: boolean
  onResourceOverlayToggle: (show: boolean) => void
}

export function TimelineToolbar({
  viewMode,
  onViewModeChange,
  currentDate,
  onDateChange,
  filters,
  onFiltersChange,
  uniqueClients,
  crewMembers,
  showResourceOverlay,
  onResourceOverlayToggle,
}: TimelineToolbarProps) {
  const t = useTranslations("planningView.toolbar")
  const tCommon = useTranslations("common")
  const hasActiveFilters =
    filters.status !== "all" || filters.client !== "all" || filters.crew !== "all"

  const handlePrev = () => {
    if (viewMode === "day") onDateChange(subDays(currentDate, 1))
    else if (viewMode === "week") onDateChange(subWeeks(currentDate, 1))
    else onDateChange(subMonths(currentDate, 1))
  }

  const handleNext = () => {
    if (viewMode === "day") onDateChange(addDays(currentDate, 1))
    else if (viewMode === "week") onDateChange(addWeeks(currentDate, 1))
    else onDateChange(addMonths(currentDate, 1))
  }

  const goToToday = () => onDateChange(new Date())

  const formatDateRange = () => {
    if (viewMode === "day") return format(currentDate, "EEEE, MMM d, yyyy")
    if (viewMode === "week") {
      const start = currentDate
      const end = addDays(currentDate, 6)
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
    }
    return format(currentDate, "MMMM yyyy")
  }

  const clearFilters = () => {
    onFiltersChange({ status: "all", client: "all", crew: "all" })
  }

  const showComingSoonToast = (type: string) => {
    // Simple alert for demo - in production, use a toast library
    alert(`${type} export coming soon!`)
  }

  return (
    <div className="flex items-center justify-between gap-4 p-3 glass rounded-xl">
      {/* Left side: Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="glass-subtle h-9 w-9"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[180px] text-center">
          {formatDateRange()}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="glass-subtle h-9 w-9"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="glass-subtle"
          onClick={goToToday}
        >
          {t("today")}
        </Button>
      </div>

      {/* Right side: Menus */}
      <div className="flex items-center gap-2">
        {/* View Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="glass-subtle">
              <Calendar className="h-4 w-4 mr-2" />
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass">
            <DropdownMenuLabel>{t("viewMode")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={viewMode}
              onValueChange={(v) => onViewModeChange(v as ViewMode)}
            >
              <DropdownMenuRadioItem value="day">{t("dayView")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">{t("weekView")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="month">{t("monthView")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filters Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="glass-subtle">
              <Filter className="h-4 w-4 mr-2" />
              {t("filters")}
              {hasActiveFilters && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-gold text-background">
                  !
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass w-56">
            <DropdownMenuLabel>{tCommon("labels.status")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.status}
              onValueChange={(v) =>
                onFiltersChange({ ...filters, status: v as OperationStatus | "all" })
              }
            >
              <DropdownMenuRadioItem value="all">{t("allStatuses")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="visible">{tCommon("status.visible")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ready">{tCommon("status.ready")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="in_progress">{tCommon("status.inProgress")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">{tCommon("status.completed")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>{tCommon("labels.client")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.client}
              onValueChange={(v) => onFiltersChange({ ...filters, client: v })}
            >
              <DropdownMenuRadioItem value="all">{t("allClients")}</DropdownMenuRadioItem>
              {uniqueClients.map((client) => (
                <DropdownMenuRadioItem key={client} value={client}>
                  {client}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>{tCommon("labels.crew")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={filters.crew}
              onValueChange={(v) => onFiltersChange({ ...filters, crew: v })}
            >
              <DropdownMenuRadioItem value="all">{t("allCrew")}</DropdownMenuRadioItem>
              {crewMembers.map((member) => (
                <DropdownMenuRadioItem key={member.id} value={member.id}>
                  {member.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} className="text-status-urgent">
                  <X className="h-4 w-4 mr-2" />
                  {t("clearAllFilters")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resource Overlay Toggle */}
        <Button
          variant={showResourceOverlay ? "default" : "outline"}
          size="sm"
          className={cn(
            showResourceOverlay ? "bg-gold text-background hover:bg-gold/90" : "glass-subtle"
          )}
          onClick={() => onResourceOverlayToggle(!showResourceOverlay)}
        >
          <Layers className="h-4 w-4 mr-2" />
          {t("resources")}
        </Button>

        {/* Export Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="glass-subtle">
              <Download className="h-4 w-4 mr-2" />
              {t("export")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass">
            <DropdownMenuItem onClick={() => showComingSoonToast("PDF")}>
              <FileText className="h-4 w-4 mr-2" />
              {t("exportPdf")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showComingSoonToast("Excel")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {t("exportExcel")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
