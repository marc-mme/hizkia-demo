"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format, parseISO } from "date-fns"
import {
  Clock,
  MapPin,
  Truck,
  AlertTriangle,
  ArrowRight,
  Phone,
  User,
  Calendar,
  Route,
  Thermometer,
  Droplets,
  Shield,
  FileText,
  Package,
  History,
  Euro,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Operation } from "@/data/operations"
import type { CrewMember } from "@/data/crew"

interface OperationDetailSheetProps {
  operation: Operation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  crew: CrewMember[]
}

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-status-urgent text-white", icon: Zap },
  high: { label: "High", color: "bg-orange-500 text-white", icon: AlertCircle },
  normal: { label: "Normal", color: "bg-blue-500 text-white", icon: Info },
  low: { label: "Low", color: "bg-slate-400 text-white", icon: CheckCircle2 },
}

const requirementIcons: Record<string, string> = {
  "climate-control": "🌡️",
  "fragile-handling": "⚠️",
  "white-gloves": "🧤",
  "security-escort": "🛡️",
  "insurance-verified": "✅",
  "gps-tracking": "📍",
  "oversized-transport": "📦",
  "installation-crew": "👷",
  "crane-required": "🏗️",
  "heavy-lift": "💪",
  "secure-strapping": "🔗",
  "customs-cleared": "🛃",
  "customs-documentation": "📋",
  "crate-inspection": "🔍",
  "light-sensitive": "💡",
  "artist-present": "🎨",
  "weather-dependent": "🌤️",
  "multi-vehicle": "🚛",
  "armed-transport": "🔫",
  "nda-required": "📝",
  "diplomatic-clearance": "🏛️",
}

