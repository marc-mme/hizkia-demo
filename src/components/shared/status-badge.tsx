"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, Eye, Loader2 } from "lucide-react"

type Status = "visible" | "ready" | "in_progress" | "completed"

interface StatusBadgeProps {
  status: Status
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  Status,
  { label: string; icon: typeof Check; className: string; glowClass: string }
> = {
  visible: {
    label: "Visible",
    icon: Eye,
    className: "bg-status-visible/20 text-status-visible border-status-visible/30",
    glowClass: "status-visible-glow",
  },
  ready: {
    label: "Ready",
    icon: Check,
    className: "bg-status-ready/20 text-status-ready border-status-ready/30",
    glowClass: "status-ready-glow",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-status-info/20 text-status-info border-status-info/30",
    glowClass: "status-info-glow",
  },
  completed: {
    label: "Completed",
    icon: Check,
    className: "bg-muted text-muted-foreground border-border",
    glowClass: "",
  },
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        config.glowClass,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn("h-3 w-3", status === "in_progress" && "animate-spin")}
        />
      )}
      {config.label}
    </span>
  )
}
