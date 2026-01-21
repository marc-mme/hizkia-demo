"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MissionPanelProvider, useMissionPanel } from "@/components/missions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Info, Monitor, Lock, Eye, EyeOff, Mail, Phone, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks"

const STORAGE_KEY = "demo-authorized-access"
const WELCOME_STORAGE_KEY = "demo-welcome-seen"
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "demo"

interface AppShellProps {
  children: React.ReactNode
}

function useAuthGate() {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    // Check query string first
    const urlParams = new URLSearchParams(window.location.search)
    const queryPassword = urlParams.get("public-demo-password")

    if (queryPassword === DEMO_PASSWORD) {
      // Valid password in URL - authorize and clean URL
      localStorage.setItem(STORAGE_KEY, queryPassword)
      setIsAuthorized(true)
      // Remove password from URL for cleaner sharing/bookmarking
      const url = new URL(window.location.href)
      url.searchParams.delete("public-demo-password")
      window.history.replaceState({}, "", url.pathname + (url.search || ""))
      return
    }

    // Fall back to localStorage check
    const storedValue = localStorage.getItem(STORAGE_KEY)
    setIsAuthorized(storedValue === DEMO_PASSWORD)
  }, [])

  const authorize = (password: string): boolean => {
    if (password === DEMO_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, password)
      setIsAuthorized(true)
      return true
    }
    return false
  }

  return { isAuthorized, authorize }
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth")
  const { isAuthorized, authorize } = useAuthGate()
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = authorize(password)
    if (!success) {
      setError(true)
      setPassword("")
    }
  }

  // Still checking localStorage
  if (isAuthorized === null) {
    return (
      <div className="fixed inset-0 z-200 bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not authorized - show password form
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-200 bg-background flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t("title")}<span className="text-gold">.</span></h1>
            <p className="text-muted-foreground">
              {t("passwordProtected")}
              <br />
              {t("enterAccessCode")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("placeholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                className={`h-12 pr-12 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">
                {t("invalidCode")}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gold text-background hover:bg-gold/90"
              disabled={!password}
            >
              {t("accessDemo")}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            {t("contactAdmin")}
          </p>
        </div>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}

function MobileBlocker() {
  const t = useTranslations("mobile")
  const isMobile = useIsMobile(1024)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null
  if (!isMobile) return null

  return (
    <div className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-6">
        <Monitor className="h-10 w-10 text-gold" />
      </div>
      <h1 className="text-2xl font-bold mb-3">{t("desktopOnly")}</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        {t("message")}
      </p>
      <div className="text-xs text-muted-foreground/60">
        {t("viewportTooSmall")}
      </div>
    </div>
  )
}

function DemoBanner() {
  const t = useTranslations("demo")
  return (
    <div className="bg-gold/10 border-b border-gold/30 px-4 py-2 text-center text-sm">
      <span className="inline-flex items-center gap-2 text-gold">
        <Info className="h-4 w-4" />
        <span>{t("banner")}</span>
      </span>
    </div>
  )
}

function WelcomeModal() {
  const t = useTranslations("demo.welcome")
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const hasSeenWelcome = localStorage.getItem(WELCOME_STORAGE_KEY)
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const startTour = React.useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      popoverClass: "driver-popover-custom",
      allowClose: true,
      steps: [
        {
          element: '[data-tour="language"]',
          disableActiveInteraction: false,
          popover: {
            title: t("tour.language.title"),
            description: t("tour.language.description"),
            side: "left",
            align: "center",
          },
        },
        {
          element: '[data-tour="theme"]',
          disableActiveInteraction: false,
          popover: {
            title: t("tour.theme.title"),
            description: t("tour.theme.description"),
            side: "left",
            align: "center",
          },
        },
        {
          element: '[data-tour="sidebar"]',
          popover: {
            title: t("tour.sidebar.title"),
            description: t("tour.sidebar.description"),
            side: "right",
            align: "start",
          },
        },
      ],
    })

    // Small delay to ensure modal is closed and elements are visible
    setTimeout(() => {
      driverObj.drive()
    }, 300)
  }, [t])

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_STORAGE_KEY, "true")
    setIsOpen(false)
    startTour()
  }

  if (!mounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="glass border-gold/30 max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-gold" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {t("subtitle")}
            <br />
            <span className="text-xs">
              {t("proposalBy")}{" "}
              <a
                href="https://marc.agbanavor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Marc Agbanavor
              </a>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t.rich("demonstrationInterface", {
              strong: (chunks: React.ReactNode) => <strong className="text-foreground">{chunks}</strong>
            })}
          </p>

          <div className="bg-linear-to-r from-amber-600 to-amber-700 border-l-4 border-amber-300 rounded-lg p-4 shadow-lg">
            <p className="text-sm text-white leading-relaxed">
              <strong className="text-amber-100 uppercase tracking-wide">{t("important")}</strong> {t("importantMessage")}
            </p>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-gold">{t("technicalNote")}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t("technicalItems.mockedData")}</li>
              <li>{t("technicalItems.noBackend")}</li>
              <li>{t("technicalItems.noPersistence")}</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("exploreMessage")}
          </p>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm font-medium mb-2">{t("questionsLabel")}</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="mailto:me@marc.agbanvor.com"
                className="inline-flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail className="h-4 w-4" />
                me@marc.agbanvor.com
              </a>
              <a
                href="tel:+33785923313"
                className="inline-flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4" />
                07 85 92 33 13
              </a>
            </div>
          </div>
        </div>

        <Button
          onClick={handleDismiss}
          className="w-full bg-gold text-background hover:bg-gold/90"
        >
          {t("dismiss")}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function FloatingActionButton() {
  const { openPanel } = useMissionPanel()
  const pathname = usePathname()

  // Don't show FAB on the new mission page (redundant)
  if (pathname === "/missions/new") return null

  return (
    <Button
      onClick={openPanel}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold text-background hover:bg-gold/90 shadow-lg gold-glow z-40"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <AuthGate>
      <MissionPanelProvider>
        <MobileBlocker />
        <div className="flex flex-col h-screen overflow-hidden">
          <DemoBanner />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
                {children}
              </main>
            </div>
          </div>
          <FloatingActionButton />
          <WelcomeModal />
        </div>
      </MissionPanelProvider>
    </AuthGate>
  )
}