export function OperationDetailSheet({
  operation,
  open,
  onOpenChange,
  crew,
}: OperationDetailSheetProps) {
  const [copiedId, setCopiedId] = React.useState(false)

  if (!operation) return null

  const assignedCrew = crew.filter((c) => operation.crew.includes(c.id))
  const priority = priorityConfig[operation.priority]
  const PriorityIcon = priority.icon

  const copyOperationId = () => {
    navigator.clipboard.writeText(operation.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0 border-l border-glass-border bg-background/95 backdrop-blur-xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-glass-border bg-gradient-to-br from-gold/10 to-transparent">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold truncate">{operation.client}</SheetTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <button
                    onClick={copyOperationId}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="font-mono">{operation.id}</span>
                    {copiedId ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  {operation.reference && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-gold">{operation.reference}</span>
                    </>
                  )}
                </div>
              </div>
              <StatusBadge status={operation.status} />
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("flex items-center gap-1", priority.color)}>
                <PriorityIcon className="h-3 w-3" />
                {priority.label}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {operation.type}
              </Badge>
              {operation.insuranceValue && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {operation.insuranceValue}
                </Badge>
              )}
            </div>
          </SheetHeader>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="flex-1">
          <div className="px-6 pt-2 border-b border-glass-border">
            <TabsList className="w-full grid grid-cols-4 h-10 bg-transparent gap-1">
              <TabsTrigger value="details" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Details
              </TabsTrigger>
              <TabsTrigger value="artworks" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Artworks
              </TabsTrigger>
              <TabsTrigger value="logistics" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Logistics
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)]">
            {/* Details Tab */}
            <TabsContent value="details" className="p-6 space-y-6 mt-0">
              {/* Schedule */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-accent/30 border border-glass-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Start</p>
                    <p className="font-medium">{format(parseISO(operation.dateTime), "MMM d, yyyy")}</p>
                    <p className="text-sm text-gold">{format(parseISO(operation.dateTime), "HH:mm")}</p>
                  </div>
                  {operation.endTime && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">End</p>
                      <p className="font-medium">{format(parseISO(operation.endTime), "MMM d, yyyy")}</p>
                      <p className="text-sm text-gold">{format(parseISO(operation.endTime), "HH:mm")}</p>
                    </div>
                  )}
                </div>
                {operation.estimatedDuration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated duration: <span className="text-foreground font-medium">{operation.estimatedDuration}</span></span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Locations */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Locations
                </h4>
                <div className="space-y-3">
                  {/* Pickup */}
                  <div className="p-4 rounded-xl bg-status-visible/10 border border-status-visible/30">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-status-visible">PICKUP</p>
                      {operation.location.pickupContact && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {operation.location.pickupContact}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium">{operation.location.pickup}</p>
                    {operation.location.pickupNotes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{operation.location.pickupNotes}</p>
                    )}
                  </div>

                  <div className="flex justify-center py-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-8 h-px bg-glass-border" />
                      <ArrowRight className="h-4 w-4" />
                      {operation.distance && <span className="text-xs">{operation.distance}</span>}
                      <div className="w-8 h-px bg-glass-border" />
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="p-4 rounded-xl bg-status-ready/10 border border-status-ready/30">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-status-ready">DELIVERY</p>
                      {operation.location.deliveryContact && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {operation.location.deliveryContact}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium">{operation.location.delivery}</p>
                    {operation.location.deliveryNotes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{operation.location.deliveryNotes}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Client Contact */}
              {(operation.clientContact || operation.clientPhone) && (
                <>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Client Contact
                    </h4>
                    <div className="p-4 rounded-xl bg-accent/30 border border-glass-border">
                      {operation.clientContact && (
                        <p className="font-medium">{operation.clientContact}</p>
                      )}
                      {operation.clientPhone && (
                        <a
                          href={`tel:${operation.clientPhone}`}
                          className="flex items-center gap-2 text-sm text-gold hover:underline mt-1"
                        >
                          <Phone className="h-3 w-3" />
                          {operation.clientPhone}
                        </a>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Notes */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </h4>
                <div className="p-4 rounded-xl bg-accent/30 border border-glass-border space-y-3">
                  <p className="text-sm">{operation.notes}</p>
                  {operation.internalNotes && (
                    <div className="pt-3 border-t border-glass-border">
                      <p className="text-xs font-semibold text-orange-500 mb-1">INTERNAL NOTE</p>
                      <p className="text-sm text-muted-foreground">{operation.internalNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requirements */}
              {operation.specialRequirements && operation.specialRequirements.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Special Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {operation.specialRequirements.map((req) => (
                        <Badge
                          key={req}
                          variant="secondary"
                          className="capitalize text-xs py-1 px-2"
                        >
                          <span className="mr-1">{requirementIcons[req] || "📌"}</span>
                          {req.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Artworks Tab */}
            <TabsContent value="artworks" className="p-6 space-y-4 mt-0">
              {operation.artworks && operation.artworks.length > 0 ? (
                operation.artworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="p-4 rounded-xl bg-accent/30 border border-glass-border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">{artwork.id}</p>
                        <p className="font-semibold">{artwork.title}</p>
                        <p className="text-sm text-gold">{artwork.artist}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {index + 1} / {operation.artworks!.length}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Medium</p>
                        <p>{artwork.medium}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dimensions</p>
                        <p>{artwork.dimensions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="font-semibold text-gold">{artwork.value}</p>
                      </div>
                      {artwork.insuranceRef && (
                        <div>
                          <p className="text-xs text-muted-foreground">Insurance Ref</p>
                          <p className="font-mono text-xs">{artwork.insuranceRef}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No artworks listed</p>
                </div>
              )}

              {/* Total Value */}
              {operation.insuranceValue && (
                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Insured Value</span>
                    <span className="text-lg font-bold text-gold">{operation.insuranceValue}</span>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Logistics Tab */}
            <TabsContent value="logistics" className="p-6 space-y-6 mt-0">
              {/* Crew */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned Crew ({assignedCrew.length})
                </h4>
                <div className="space-y-2">
                  {assignedCrew.length === 0 ? (
                    <div className="p-4 rounded-xl bg-accent/30 border border-glass-border text-center">
                      <p className="text-sm text-muted-foreground italic">No crew assigned</p>
                    </div>
                  ) : (
                    assignedCrew.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-glass-border"
                      >
                        <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-sm font-bold text-black">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.certifications.slice(0, 2).map((cert) => (
                            <Badge key={cert} variant="secondary" className="text-[10px] py-0">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Separator />

              {/* Vehicle */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehicle
                </h4>
                <div className="p-4 rounded-xl bg-accent/30 border border-glass-border">
                  <p className="font-medium font-mono">{operation.vehicle}</p>
                </div>
              </div>

              {/* Climate Requirements */}
              {(operation.temperature || operation.humidity) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Climate Requirements
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {operation.temperature && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Thermometer className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-muted-foreground">Temperature</span>
                          </div>
                          <p className="font-semibold">{operation.temperature}</p>
                        </div>
                      )}
                      {operation.humidity && (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Droplets className="h-4 w-4 text-cyan-500" />
                            <span className="text-xs text-muted-foreground">Humidity</span>
                          </div>
                          <p className="font-semibold">{operation.humidity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Route Info */}
              {operation.distance && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Route Information
                    </h4>
                    <div className="p-4 rounded-xl bg-accent/30 border border-glass-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="font-medium">{operation.distance}</span>
                      </div>
                      {operation.estimatedDuration && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">Est. Duration</span>
                          <span className="font-medium">{operation.estimatedDuration}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="p-6 mt-0">
              {operation.timeline && operation.timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-glass-border" />
                  <div className="space-y-4">
                    {operation.timeline.map((event, index) => (
                      <div key={event.id} className="relative pl-10">
                        <div className={cn(
                          "absolute left-2 w-4 h-4 rounded-full border-2 bg-background",
                          index === 0 ? "border-gold bg-gold" : "border-glass-border"
                        )} />
                        <div className="p-3 rounded-xl bg-accent/30 border border-glass-border">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-sm">{event.event}</p>
                            <p className="text-xs text-muted-foreground shrink-0">
                              {format(parseISO(event.timestamp), "MMM d, HH:mm")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">by {event.user}</p>
                          {event.details && (
                            <p className="text-xs text-muted-foreground mt-2 italic">{event.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No timeline events</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-4 border-t border-glass-border bg-background/80 backdrop-blur">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 glass-subtle">
              <FileText className="h-4 w-4 mr-2" />
              Generate Slip
            </Button>
            <Button className="flex-1 bg-gold hover:bg-gold/90 text-black">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full View
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
