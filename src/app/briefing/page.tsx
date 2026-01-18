"use client"

import * as React from "react"
import { operations } from "@/data/operations"
import { crew } from "@/data/crew"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Sun,
  Cloud,
  AlertTriangle,
  Clock,
  Users,
  Truck,
  Calendar,
  CheckCircle,
  MapPin,
} from "lucide-react"

export default function BriefingPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const todayOps = operations.filter((op) => op.status !== "completed")
  const completedToday = operations.filter((op) => op.status === "completed")
  const availableCrew = crew.filter((c) => c.available)

  const alerts = [
    {
      type: "warning",
      message: "High traffic expected near Champs-Élysées - allow extra time",
      time: "07:30",
    },
    {
      type: "info",
      message: "Christie's auction house - VIP client visiting at 14:00",
      time: "08:00",
    },
    {
      type: "urgent",
      message: "Pompidou installation requires 2 additional handlers",
      time: "08:15",
    },
  ]

  const timeline = todayOps.map((op) => ({
    time: format(new Date(op.dateTime), "HH:mm"),
    title: op.client,
    type: op.type,
    location: op.location.delivery,
    crew: op.crew.length,
  })).sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              {format(currentTime, "HH:mm:ss")}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cloud className="h-6 w-6" />
              <span className="text-lg">12°C Paris</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gold">{todayOps.length}</p>
              <p className="text-sm text-muted-foreground">Operations Today</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            icon: Calendar,
            label: "Scheduled",
            value: todayOps.length,
            color: "text-status-info",
          },
          {
            icon: CheckCircle,
            label: "Completed",
            value: completedToday.length,
            color: "text-status-ready",
          },
          {
            icon: Users,
            label: "Crew Available",
            value: availableCrew.length,
            color: "text-gold",
          },
          {
            icon: Truck,
            label: "Vehicles Ready",
            value: 4,
            color: "text-status-visible",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-subtle">
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
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Timeline */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              Today's Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-mono font-medium text-gold">
                        {item.time}
                      </span>
                      <div className="w-px h-full bg-glass-border mt-2" />
                    </div>
                    <div className="flex-1 glass-subtle p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="outline" className="capitalize text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.crew} crew
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alerts & Crew */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-visible" />
                Alerts & Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-3 rounded-lg border",
                      alert.type === "urgent" &&
                        "bg-status-urgent/10 border-status-urgent/30",
                      alert.type === "warning" &&
                        "bg-status-visible/10 border-status-visible/30",
                      alert.type === "info" &&
                        "bg-status-info/10 border-status-info/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm">{alert.message}</p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {alert.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crew Status */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                Crew Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {crew.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm font-medium text-gold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.todayOps} ops today
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        member.available
                          ? "text-status-ready border-status-ready/30"
                          : "text-muted-foreground"
                      )}
                    >
                      {member.available ? "Available" : "Assigned"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
