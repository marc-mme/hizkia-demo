"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  Users,
  Truck,
  Target,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const operationsData = [
  { name: "Mon", deliveries: 12, pickups: 8, installations: 4 },
  { name: "Tue", deliveries: 15, pickups: 10, installations: 6 },
  { name: "Wed", deliveries: 18, pickups: 12, installations: 5 },
  { name: "Thu", deliveries: 14, pickups: 9, installations: 7 },
  { name: "Fri", deliveries: 20, pickups: 14, installations: 8 },
  { name: "Sat", deliveries: 8, pickups: 5, installations: 2 },
  { name: "Sun", deliveries: 3, pickups: 2, installations: 1 },
]

const onTimeData = [
  { name: "Week 1", rate: 94 },
  { name: "Week 2", rate: 97 },
  { name: "Week 3", rate: 92 },
  { name: "Week 4", rate: 98 },
]

const clientDistribution = [
  { name: "Museums", value: 35, color: "#d4af37" },
  { name: "Galleries", value: 25, color: "#3b82f6" },
  { name: "Auction Houses", value: 20, color: "#22c55e" },
  { name: "Private", value: 15, color: "#f59e0b" },
  { name: "Corporate", value: 5, color: "#ef4444" },
]

export default function KPIPage() {
  const [timeRange, setTimeRange] = React.useState("week")

  const kpis = [
    {
      label: "Total Operations",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-gold",
    },
    {
      label: "On-Time Rate",
      value: "97.2%",
      change: "+2.1%",
      trend: "up",
      icon: Clock,
      color: "text-status-ready",
    },
    {
      label: "Crew Utilization",
      value: "84%",
      change: "-3%",
      trend: "down",
      icon: Users,
      color: "text-status-info",
    },
    {
      label: "Vehicle Efficiency",
      value: "91%",
      change: "+5%",
      trend: "up",
      icon: Truck,
      color: "text-status-visible",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">KPI Dashboard</h1>
          <p className="text-muted-foreground">
            Key performance indicators and metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] glass-subtle">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-accent/50",
                      kpi.color
                    )}
                  >
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      kpi.trend === "up"
                        ? "text-status-ready border-status-ready/30"
                        : "text-status-urgent border-status-urgent/30"
                    )}
                  >
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold mt-4">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Operations by Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-gold" />
                Operations by Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={operationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#d4af37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pickups" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="installations" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* On-Time Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-status-ready" />
                On-Time Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={onTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis domain={[85, 100]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Client Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-status-info" />
                Client Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={clientDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clientDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {clientDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1 text-xs">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="col-span-2"
        >
          <Card className="glass h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-gold" />
                Performance Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Fastest Delivery", value: "47 min", sublabel: "Paris 8th → 16th" },
                  { label: "Most Operations", value: "Pierre M.", sublabel: "23 this week" },
                  { label: "Zero Incidents", value: "14 days", sublabel: "Current streak" },
                  { label: "Client Satisfaction", value: "4.9/5", sublabel: "Based on 89 reviews" },
                  { label: "Cost Efficiency", value: "-8%", sublabel: "vs. last month" },
                  { label: "New Clients", value: "+3", sublabel: "This week" },
                ].map((metric, index) => (
                  <div
                    key={metric.label}
                    className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <p className="text-lg font-bold text-gold">{metric.value}</p>
                    <p className="text-sm font-medium">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.sublabel}</p>
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
