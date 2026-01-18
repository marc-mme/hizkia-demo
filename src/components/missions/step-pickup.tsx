"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import { getLocationsByClient, savedLocations } from "@/data/clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  MapPin,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  BookmarkIcon,
  Check,
} from "lucide-react"

export function StepPickup() {
  const { data, updateData } = useMissionForm()

  const clientLocations = React.useMemo(() => {
    if (!data.clientId) return []
    return getLocationsByClient(data.clientId).filter(
      (l) => l.type === "pickup" || l.type === "both"
    )
  }, [data.clientId])

  const selectLocation = (locationId: string) => {
    const location = savedLocations.find((l) => l.id === locationId)
    if (location) {
      updateData({
        pickupLocation: location.address,
        pickupContact: location.contact,
        pickupPhone: location.phone,
        pickupInstructions: location.instructions,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Saved Locations */}
      {clientLocations.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookmarkIcon className="h-5 w-5 text-gold" />
              Saved Locations
              <Badge variant="secondary" className="ml-1">
                {clientLocations.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className={clientLocations.length > 3 ? "h-[220px]" : ""}>
              <div className="space-y-2 pr-2">
                {clientLocations.map((location) => {
                  const isSelected = data.pickupLocation === location.address
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => selectLocation(location.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all flex items-start gap-3",
                        isSelected
                          ? "bg-gold/10 border-gold/30"
                          : "glass-subtle border-glass-border hover:bg-accent/30"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-medium", isSelected && "text-gold")}>
                          {location.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {location.address}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-gold" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Location Details */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-gold" />
            Pickup Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Address</label>
            <Textarea
              value={data.pickupLocation}
              onChange={(e) => updateData({ pickupLocation: e.target.value })}
              placeholder="Enter full address..."
              className="glass-subtle min-h-[60px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <User className="h-3 w-3" />
                Contact Person
              </label>
              <Input
                value={data.pickupContact}
                onChange={(e) => updateData({ pickupContact: e.target.value })}
                placeholder="Name"
                className="glass-subtle"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Phone
              </label>
              <Input
                value={data.pickupPhone}
                onChange={(e) => updateData({ pickupPhone: e.target.value })}
                placeholder="+33 1 XX XX XX XX"
                className="glass-subtle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-gold" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date
              </label>
              <Input
                type="date"
                value={data.pickupDateTime?.split("T")[0] || ""}
                onChange={(e) => {
                  const time = data.pickupDateTime?.split("T")[1] || "09:00"
                  updateData({ pickupDateTime: `${e.target.value}T${time}` })
                }}
                className="glass-subtle"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Time
              </label>
              <Input
                type="time"
                value={data.pickupDateTime?.split("T")[1] || ""}
                onChange={(e) => {
                  const date =
                    data.pickupDateTime?.split("T")[0] ||
                    new Date().toISOString().split("T")[0]
                  updateData({ pickupDateTime: `${date}T${e.target.value}` })
                }}
                className="glass-subtle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Instructions */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-gold" />
            Access Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.pickupInstructions}
            onChange={(e) =>
              updateData({ pickupInstructions: e.target.value })
            }
            placeholder="Loading dock location, security protocols, parking notes, elevator access..."
            className="glass-subtle min-h-[80px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
