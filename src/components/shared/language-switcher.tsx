"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"
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

const languageFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 glass-subtle">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] glass">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            <span className="mr-2">{languageFlags[locale]}</span>
            {languageNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
