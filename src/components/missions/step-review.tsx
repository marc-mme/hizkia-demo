"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import { clients } from "@/data/clients"
import {
  MISSION_TYPE_LABELS,
  CATEGORY_LABELS,
  SPECIAL_HANDLING_LABELS,
  CERTIFICATION_LABELS,
  VEHICLE_LABELS,
  EQUIPMENT_LABELS,
} from "@/types/mission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import {
  Building,
  Palette,
  MapPin,
  Calendar,
  Users,
  Truck,
  Euro,
  Edit,
  CheckCircle,
} from "lucide-react"

interface SectionProps {
  title: string
  icon: typeof Building
  step: number
  children: React.ReactNode
  onEdit?: () => void
}

function Section({ title, icon: Icon, step, children, onEdit }: SectionProps) {
  return (
    <Card className="glass">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5 text-gold" />
          {title}
        </CardTitle>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function StepReview() {
  const { data, setCurrentStep } = useMissionForm()

  const client = clients.find((c) => c.id === data.clientId)

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "Not set"
    try {
      return format(parseISO(dateTime), "EEE, MMM d 'at' HH:mm")
    } catch {
      return dateTime
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-gold mx-auto mb-3" />
        <h2 className="text-xl font-bold">Review Your Mission</h2>
        <p className="text-muted-foreground">
          Please review all details before creating
        </p>
      </div>

      {/* Client & Type */}
      <Section
        title="Client & Mission"
        icon={Building}
        step={1}
        onEdit={() => setCurrentStep(1)}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Client</span>
            <span className="font-medium">{client?.name || data.clientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Type</span>
            <Badge variant="outline">
              {MISSION_TYPE_LABELS[data.missionType]}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono text-sm">{data.referenceNumber}</span>
          </div>
        </div>
      </Section>

      {/* Artwork */}
      <Section
        title="Artwork"
        icon={Palette}
        step={2}
        onEdit={() => setCurrentStep(2)}
      >
        <div className="space-y-3">
          {data.useOverallDimensions ? (
            <>
              <p className="text-sm text-muted-foreground">Overall dimensions for all items</p>
              <div className="flex flex-wrap gap-2">
                {data.overallDimensions.length > 0 && (
                  <Badge variant="outline">
                    {data.overallDimensions.length}×{data.overallDimensions.width}×
                    {data.overallDimensions.height} cm
                  </Badge>
                )}
                {data.overallWeight > 0 && (
                  <Badge variant="outline">{data.overallWeight} kg</Badge>
                )}
                {data.totalInsuranceValue && (
                  <Badge variant="outline">€{data.totalInsuranceValue.toLocaleString()}</Badge>
                )}
              </div>
            </>
          ) : data.artworks.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {data.artworks.length} item{data.artworks.length > 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {data.artworks.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-accent/20 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {item.description || `Item ${index + 1}`}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_LABELS[item.category]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      <span>
                        {item.dimensions.length}×{item.dimensions.width}×
                        {item.dimensions.height} cm
                      </span>
                      <span>{item.weight} kg</span>
                      {item.insuranceValue && (
                        <span>€{item.insuranceValue.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-glass-border flex flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground">
                  Total: {data.artworks.reduce((sum, i) => sum + i.weight, 0)} kg
                </span>
                {data.artworks.some((i) => i.insuranceValue) && (
                  <span className="text-muted-foreground">
                    • €{data.artworks.reduce((sum, i) => sum + (i.insuranceValue || 0), 0).toLocaleString()} insured
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No artwork added</p>
          )}
          {data.specialHandling && data.specialHandling.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {data.specialHandling.map((h) => (
                <Badge
                  key={h}
                  className="bg-status-visible/20 text-status-visible border-status-visible/30 text-xs"
                >
                  {SPECIAL_HANDLING_LABELS[h]}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Pickup */}
      <Section
        title="Pickup"
        icon={MapPin}
        step={3}
        onEdit={() => setCurrentStep(3)}
      >
        <div className="space-y-2">
          <p className="text-sm">{data.pickupLocation || "Not set"}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{data.pickupContact}</span>
            <span>{data.pickupPhone}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-gold" />
            {formatDateTime(data.pickupDateTime)}
          </div>
        </div>
      </Section>

      {/* Delivery */}
      <Section
        title="Delivery"
        icon={MapPin}
        step={4}
        onEdit={() => setCurrentStep(4)}
      >
        <div className="space-y-2">
          {data.sameAsPickup ? (
            <p className="text-sm text-muted-foreground italic">
              Same as pickup (round-trip)
            </p>
          ) : (
            <>
              <p className="text-sm">{data.deliveryLocation || "Not set"}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{data.deliveryContact}</span>
                <span>{data.deliveryPhone}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-gold" />
            {formatDateTime(data.deliveryDateTime)}
          </div>
        </div>
      </Section>

      {/* Requirements */}
      <Section
        title="Requirements"
        icon={Truck}
        step={5}
        onEdit={() => setCurrentStep(5)}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Vehicle</span>
            <Badge variant="outline">{VEHICLE_LABELS[data.vehicleType]}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Crew</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {data.crewSize} {data.crewSize === 1 ? "person" : "people"}
            </span>
          </div>
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">
                Certifications
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.certifications.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {CERTIFICATION_LABELS[c]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {data.equipment && data.equipment.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">Equipment</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.equipment.map((e) => (
                  <Badge key={e} variant="outline" className="text-xs">
                    {EQUIPMENT_LABELS[e]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Total */}
      <Card className="glass gold-glow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-gold" />
              <span className="font-medium">Total Quote</span>
            </div>
            <span className="text-3xl font-bold text-gold">
              €{data.totalQuote}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
