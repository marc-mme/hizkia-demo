"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Calendar,
  FileText,
  AlertTriangle,
  Users,
  Smartphone,
  Coffee,
  Activity,
  BarChart3,
  Globe,
  LineChart,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const mainNavItems = [
  { href: "/planning", label: "Planning Status", icon: Calendar },
  { href: "/slips", label: "Transport Slips", icon: FileText },
  { href: "/urgent", label: "Urgent Ops", icon: AlertTriangle },
  { href: "/resources", label: "Resources", icon: Users },
]

const extraNavItems = [
  { href: "/field", label: "Field View", icon: Smartphone },
  { href: "/briefing", label: "Daily Briefing", icon: Coffee },
  { href: "/activity", label: "Activity Feed", icon: Activity },
  { href: "/capacity", label: "Capacity", icon: BarChart3 },
  { href: "/portal", label: "Client Portal", icon: Globe },
  { href: "/kpi", label: "KPI Dashboard", icon: LineChart },
  { href: "/executive", label: "Executive", icon: LayoutDashboard },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen flex flex-col glass border-r border-glass-border"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-glass-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-sm font-bold text-black">H</span>
            </div>
            <span className="font-semibold text-lg">HIZKIA</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-black">H</span>
          </div>
        )}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
        {/* Main Section */}
        <div className="px-3 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3 px-3">
              Main
            </h3>
          )}
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "glass gold-glow text-gold"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-gold")} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Extra Section */}
        <div className="px-3">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Extra
            </h3>
          )}
          <ul className="space-y-1">
            {extraNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "glass text-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-glass-border">
        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center">
            Operations Dashboard
          </p>
        )}
      </div>
    </motion.aside>
  )
}
