"use client"

import * as React from "react"
import { slips, type TransportSlip, type SlipStatus } from "@/data/slips"
import { crew } from "@/data/crew"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format, parseISO, differenceInMinutes } from "date-fns"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import {
  FileText,
  Clock,
  Printer,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react"

const columnConfig: Record<
  SlipStatus,
  { title: string; icon: typeof FileText; color: string }
> = {
  created: {
    title: "Created",
    icon: FileText,
    color: "text-status-visible",
  },
  validated: {
    title: "Validated",
    icon: CheckCircle,
    color: "text-status-info",
  },
  printed: {
    title: "Printed",
    icon: Printer,
    color: "text-status-ready",
  },
}

interface SlipCardProps {
  slip: TransportSlip
  onClick: () => void
}

function SlipCard({ slip, onClick }: SlipCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slip.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dueDate = parseISO(slip.dueTime)
  const now = new Date()
  const minutesUntilDue = differenceInMinutes(dueDate, now)
  const isOverdue = minutesUntilDue < 0
  const isUrgent = minutesUntilDue > 0 && minutesUntilDue < 120

  const assignedCrew = crew.find((c) => c.id === slip.assignedTo)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-subtle p-4 cursor-grab active:cursor-grabbing transition-all",
        isDragging && "opacity-50 scale-105 shadow-xl",
        isOverdue && "border-status-urgent ring-1 ring-status-urgent/50",
        isUrgent && !isOverdue && "border-status-visible ring-1 ring-status-visible/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">{slip.id}</p>
          <p className="text-xs text-muted-foreground">{slip.operationId}</p>
        </div>
        {isOverdue ? (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        ) : isUrgent ? (
          <Badge className="bg-status-visible/20 text-status-visible border-status-visible/30 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(minutesUntilDue / 60)}h {minutesUntilDue % 60}m
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {format(dueDate, "HH:mm")}
          </Badge>
        )}
      </div>

      <p className="font-medium mb-2">{slip.client}</p>
      <Badge variant="secondary" className="text-xs capitalize mb-3">
        {slip.operationType}
      </Badge>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-glass-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {assignedCrew?.name || slip.assignedTo}
        </div>
      </div>
    </motion.div>
  )
}

interface SlipCardOverlayProps {
  slip: TransportSlip
}

function SlipCardOverlay({ slip }: SlipCardOverlayProps) {
  return (
    <div className="glass p-4 shadow-2xl rotate-3 scale-105">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm">{slip.id}</p>
          <p className="text-xs text-muted-foreground">{slip.operationId}</p>
        </div>
      </div>
      <p className="font-medium">{slip.client}</p>
    </div>
  )
}

interface ColumnProps {
  status: SlipStatus
  slips: TransportSlip[]
  onSlipClick: (slip: TransportSlip) => void
}

function Column({ status, slips, onSlipClick }: ColumnProps) {
  const config = columnConfig[status]
  const Icon = config.icon

  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("h-5 w-5", config.color)} />
        <h3 className="font-semibold">{config.title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {slips.length}
        </Badge>
      </div>

      <SortableContext
        items={slips.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[400px] p-2 rounded-xl bg-accent/30">
          {slips.map((slip) => (
            <SlipCard
              key={slip.id}
              slip={slip}
              onClick={() => onSlipClick(slip)}
            />
          ))}
          {slips.length === 0 && (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No slips
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function SlipsPage() {
  const [slipList, setSlipList] = React.useState(slips)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [selectedSlip, setSelectedSlip] = React.useState<TransportSlip | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = React.useMemo(() => {
    return {
      created: slipList.filter((s) => s.status === "created"),
      validated: slipList.filter((s) => s.status === "validated"),
      printed: slipList.filter((s) => s.status === "printed"),
    }
  }, [slipList])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeSlip = slipList.find((s) => s.id === active.id)
    if (!activeSlip) return

    // Determine target column based on where the slip was dropped
    const overSlip = slipList.find((s) => s.id === over.id)
    let targetStatus: SlipStatus

    if (overSlip) {
      targetStatus = overSlip.status
    } else {
      // Dropped on empty column area - determine from over.id or container
      return
    }

    if (activeSlip.status !== targetStatus) {
      setSlipList((prev) =>
        prev.map((s) =>
          s.id === active.id
            ? {
                ...s,
                status: targetStatus,
                validatedAt:
                  targetStatus === "validated" || targetStatus === "printed"
                    ? s.validatedAt || new Date().toISOString()
                    : s.validatedAt,
                printedAt:
                  targetStatus === "printed"
                    ? new Date().toISOString()
                    : s.printedAt,
              }
            : s
        )
      )
    }
  }

  const activeSlip = slipList.find((s) => s.id === activeId)
  const overdueCount = slipList.filter((s) => {
    const due = parseISO(s.dueTime)
    return differenceInMinutes(due, new Date()) < 0 && s.status !== "printed"
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transport Slip Pipeline</h1>
          <p className="text-muted-foreground">
            Track slips through creation to printing
          </p>
        </div>
        {overdueCount > 0 && (
          <Badge variant="destructive" className="text-sm py-1 px-3">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {overdueCount} overdue slip{overdueCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {(["created", "validated", "printed"] as SlipStatus[]).map(
            (status) => (
              <Column
                key={status}
                status={status}
                slips={columns[status]}
                onSlipClick={setSelectedSlip}
              />
            )
          )}
        </div>

        <DragOverlay>
          {activeSlip ? <SlipCardOverlay slip={activeSlip} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Slip Detail Modal */}
      <Dialog open={!!selectedSlip} onOpenChange={() => setSelectedSlip(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              {selectedSlip?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedSlip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Operation</p>
                  <p className="font-medium">{selectedSlip.operationId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedSlip.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedSlip.operationType}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Time</p>
                  <p className="font-medium">
                    {format(parseISO(selectedSlip.dueTime), "MMM d, HH:mm")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-glass-border">
                <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-status-visible" />
                    <span>Created:</span>
                    <span className="text-muted-foreground">
                      {format(parseISO(selectedSlip.createdAt), "MMM d, HH:mm")}
                    </span>
                  </div>
                  {selectedSlip.validatedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-status-info" />
                      <span>Validated:</span>
                      <span className="text-muted-foreground">
                        {format(
                          parseISO(selectedSlip.validatedAt),
                          "MMM d, HH:mm"
                        )}
                      </span>
                    </div>
                  )}
                  {selectedSlip.printedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Printer className="h-4 w-4 text-status-ready" />
                      <span>Printed:</span>
                      <span className="text-muted-foreground">
                        {format(
                          parseISO(selectedSlip.printedAt),
                          "MMM d, HH:mm"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedSlip.status === "created" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSlipList((prev) =>
                        prev.map((s) =>
                          s.id === selectedSlip.id
                            ? {
                                ...s,
                                status: "validated",
                                validatedAt: new Date().toISOString(),
                              }
                            : s
                        )
                      )
                      setSelectedSlip(null)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validate
                  </Button>
                )}
                {selectedSlip.status === "validated" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSlipList((prev) =>
                        prev.map((s) =>
                          s.id === selectedSlip.id
                            ? {
                                ...s,
                                status: "printed",
                                printedAt: new Date().toISOString(),
                              }
                            : s
                        )
                      )
                      setSelectedSlip(null)
                    }}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Mark as Printed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
