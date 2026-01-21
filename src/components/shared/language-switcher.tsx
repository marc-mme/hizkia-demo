"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { locales, type Locale } from "@/i18n/config"

const languageNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
}

function FlagEN({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30" stroke="#C8102E" strokeWidth="4" strokeDasharray="30,60" strokeDashoffset="15"/>
      <path d="M60,0 L0,30" stroke="#C8102E" strokeWidth="4" strokeDasharray="30,60" strokeDashoffset="15"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  )
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
      <rect width="3" height="2" fill="#ED2939"/>
      <rect width="2" height="2" fill="#fff"/>
      <rect width="1" height="2" fill="#002395"/>
    </svg>
  )
}

const FlagComponents: Record<Locale, React.FC<{ className?: string }>> = {
  en: FlagEN,
  fr: FlagFR,
}

export function LanguageSwitcher() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = React.useState<Locale>("en")

  React.useEffect(() => {
    // Read current locale from cookie
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
    const locale = cookie?.split("=")[1] as Locale | undefined
    if (locale && locales.includes(locale)) {
      setCurrentLocale(locale)
    }
  }, [])

  const handleLocaleChange = (locale: Locale) => {
    // Set cookie (expires in 1 year)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(locale)
    // Refresh to apply new locale
    router.refresh()
  }

  const CurrentFlag = FlagComponents[currentLocale]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 glass-subtle" data-tour="language">
          <CurrentFlag className="h-5 w-7" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] glass">
        {locales.map((locale) => {
          const Flag = FlagComponents[locale]
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={currentLocale === locale ? "bg-accent" : ""}
            >
              <Flag className="h-4 w-6 mr-2" />
              {languageNames[locale]}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
