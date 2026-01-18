"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { Bell, Search, LogOut, Settings, User, AlertTriangle, CheckCircle, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title?: string
}

// Fake user data
const currentUser = {
  name: "Marc Hizkia",
  email: "marc.hizkia@operations.com",
  role: "Operations Manager",
  initials: "MH",
}

// Fake notifications
const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "Crew conflict detected",
    message: "J. Dupont double-booked for Nov 15",
    time: "5 min ago",
    icon: AlertTriangle,
    unread: true,
  },
  {
    id: 2,
    type: "success",
    title: "Operation completed",
    message: "Transfer MER-2024-042 finished",
    time: "1 hour ago",
    icon: CheckCircle,
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "New operation assigned",
    message: "Luxury Estates - Piano transport",
    time: "3 hours ago",
    icon: Truck,
    unread: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Deadline approaching",
    message: "GlobalTech move starts tomorrow",
    time: "5 hours ago",
    icon: Clock,
    unread: false,
  },
]

const notificationTypeColors = {
  urgent: "text-status-urgent",
  success: "text-status-completed",
  info: "text-gold",
  warning: "text-status-ready",
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations("header")

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-glass-border glass">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="w-64 pl-9 glass-subtle border-glass-border"
          />
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 glass-subtle relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-status-urgent rounded-full text-[10px] flex items-center justify-center text-white font-medium">
                {notifications.filter(n => n.unread).length}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 glass">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>{t("notifications")}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {notifications.filter(n => n.unread).length} {t("unread")}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer",
                    notification.unread && "bg-accent/50"
                  )}
                >
                  <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", notificationTypeColors[notification.type as keyof typeof notificationTypeColors])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  )}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-gold cursor-pointer">
              {t("viewAllNotifications")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-gold flex items-center justify-center text-sm font-semibold text-black hover:bg-gold/90 transition-colors">
              {currentUser.initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <p className="text-xs text-gold">{currentUser.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              {t("settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-status-urgent focus:text-status-urgent">
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
