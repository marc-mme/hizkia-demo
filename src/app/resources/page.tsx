"use client"

import * as React from "react"
import { operations, type Operation } from "@/data/operations"
import { crew, type CrewMember } from "@/data/crew"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  Award,
  Phone,
  Calendar,
  Truck,
} from "lucide-react"

type MatchLevel = "full" | "partial" | "conflict"

interface CrewMatch {
  member: CrewMember
  matchLevel: MatchLevel
  matchReason?: string
  missingCerts?: string[]
}

export default function ResourcesPage() {
  const [selectedOp, setSelectedOp] = React.useState<Operation | null>(null)
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false)
  const [selectedCrew, setSelectedCrew] = React.useState<CrewMember | null>(null)
  const [opsList, setOpsList] = React.useState(operations)

  // Filter unassigned or partially assigned operations
  const unassignedOps = opsList.filter(
    (op) => op.status === "visible" || (op.status === "ready" && op.crew.length < 2)
  )

  const getCrewMatches = (op: Operation): CrewMatch[] => {
    const requiredCerts = op.specialRequirements || []

    return crew.map((member) => {
      // Check availability
      if (!member.available) {
        return {
          member,
          matchLevel: "conflict" as MatchLevel,
          matchReason: "Not available today",
        }
      }

      // Check if already assigned to too many ops
      if (member.todayOps >= 3) {
        return {
          member,
          matchLevel: "conflict" as MatchLevel,
          matchReason: "Overloaded (3+ operations today)",
        }
      }

      // Check certifications
      const memberCerts = member.certifications
      const missingCerts = requiredCerts.filter(
        (cert) => !memberCerts.includes(cert)
      )

      if (missingCerts.length === 0 && requiredCerts.length > 0) {
        return {
          member,
          matchLevel: "full" as MatchLevel,
          matchReason: "Fully qualified",
        }
      } else if (missingCerts.length > 0 && missingCerts.length < requiredCerts.length) {
        return {
          member,
          matchLevel: "partial" as MatchLevel,
          matchReason: `Missing: ${missingCerts.join(", ")}`,
          missingCerts,
        }
      } else if (requiredCerts.length === 0) {
        return {
          member,
          matchLevel: "full" as MatchLevel,
          matchReason: "Available",
        }
      } else {
        return {
          member,
          matchLevel: "partial" as MatchLevel,
          matchReason: `Missing: ${missingCerts.join(", ")}`,
          missingCerts,
        }
      }
    })
  }

  const sortedMatches = selectedOp
    ? getCrewMatches(selectedOp).sort((a, b) => {
        const order = { full: 0, partial: 1, conflict: 2 }
        return order[a.matchLevel] - order[b.matchLevel]
      })
    : []

  const handleAssign = () => {
    if (!selectedOp || !selectedCrew) return

    setOpsList((prev) =>
      prev.map((op) =>
        op.id === selectedOp.id
          ? {
              ...op,
              crew: [...op.crew, selectedCrew.id],
              status: "ready" as const,
            }
          : op
      )
    )

    setAssignDialogOpen(false)
    setSelectedCrew(null)
  }

  const MatchIcon = ({ level }: { level: MatchLevel }) => {
    switch (level) {
      case "full":
        return <CheckCircle className="h-5 w-5 text-status-ready" />
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-status-visible" />
      case "conflict":
        return <XCircle className="h-5 w-5 text-status-urgent" />
    }
  }

  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-10rem)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Resource Matching</h1>
          <p className="text-muted-foreground">
            Assign crew based on skills and availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel - Operations */}
          <Card className="glass overflow-hidden">
            <CardHeader className="border-b border-glass-border">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                Operations Requiring Assignment
                <Badge variant="secondary" className="ml-auto">
                  {unassignedOps.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {unassignedOps.map((op) => {
                    const isSelected = selectedOp?.id === op.id
                    const assignedCrew = crew.filter((c) =>
                      op.crew.includes(c.id)
                    )

                    return (
                      <motion.div
                        key={op.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        layout
                      >
                        <Card
                          className={cn(
                            "cursor-pointer transition-all",
                            isSelected
                              ? "ring-2 ring-gold glass"
                              : "hover:bg-accent/50 glass-subtle"
                          )}
                          onClick={() => setSelectedOp(op)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold">{op.client}</p>
                                <p className="text-xs text-muted-foreground">
                                  {op.id}
                                </p>
                              </div>
                              <Badge variant="outline" className="capitalize">
                                {op.type}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(op.dateTime), "MMM d, HH:mm")}
                              </span>
                            </div>

                            {op.specialRequirements &&
                              op.specialRequirements.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
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
                              )}

                            <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                              <div className="flex -space-x-2">
                                {assignedCrew.map((c) => (
                                  <div
                                    key={c.id}
                                    className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-xs font-semibold text-black border-2 border-background"
                                  >
                                    {c.avatar}
                                  </div>
                                ))}
                                {op.crew.length === 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    No crew assigned
                                  </span>
                                )}
                              </div>
                              {op.crew.length < 2 && (
                                <Badge className="bg-status-visible/20 text-status-visible border-status-visible/30 text-xs">
                                  Needs {2 - op.crew.length} more
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {unassignedOps.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-status-ready" />
                    <p>All operations are fully staffed!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Right Panel - Crew */}
          <Card className="glass overflow-hidden">
            <CardHeader className="border-b border-glass-border">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-gold" />
                Available Crew
                {selectedOp && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    for {selectedOp.client}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="p-4 space-y-3">
                {selectedOp ? (
                  sortedMatches.map((match) => {
                    const alreadyAssigned = selectedOp.crew.includes(
                      match.member.id
                    )

                    return (
                      <motion.div
                        key={match.member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "p-4 rounded-xl transition-all",
                          match.matchLevel === "full" && "glass-subtle",
                          match.matchLevel === "partial" &&
                            "glass-subtle border-status-visible/30",
                          match.matchLevel === "conflict" &&
                            "bg-muted/30 opacity-60"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-lg font-semibold text-black shrink-0">
                            {match.member.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">
                                {match.member.name}
                              </p>
                              <Tooltip>
                                <TooltipTrigger>
                                  <MatchIcon level={match.matchLevel} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {match.matchReason}
                                </TooltipContent>
                              </Tooltip>
                              {alreadyAssigned && (
                                <Badge className="bg-status-ready/20 text-status-ready border-status-ready/30 text-xs">
                                  Assigned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {match.member.role}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {match.member.certifications.map((cert) => {
                                const isMissing =
                                  match.missingCerts?.includes(cert)
                                return (
                                  <Badge
                                    key={cert}
                                    variant={isMissing ? "outline" : "secondary"}
                                    className={cn(
                                      "text-xs",
                                      !isMissing &&
                                        selectedOp.specialRequirements?.includes(
                                          cert
                                        ) &&
                                        "bg-status-ready/20 text-status-ready"
                                    )}
                                  >
                                    <Award className="h-3 w-3 mr-1" />
                                    {cert.replace("-", " ")}
                                  </Badge>
                                )
                              })}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                {match.member.todayOps} ops today
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={
                              match.matchLevel === "conflict" || alreadyAssigned
                            }
                            className={cn(
                              match.matchLevel === "full" &&
                                "bg-status-ready hover:bg-status-ready/90"
                            )}
                            onClick={() => {
                              setSelectedCrew(match.member)
                              setAssignDialogOpen(true)
                            }}
                          >
                            Assign
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an operation to see crew matches</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Assign Confirmation Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Confirm Assignment</DialogTitle>
            </DialogHeader>

            {selectedOp && selectedCrew && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Assign <strong>{selectedCrew.name}</strong> to{" "}
                  <strong>{selectedOp.client}</strong>?
                </p>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-accent/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Operation</p>
                    <p className="font-medium">{selectedOp.id}</p>
                    <p className="text-sm capitalize">{selectedOp.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date/Time</p>
                    <p className="font-medium">
                      {format(parseISO(selectedOp.dateTime), "MMM d, HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAssign}>Confirm Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
