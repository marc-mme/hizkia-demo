"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  title?: string
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

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-9 w-9 glass-subtle relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-status-urgent rounded-full text-[10px] flex items-center justify-center text-white font-medium">
            3
          </span>
        </Button>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <button className="h-9 w-9 rounded-full bg-gold flex items-center justify-center text-sm font-semibold text-black">
          MH
        </button>
      </div>
    </header>
  )
}
