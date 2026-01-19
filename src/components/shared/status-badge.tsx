"use client"

import { cn } from "@/lib/utils"
import { Check, Eye, Loader2, CircleCheckBig } from "lucide-react"
import { useTranslations } from "next-intl"

type Status = "visible" | "ready" | "in_progress" | "completed"

interface StatusBadgeProps {
  status: Status
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<
  Status,
  { labelKey: string; icon: typeof Check; className: string; glowClass: string }
> = {
  visible: {
    labelKey: "visible",
    icon: Eye,
    className: "bg-status-visible/20 text-status-visible border-status-visible/30",
    glowClass: "status-visible-glow",
  },
  ready: {
    labelKey: "ready",
    icon: Check,
    className: "bg-status-ready/20 text-status-ready border-status-ready/30",
    glowClass: "status-ready-glow",
  },
  in_progress: {
    labelKey: "inProgress",
    icon: Loader2,
    className: "bg-status-info/20 text-status-info border-status-info/30",
    glowClass: "status-info-glow",
  },
  completed: {
    labelKey: "completed",
    icon: CircleCheckBig,
    className: "bg-status-completed/20 text-status-completed border-status-completed/30",
    glowClass: "status-completed-glow",
  },
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const t = useTranslations("common.status")
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
      {t(config.labelKey)}
    </span>
  )
}
