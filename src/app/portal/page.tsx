"use client"

import * as React from "react"
import { operations } from "@/data/operations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  FileText,
  ExternalLink,
} from "lucide-react"

// Simulated client portal view - what clients see
export default function PortalPage() {
  const clientName = "Musée du Louvre"
  const clientOps = operations.filter((op) => op.client.includes("Louvre") || op.client.includes("Musée"))

  const activeOps = clientOps.filter((op) => op.status !== "completed")
  const completedOps = clientOps.filter((op) => op.status === "completed")

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "visible":
        return 25
      case "ready":
        return 50
      case "in_progress":
        return 75
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "visible":
        return "Scheduled"
      case "ready":
        return "Prepared"
      case "in_progress":
        return "In Transit"
      case "completed":
        return "Delivered"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Portal Frame Header */}
      <div className="glass p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
            <Package className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Client Portal Preview</p>
            <h1 className="text-xl font-bold">{clientName}</h1>
          </div>
        </div>
        <Badge className="bg-status-ready/20 text-status-ready border-status-ready/30">
          Active Client
        </Badge>
      </div>

      {/* Portal Content */}
      <div className="glass p-6 rounded-2xl min-h-[600px]">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-muted-foreground">
            Track your shipments and manage your art logistics operations.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              icon: Package,
              label: "Active Shipments",
              value: activeOps.length,
              color: "text-status-info",
            },
            {
              icon: CheckCircle,
              label: "Completed This Month",
              value: completedOps.length,
              color: "text-status-ready",
            },
            {
              icon: Clock,
              label: "Next Delivery",
              value: activeOps.length > 0 ? "Today" : "None",
              color: "text-gold",
            },
          ].map((stat, index) => (
            <Card key={stat.label} className="glass-subtle">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-accent/50",
                      stat.color
                    )}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Active Shipments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-gold" />
            Active Shipments
          </h3>
          <div className="space-y-4">
            {activeOps.length > 0 ? (
              activeOps.map((op, index) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass-subtle overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{op.id}</p>
                            <Badge variant="outline" className="capitalize text-xs">
                              {op.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(op.dateTime), "EEEE, MMMM d 'at' HH:mm")}
                          </p>
                        </div>
                        <Badge
                          className={cn(
                            "capitalize",
                            op.status === "in_progress" &&
                              "bg-status-info/20 text-status-info",
                            op.status === "ready" &&
                              "bg-status-ready/20 text-status-ready",
                            op.status === "visible" &&
                              "bg-status-visible/20 text-status-visible"
                          )}
                        >
                          {getStatusLabel(op.status)}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span>{getStatusProgress(op.status)}%</span>
                        </div>
                        <Progress
                          value={getStatusProgress(op.status)}
                          className="h-2"
                        />
                      </div>

                      {/* Locations */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-status-visible mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">From</p>
                            <p className="font-medium">{op.location.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-status-ready mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">To</p>
                            <p className="font-medium">{op.location.delivery}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active shipments</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Button variant="outline" className="glass-subtle h-auto py-4">
            <div className="text-center">
              <Phone className="h-5 w-5 mx-auto mb-2" />
              <span className="text-sm">Contact Support</span>
            </div>
          </Button>
          <Button variant="outline" className="glass-subtle h-auto py-4">
            <div className="text-center">
              <FileText className="h-5 w-5 mx-auto mb-2" />
              <span className="text-sm">View Documents</span>
            </div>
          </Button>
          <Button variant="outline" className="glass-subtle h-auto py-4">
            <div className="text-center">
              <ExternalLink className="h-5 w-5 mx-auto mb-2" />
              <span className="text-sm">Request Quote</span>
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
