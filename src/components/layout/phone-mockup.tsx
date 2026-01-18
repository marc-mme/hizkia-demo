"use client"

import { cn } from "@/lib/utils"

interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />

          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[38px] overflow-hidden">
            {/* Status Bar */}
            <div className="h-12 flex items-center justify-between px-8 pt-2">
              <span className="text-xs font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-foreground rounded-sm" />
                  <div className="w-1 h-3 bg-foreground rounded-sm" />
                  <div className="w-1 h-4 bg-foreground rounded-sm" />
                  <div className="w-1 h-2 bg-muted-foreground rounded-sm" />
                </div>
                <span className="text-xs ml-1">5G</span>
                <div className="w-6 h-3 border border-foreground rounded-sm ml-1 relative">
                  <div className="absolute inset-0.5 bg-status-ready rounded-sm" style={{ width: "70%" }} />
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-foreground rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-3rem)] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>

        {/* Side Button */}
        <div className="absolute right-0 top-32 w-1 h-16 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-0 top-24 w-1 h-8 bg-zinc-700 rounded-r-sm" />
        <div className="absolute left-0 top-36 w-1 h-12 bg-zinc-700 rounded-r-sm" />
        <div className="absolute left-0 top-52 w-1 h-12 bg-zinc-700 rounded-r-sm" />
      </div>
    </div>
  )
}
