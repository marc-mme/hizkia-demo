"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import { getLocationsByClient, savedLocations, clients } from "@/data/clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  MapPin,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  BookmarkIcon,
  Copy,
} from "lucide-react"

export function StepDelivery() {
  const { data, updateData } = useMissionForm()

  const clientLocations = React.useMemo(() => {
    if (!data.clientId) return []
    return getLocationsByClient(data.clientId).filter(
      (l) => l.type === "delivery" || l.type === "both"
    )
  }, [data.clientId])

  // For round-trip, also show all other clients' locations
  const otherLocations = React.useMemo(() => {
    if (data.missionType !== "round_trip" && data.missionType !== "delivery") {
      return []
    }
    return savedLocations.filter(
      (l) =>
        l.clientId !== data.clientId &&
        (l.type === "delivery" || l.type === "both")
    )
  }, [data.clientId, data.missionType])

  const selectLocation = (locationId: string) => {
    const location = savedLocations.find((l) => l.id === locationId)
    if (location) {
      updateData({
        deliveryLocation: location.address,
        deliveryContact: location.contact,
        deliveryPhone: location.phone,
        deliveryInstructions: location.instructions,
      })
    }
  }

  const copyFromPickup = () => {
    updateData({
      deliveryLocation: data.pickupLocation,
      deliveryContact: data.pickupContact,
      deliveryPhone: data.pickupPhone,
      deliveryInstructions: data.pickupInstructions,
      sameAsPickup: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Same as Pickup (for round-trips) */}
      {data.missionType === "round_trip" && (
        <button
          type="button"
          onClick={copyFromPickup}
          className={cn(
            "w-full p-4 rounded-xl border transition-all flex items-center gap-3",
            data.sameAsPickup
              ? "bg-gold/10 border-gold/30"
              : "glass-subtle border-glass-border hover:bg-accent/30"
          )}
        >
          <Copy
            className={cn(
              "h-5 w-5",
              data.sameAsPickup ? "text-gold" : "text-muted-foreground"
            )}
          />
          <div className="text-left">
            <p className={cn("font-medium", data.sameAsPickup && "text-gold")}>
              Return to Pickup Location
            </p>
            <p className="text-sm text-muted-foreground">
              Use the same address as pickup
            </p>
          </div>
        </button>
      )}

      {/* Saved Locations */}
      {(clientLocations.length > 0 || otherLocations.length > 0) && (
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookmarkIcon className="h-5 w-5 text-gold" />
              Saved Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientLocations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Client Locations
                </p>
                {clientLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => {
                      selectLocation(location.id)
                      updateData({ sameAsPickup: false })
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-all",
                      data.deliveryLocation === location.address &&
                        !data.sameAsPickup
                        ? "bg-gold/10 border-gold/30"
                        : "glass-subtle border-glass-border hover:bg-accent/30"
                    )}
                  >
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.address}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {otherLocations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Other Destinations
                </p>
                {otherLocations.slice(0, 3).map((location) => {
                  const client = clients.find((c) => c.id === location.clientId)
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => {
                        selectLocation(location.id)
                        updateData({ sameAsPickup: false })
                      }}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all",
                        data.deliveryLocation === location.address &&
                          !data.sameAsPickup
                          ? "bg-gold/10 border-gold/30"
                          : "glass-subtle border-glass-border hover:bg-accent/30"
                      )}
                    >
                      <p className="font-medium">{client?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.address}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Location Details */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-gold" />
            Delivery Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Address</label>
            <Textarea
              value={data.deliveryLocation}
              onChange={(e) => {
                updateData({
                  deliveryLocation: e.target.value,
                  sameAsPickup: false,
                })
              }}
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
                value={data.deliveryContact}
                onChange={(e) =>
                  updateData({ deliveryContact: e.target.value })
                }
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
                value={data.deliveryPhone}
                onChange={(e) => updateData({ deliveryPhone: e.target.value })}
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
                value={data.deliveryDateTime?.split("T")[0] || ""}
                onChange={(e) => {
                  const time = data.deliveryDateTime?.split("T")[1] || "14:00"
                  updateData({ deliveryDateTime: `${e.target.value}T${time}` })
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
                value={data.deliveryDateTime?.split("T")[1] || ""}
                onChange={(e) => {
                  const date =
                    data.deliveryDateTime?.split("T")[0] ||
                    new Date().toISOString().split("T")[0]
                  updateData({ deliveryDateTime: `${date}T${e.target.value}` })
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
            value={data.deliveryInstructions}
            onChange={(e) =>
              updateData({ deliveryInstructions: e.target.value })
            }
            placeholder="Loading dock location, security protocols, parking notes..."
            className="glass-subtle min-h-[80px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
