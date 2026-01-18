"use client"

import * as React from "react"
import { operations, type Operation, type OperationStatus } from "@/data/operations"
import { crew } from "@/data/crew"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type SortField = "dateTime" | "client" | "status"
type SortOrder = "asc" | "desc"

export default function PlanningPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<OperationStatus | "all">("all")
  const [sortField, setSortField] = React.useState<SortField>("dateTime")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("asc")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [ops, setOps] = React.useState(operations)

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
  }, [ops, searchQuery, statusFilter, sortField, sortOrder])

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
          <h1 className="text-2xl font-bold">Planning Status</h1>
          <p className="text-muted-foreground">
            Manage and track all scheduled operations
          </p>
        </div>
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
                <p className="text-sm text-muted-foreground">Visible</p>
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
                <p className="text-sm text-muted-foreground">Ready</p>
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
                <p className="text-sm text-muted-foreground">In Progress</p>
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
                <p className="text-sm text-muted-foreground">Completed</p>
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, ID, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 glass-subtle"
          />
        </div>
        <Button
          variant="outline"
          className="glass-subtle"
          onClick={() => {
            setSearchQuery("")
            setStatusFilter("all")
          }}
        >
          Clear Filters
        </Button>
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
                    Date/Time
                    <SortIcon field="dateTime" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("client")}
                >
                  <div className="flex items-center gap-1">
                    Client
                    <SortIcon field="client" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Crew
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
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
                        <Badge variant="outline" className="capitalize">
                          {op.type}
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
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="glass-subtle"
                            >
                              Update Status
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(op.id, "visible")
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2 text-status-visible" />
                              Mark Visible
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(op.id, "ready")
                              }}
                            >
                              <Check className="h-4 w-4 mr-2 text-status-ready" />
                              Mark Ready
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(op.id, "in_progress")
                              }}
                            >
                              <Truck className="h-4 w-4 mr-2 text-status-info" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                updateStatus(op.id, "completed")
                              }}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Mark Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                                    Pickup
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-status-visible" />
                                    {op.location.pickup}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Delivery
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
                                    Notes
                                  </p>
                                  <p className="text-sm">{op.notes}</p>
                                </div>
                                {op.specialRequirements && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                      Requirements
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
                                    Assigned Crew
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
            No operations found matching your filters.
          </div>
        )}
      </Card>
    </div>
  )
}
