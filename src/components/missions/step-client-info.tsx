"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import { clients, searchClients } from "@/data/clients"
import { MISSION_TYPE_LABELS, MissionType } from "@/types/mission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building,
  User,
  Truck,
  Package,
  RotateCcw,
  Wrench,
  Search,
  FileText,
} from "lucide-react"

const missionTypeIcons: Record<MissionType, typeof Truck> = {
  pickup: Package,
  delivery: Truck,
  round_trip: RotateCcw,
  installation: Wrench,
}

export function StepClientInfo() {
  const { data, updateData } = useMissionForm()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const filteredClients = React.useMemo(() => {
    if (!searchQuery) return clients.slice(0, 5)
    return searchClients(searchQuery)
  }, [searchQuery])

  const selectedClient = clients.find((c) => c.id === data.clientId)

  const generateReference = () => {
    const prefix = "MIS"
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "")
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${date}-${rand}`
  }

  React.useEffect(() => {
    if (!data.referenceNumber) {
      updateData({ referenceNumber: generateReference() })
    }
  }, [data.referenceNumber, updateData])

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building className="h-5 w-5 text-gold" />
            Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowDropdown(false)
              }}
              className="pl-9 glass-subtle"
            />

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 rounded-lg border border-glass-border overflow-hidden bg-background/95 backdrop-blur-xl shadow-xl"
                >
                  <ScrollArea className="max-h-[200px]">
                    {filteredClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          updateData({
                            clientId: client.id,
                            clientName: client.name,
                          })
                          setSearchQuery("")
                          setShowDropdown(false)
                        }}
                        className={cn(
                          "w-full p-3 text-left hover:bg-accent/30 transition-colors flex items-center gap-3",
                          data.clientId === client.id && "bg-gold/10"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold text-sm font-medium">
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{client.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {client.contact}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {client.type.replace("_", " ")}
                        </Badge>
                      </button>
                    ))}
                    {filteredClients.length === 0 && (
                      <p className="p-4 text-center text-muted-foreground text-sm">
                        No clients found
                      </p>
                    )}
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedClient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-lg bg-gold/10 border border-gold/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gold">{selectedClient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedClient.contact} • {selectedClient.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateData({ clientId: "", clientName: "" })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Change
                </button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Mission Type */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Truck className="h-5 w-5 text-gold" />
            Mission Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(MISSION_TYPE_LABELS) as MissionType[]).map((type) => {
              const Icon = missionTypeIcons[type]
              const isSelected = data.missionType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateData({ missionType: type })}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-left",
                    isSelected
                      ? "bg-gold/10 border-gold/30 gold-glow"
                      : "glass-subtle border-glass-border hover:bg-accent/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 mb-2",
                      isSelected ? "text-gold" : "text-muted-foreground"
                    )}
                  />
                  <p
                    className={cn(
                      "font-medium",
                      isSelected && "text-gold"
                    )}
                  >
                    {MISSION_TYPE_LABELS[type]}
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reference & Notes */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-gold" />
            Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Reference Number
            </label>
            <Input
              value={data.referenceNumber}
              onChange={(e) => updateData({ referenceNumber: e.target.value })}
              placeholder="Auto-generated"
              className="glass-subtle font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Internal Notes
            </label>
            <Textarea
              value={data.internalNotes}
              onChange={(e) => updateData({ internalNotes: e.target.value })}
              placeholder="Add any internal notes or special instructions..."
              className="glass-subtle min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
