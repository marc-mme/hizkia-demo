"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { operations, type Operation, type OperationStatus } from "@/data/operations"
import { crew } from "@/data/crew"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MissionModal } from "@/components/missions"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Truck,
  Users,
  MapPin,
  Clock,
  Check,
  Eye,
  Plus,
  CircleCheckBig,
  Building2,
  Tag,
  Activity,
  Settings,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SortField = "dateTime" | "client" | "status"
type SortOrder = "asc" | "desc"
type OperationType = "delivery" | "pickup" | "installation" | "auction"

export default function PlanningPage() {
  const t = useTranslations("planning")
  const tCommon = useTranslations("common")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<OperationStatus | "all">("all")
  const [typeFilter, setTypeFilter] = React.useState<OperationType | "all">("all")
  const [clientFilter, setClientFilter] = React.useState<string>("all")
  const [crewFilter, setCrewFilter] = React.useState<string>("all")
  const [sortField, setSortField] = React.useState<SortField>("dateTime")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [ops, setOps] = React.useState(operations)

  // Get unique clients for filter
  const uniqueClients = React.useMemo(() => {
    return [...new Set(ops.map((op) => op.client))].sort()
  }, [ops])

  // Check if any filter is active
  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all" || clientFilter !== "all" || crewFilter !== "all"

  // Mission modal state
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalClientId, setModalClientId] = React.useState<string>()
  const [modalClientName, setModalClientName] = React.useState<string>()

  const openNewMissionModal = (clientId?: string, clientName?: string) => {
    setModalClientId(clientId)
    setModalClientName(clientName)
    setModalOpen(true)
  }

  const statusCounts = React.useMemo(() => {
    return {
      visible: ops.filter((op) => op.status === "visible").length,
      ready: ops.filter((op) => op.status === "ready").length,
      in_progress: ops.filter((op) => op.status === "in_progress").length,
      completed: ops.filter((op) => op.status === "completed").length,
    }
  }, [ops])

  const filteredOps = React.useMemo(() => {
    let result = [...ops]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (op) =>
          op.client.toLowerCase().includes(query) ||
          op.id.toLowerCase().includes(query) ||
          op.type.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((op) => op.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter((op) => op.type === typeFilter)
    }

    // Filter by client
    if (clientFilter !== "all") {
      result = result.filter((op) => op.client === clientFilter)
    }

    // Filter by crew
    if (crewFilter !== "all") {
      result = result.filter((op) => op.crew.includes(crewFilter))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === "dateTime") {
        comparison = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      } else if (sortField === "client") {
        comparison = a.client.localeCompare(b.client)
      } else if (sortField === "status") {
        const statusOrder = { visible: 0, ready: 1, in_progress: 2, completed: 3 }
        comparison = statusOrder[a.status] - statusOrder[b.status]
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [ops, searchQuery, statusFilter, typeFilter, clientFilter, crewFilter, sortField, sortOrder])

  const clearAllFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setClientFilter("all")
    setCrewFilter("all")
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const updateStatus = (id: string, newStatus: OperationStatus) => {
    setOps((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: newStatus } : op))
    )
  }

  const getCrewNames = (crewIds: string[]) => {
    return crewIds
      .map((id) => crew.find((c) => c.id === id)?.name || id)
      .join(", ")
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button
          onClick={() => openNewMissionModal()}
          className="bg-gold text-background hover:bg-gold/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("newMission")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className={cn(
            "glass cursor-pointer transition-all",
            statusFilter === "visible" && "ring-2 ring-status-visible"
          )}
          onClick={() => setStatusFilter(statusFilter === "visible" ? "all" : "visible")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.visible")}</p>
                <p className="text-2xl font-bold text-status-visible">
                  {statusCounts.visible}
                </p>
              </div>
              <Eye className="h-8 w-8 text-status-visible/50" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "glass cursor-pointer transition-all",
            statusFilter === "ready" && "ring-2 ring-status-ready"
          )}
          onClick={() => setStatusFilter(statusFilter === "ready" ? "all" : "ready")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.ready")}</p>
                <p className="text-2xl font-bold text-status-ready">
                  {statusCounts.ready}
                </p>
              </div>
              <Check className="h-8 w-8 text-status-ready/50" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "glass cursor-pointer transition-all",
            statusFilter === "in_progress" && "ring-2 ring-status-info"
          )}
          onClick={() => setStatusFilter(statusFilter === "in_progress" ? "all" : "in_progress")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.inProgress")}</p>
                <p className="text-2xl font-bold text-status-info">
                  {statusCounts.in_progress}
                </p>
              </div>
              <Truck className="h-8 w-8 text-status-info/50" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "glass cursor-pointer transition-all",
            statusFilter === "completed" && "ring-2 ring-muted-foreground"
          )}
          onClick={() => setStatusFilter(statusFilter === "completed" ? "all" : "completed")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.completed")}</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {statusCounts.completed}
                </p>
              </div>
              <Check className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Search and Clear */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass-subtle"
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="glass-subtle"
              onClick={clearAllFilters}
            >
              {tCommon("actions.clearFilters")}
            </Button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OperationStatus | "all")}>
            <SelectTrigger className="w-[160px] glass-subtle">
              <SelectValue placeholder={t("filters.status")} />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              <SelectItem value="visible">{t("stats.visible")}</SelectItem>
              <SelectItem value="ready">{t("stats.ready")}</SelectItem>
              <SelectItem value="in_progress">{t("stats.inProgress")}</SelectItem>
              <SelectItem value="completed">{t("stats.completed")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as OperationType | "all")}>
            <SelectTrigger className="w-[160px] glass-subtle">
              <SelectValue placeholder={t("filters.type")} />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
              <SelectItem value="delivery">{t("filters.types.delivery")}</SelectItem>
              <SelectItem value="pickup">{t("filters.types.pickup")}</SelectItem>
              <SelectItem value="installation">{t("filters.types.installation")}</SelectItem>
              <SelectItem value="auction">{t("filters.types.auction")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Filter */}
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[200px] glass-subtle">
              <SelectValue placeholder={t("filters.client")} />
            </SelectTrigger>
            <SelectContent className="glass max-h-[300px]">
              <SelectItem value="all">{t("filters.allClients")}</SelectItem>
              {uniqueClients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Crew Filter */}
          <Select value={crewFilter} onValueChange={setCrewFilter}>
            <SelectTrigger className="w-[180px] glass-subtle">
              <SelectValue placeholder={t("filters.crew")} />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">{t("filters.allCrew")}</SelectItem>
              {crew.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("dateTime")}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t("table.dateTime")}
                    <SortIcon field="dateTime" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("client")}
                >
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {t("table.client")}
                    <SortIcon field="client" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {t("table.type")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {t("table.status")}
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {t("table.crew")}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-end gap-1">
                    <Settings className="h-4 w-4" />
                    {t("table.actions")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOps.map((op) => (
                  <React.Fragment key={op.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "border-b border-glass-border/50 cursor-pointer transition-colors",
                        expandedId === op.id
                          ? "bg-accent/50"
                          : "hover:bg-accent/30"
                      )}
                      onClick={() =>
                        setExpandedId(expandedId === op.id ? null : op.id)
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(parseISO(op.dateTime), "MMM d")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(op.dateTime), "HH:mm")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{op.client}</span>
                          <span className="text-xs text-muted-foreground">
                            {op.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {t(`filters.types.${op.type}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={op.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-2">
                          {op.crew.slice(0, 3).map((crewId) => {
                            const member = crew.find((c) => c.id === crewId)
                            return (
                              <div
                                key={crewId}
                                className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-xs font-semibold text-black border-2 border-background"
                                title={member?.name}
                              >
                                {member?.avatar}
                              </div>
                            )
                          })}
                          {op.crew.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                              +{op.crew.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              op.status === "visible"
                                ? "bg-status-visible/20 text-status-visible cursor-default"
                                : "hover:bg-status-visible/10 hover:text-status-visible"
                            )}
                            onClick={() => op.status !== "visible" && updateStatus(op.id, "visible")}
                            title={t("markVisible")}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              op.status === "ready"
                                ? "bg-status-ready/20 text-status-ready cursor-default"
                                : "hover:bg-status-ready/10 hover:text-status-ready"
                            )}
                            onClick={() => op.status !== "ready" && updateStatus(op.id, "ready")}
                            title={t("markReady")}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              op.status === "in_progress"
                                ? "bg-status-info/20 text-status-info cursor-default"
                                : "hover:bg-status-info/10 hover:text-status-info"
                            )}
                            onClick={() => op.status !== "in_progress" && updateStatus(op.id, "in_progress")}
                            title={t("markInProgress")}
                          >
                            <Truck className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-7 w-7",
                              op.status === "completed"
                                ? "bg-status-completed/20 text-status-completed cursor-default"
                                : "hover:bg-status-completed/10 hover:text-status-completed"
                            )}
                            onClick={() => op.status !== "completed" && updateStatus(op.id, "completed")}
                            title={t("markCompleted")}
                          >
                            <CircleCheckBig className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedId === op.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={6} className="px-4 py-4 bg-accent/30">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {t("expanded.pickup")}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-status-visible" />
                                    {op.location.pickup}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {t("expanded.delivery")}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-status-ready" />
                                    {op.location.delivery}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {t("expanded.notes")}
                                  </p>
                                  <p className="text-sm">{op.notes}</p>
                                </div>
                                {op.specialRequirements && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                      {t("expanded.requirements")}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {op.specialRequirements.map((req) => (
                                        <Badge
                                          key={req}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {req.replace("-", " ")}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {t("expanded.assignedCrew")}
                                  </p>
                                  <p className="text-sm">{getCrewNames(op.crew)}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredOps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t("noOperations")}
          </div>
        )}
      </Card>

      {/* Mission Modal */}
      <MissionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialClientId={modalClientId}
        initialClientName={modalClientName}
      />
    </div>
  )
}
