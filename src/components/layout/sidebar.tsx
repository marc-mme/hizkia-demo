"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
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
  PlusCircle,
  GanttChart,
  LucideIcon,
} from "lucide-react"

type NavItem = {
  href: string
  labelKey: string
  icon: LucideIcon
}

const mainNavItems: NavItem[] = [
  { href: "/missions/new", labelKey: "newMission", icon: PlusCircle },
  { href: "/planning", labelKey: "planningStatus", icon: Calendar },
  { href: "/planning-view", labelKey: "planningView", icon: GanttChart },
  { href: "/slips", labelKey: "transportSlips", icon: FileText },
  { href: "/urgent", labelKey: "urgentOps", icon: AlertTriangle },
  { href: "/resources", labelKey: "resources", icon: Users },
]

const extraNavItems: NavItem[] = [
  { href: "/field", labelKey: "fieldView", icon: Smartphone },
  { href: "/briefing", labelKey: "dailyBriefing", icon: Coffee },
  { href: "/activity", labelKey: "activityFeed", icon: Activity },
  { href: "/capacity", labelKey: "capacity", icon: BarChart3 },
  { href: "/portal", labelKey: "clientPortal", icon: Globe },
  { href: "/kpi", labelKey: "kpiDashboard", icon: LineChart },
  { href: "/executive", labelKey: "executive", icon: LayoutDashboard },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const t = useTranslations("navigation")

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen flex flex-col glass border-r border-glass-border"
      data-tour="sidebar"
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
              {t("main")}
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
                      <span className="text-sm font-medium">{t(item.labelKey)}</span>
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
              {t("extra")}
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
                      <span className="text-sm font-medium">{t(item.labelKey)}</span>
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
            {t("operationsDashboard")}
          </p>
        )}
      </div>
    </motion.aside>
  )
}
