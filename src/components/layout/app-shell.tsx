"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MissionPanelProvider, useMissionPanel } from "@/components/missions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Info, Monitor, Lock, Eye, EyeOff } from "lucide-react"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks"

const STORAGE_KEY = "demo-authorized-access"
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
      <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not authorized - show password form
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-gold" />
            </div>
            <h1 className="text-3xl font-bold mb-2">HIZKIA<span className="text-gold">.</span></h1>
            <p className="text-muted-foreground">
              This demo is password protected.
              <br />
              Please enter the access code to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter access code"
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
                Invalid access code. Please try again.
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gold text-background hover:bg-gold/90"
              disabled={!password}
            >
              Access Demo
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            Contact the administrator if you need access credentials.
          </p>
        </div>
      </div>
    )
  }

  // Authorized - render children
  return <>{children}</>
}

function MobileBlocker() {
  const isMobile = useIsMobile(1024)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null
  if (!isMobile) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-6">
        <Monitor className="h-10 w-10 text-gold" />
      </div>
      <h1 className="text-2xl font-bold mb-3">Desktop Only</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        HIZKIA Operations Dashboard is designed for desktop screens.
        Please access this application from a device with a larger screen (1024px or wider).
      </p>
      <div className="text-xs text-muted-foreground/60">
        Current viewport is too small for optimal experience
      </div>
    </div>
  )
}

function DemoBanner() {
  return (
    <div className="bg-gold/10 border-b border-gold/30 px-4 py-2 text-center text-sm">
      <span className="inline-flex items-center gap-2 text-gold">
        <Info className="h-4 w-4" />
        <span>
          <strong>Demo Mode</strong> — This is a demonstration interface. All data is mocked and no backend is connected.
        </span>
      </span>
    </div>
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
        </div>
      </MissionPanelProvider>
    </AuthGate>
  )
}
