"use client"

import * as React from "react"
import { activityFeed, type ActivityEntry, type ActivityType } from "@/data/activity"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Package,
  Users,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  FileText,
  Zap,
} from "lucide-react"

const typeIcons: Record<ActivityType, typeof Activity> = {
  status_change: Package,
  assignment: Users,
  urgent: Zap,
  alert: AlertTriangle,
  slip: FileText,
}

const typeColors: Record<ActivityType, string> = {
  status_change: "text-status-info bg-status-info/10",
  assignment: "text-gold bg-gold/10",
  urgent: "text-status-urgent bg-status-urgent/10",
  alert: "text-status-visible bg-status-visible/10",
  slip: "text-status-ready bg-status-ready/10",
}

const typeLabels: Record<ActivityType, string> = {
  status_change: "Status",
  assignment: "Assignment",
  urgent: "Urgent",
  alert: "Alert",
  slip: "Slip",
}

export default function ActivityPage() {
  const [activities, setActivities] = React.useState<ActivityEntry[]>(activityFeed)
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const filteredActivities = React.useMemo(() => {
    if (typeFilter === "all") return activities
    return activities.filter((a) => a.type === typeFilter)
  }, [activities, typeFilter])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      const newActivity: ActivityEntry = {
        id: `ACT-${Date.now()}`,
        type: "status_change",
        action: "refreshed",
        userId: "system",
        userName: "System",
        target: "Dashboard",
        timestamp: new Date().toISOString(),
        details: "Activity feed updated",
      }
      setActivities([newActivity, ...activities])
      setIsRefreshing(false)
    }, 1000)
  }

  const uniqueTypes: ActivityType[] = ["status_change", "assignment", "urgent", "alert", "slip"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Feed</h1>
          <p className="text-muted-foreground">
            Real-time operational updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] glass-subtle">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {typeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="glass-subtle"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-5 gap-4">
        {uniqueTypes.map((type) => {
          const Icon = typeIcons[type]
          const count = activities.filter((a) => a.type === type).length
          return (
            <Card
              key={type}
              className={cn(
                "glass-subtle cursor-pointer transition-all hover:scale-105",
                typeFilter === type && "ring-2 ring-gold"
              )}
              onClick={() => setTypeFilter(type === typeFilter ? "all" : type)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    typeColors[type]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {typeLabels[type]}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Activity List */}
      <Card className="glass">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => {
                const Icon = typeIcons[activity.type]
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.02 }}
                    layout
                  >
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/30 transition-colors group">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          typeColors[activity.type]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium capitalize">{activity.action}</p>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {activity.target}
                          </Badge>
                        </div>
                        {activity.details && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {activity.details}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.userName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(parseISO(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                          {activity.targetId && (
                            <Badge
                              variant="secondary"
                              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              View {activity.targetId}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(activity.timestamp), "HH:mm")}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
