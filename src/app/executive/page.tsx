"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Euro,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 245000, target: 230000 },
  { month: "Feb", revenue: 268000, target: 250000 },
  { month: "Mar", revenue: 312000, target: 280000 },
  { month: "Apr", revenue: 289000, target: 290000 },
  { month: "May", revenue: 356000, target: 320000 },
  { month: "Jun", revenue: 398000, target: 350000 },
]

const topClients = [
  { name: "Musée du Louvre", revenue: "€125,000", ops: 45, trend: "+12%" },
  { name: "Centre Pompidou", revenue: "€98,000", ops: 38, trend: "+8%" },
  { name: "Christie's Paris", revenue: "€87,000", ops: 32, trend: "+15%" },
  { name: "Fondation Cartier", revenue: "€65,000", ops: 24, trend: "+5%" },
  { name: "Musée d'Orsay", revenue: "€58,000", ops: 21, trend: "+3%" },
]

const alerts = [
  {
    type: "urgent",
    title: "High-value shipment pending approval",
    description: "€2.5M artwork requires C-suite sign-off",
    time: "2h ago",
  },
  {
    type: "warning",
    title: "Capacity warning for next week",
    description: "3 crews at 90%+ utilization",
    time: "4h ago",
  },
  {
    type: "info",
    title: "New contract opportunity",
    description: "Musée Picasso - Annual partnership proposal",
    time: "1d ago",
  },
]

export default function ExecutivePage() {
  const [selectedQuadrant, setSelectedQuadrant] = React.useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            High-level business overview
          </p>
        </div>
        <Badge className="bg-gold/20 text-gold border-gold/30 py-1 px-3">
          <Calendar className="h-4 w-4 mr-2" />
          Q2 2026
        </Badge>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "YTD Revenue",
            value: "€1.87M",
            change: "+18%",
            trend: "up",
            icon: Euro,
            target: "Target: €2.1M",
          },
          {
            label: "Operations",
            value: "1,247",
            change: "+22%",
            trend: "up",
            icon: Package,
            target: "vs. 1,024 last year",
          },
          {
            label: "Active Clients",
            value: "47",
            change: "+5",
            trend: "up",
            icon: Building,
            target: "3 new this month",
          },
          {
            label: "Team Size",
            value: "24",
            change: "+2",
            trend: "up",
            icon: Users,
            target: "2 positions open",
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass gold-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-5 w-5 text-gold" />
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      metric.trend === "up"
                        ? "text-status-ready border-status-ready/30"
                        : "text-status-urgent border-status-urgent/30"
                    )}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-gold mt-1">{metric.target}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid - Quadrants */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            className={cn(
              "glass cursor-pointer transition-all",
              selectedQuadrant === "revenue" && "ring-2 ring-gold"
            )}
            onClick={() =>
              setSelectedQuadrant(selectedQuadrant === "revenue" ? null : "revenue")
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-gold" />
                  Revenue vs Target
                </span>
                <Button variant="ghost" size="sm" className="text-xs">
                  Details <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value !== undefined ? [`€${(Number(value) / 1000).toFixed(0)}K`] : []}
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="rgba(255,255,255,0.3)"
                    fill="rgba(255,255,255,0.05)"
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d4af37"
                    fill="rgba(212,175,55,0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Executive Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            className={cn(
              "glass cursor-pointer transition-all",
              selectedQuadrant === "alerts" && "ring-2 ring-gold"
            )}
            onClick={() =>
              setSelectedQuadrant(selectedQuadrant === "alerts" ? null : "alerts")
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-status-visible" />
                  Attention Required
                </span>
                <Badge variant="secondary">{alerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
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
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card
            className={cn(
              "glass cursor-pointer transition-all",
              selectedQuadrant === "clients" && "ring-2 ring-gold"
            )}
            onClick={() =>
              setSelectedQuadrant(selectedQuadrant === "clients" ? null : "clients")
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-status-info" />
                  Top Clients
                </span>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {topClients.map((client, index) => (
                    <div
                      key={client.name}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gold w-5">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {client.ops} operations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{client.revenue}</p>
                        <Badge
                          variant="outline"
                          className="text-xs text-status-ready border-status-ready/30"
                        >
                          {client.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card
            className={cn(
              "glass cursor-pointer transition-all",
              selectedQuadrant === "objectives" && "ring-2 ring-gold"
            )}
            onClick={() =>
              setSelectedQuadrant(
                selectedQuadrant === "objectives" ? null : "objectives"
              )
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-status-ready" />
                  Q2 Objectives
                </span>
                <Badge className="bg-status-ready/20 text-status-ready">
                  On Track
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Revenue Target", progress: 89, status: "on_track" },
                  { label: "New Client Acquisition", progress: 100, status: "completed" },
                  { label: "Team Expansion", progress: 67, status: "in_progress" },
                  { label: "Process Automation", progress: 45, status: "in_progress" },
                ].map((objective) => (
                  <div key={objective.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{objective.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {objective.progress}%
                        </span>
                        {objective.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-status-ready" />
                        )}
                        {objective.status === "in_progress" && (
                          <Clock className="h-4 w-4 text-status-info" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-accent/30 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          objective.progress >= 100
                            ? "bg-status-ready"
                            : objective.progress >= 75
                            ? "bg-gold"
                            : "bg-status-info"
                        )}
                        style={{ width: `${Math.min(objective.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
