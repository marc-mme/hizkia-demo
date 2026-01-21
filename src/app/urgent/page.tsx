"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { urgentRequests, type UrgentRequest, type UrgentStage } from "@/data/urgent"
import { crew } from "@/data/crew"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Inbox,
  Search,
  CheckCircle,
  Calendar,
  Clock,
  User,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  History,
} from "lucide-react"

const stageConfig: Record<
  UrgentStage,
  { labelKey: string; icon: typeof Inbox; color: string; bgColor: string }
> = {
  received: {
    labelKey: "received",
    icon: Inbox,
    color: "text-status-urgent",
    bgColor: "bg-status-urgent/10",
  },
  assessed: {
    labelKey: "assessed",
    icon: Search,
    color: "text-status-visible",
    bgColor: "bg-status-visible/10",
  },
  approved: {
    labelKey: "approved",
    icon: CheckCircle,
    color: "text-status-info",
    bgColor: "bg-status-info/10",
  },
  scheduled: {
    labelKey: "scheduled",
    icon: Calendar,
    color: "text-status-ready",
    bgColor: "bg-status-ready/10",
  },
}

const stages: UrgentStage[] = ["received", "assessed", "approved", "scheduled"]

export default function UrgentPage() {
  const t = useTranslations("urgent")
  const tCommon = useTranslations("common")
  const [requests, setRequests] = React.useState(urgentRequests)
  const [selectedRequest, setSelectedRequest] = React.useState<UrgentRequest | null>(null)
  const [actionNote, setActionNote] = React.useState("")

  const requestsByStage = React.useMemo(() => {
    const grouped: Record<UrgentStage, UrgentRequest[]> = {
      received: [],
      assessed: [],
      approved: [],
      scheduled: [],
    }
    requests.forEach((req) => {
      grouped[req.stage].push(req)
    })
    return grouped
  }, [requests])

  const pendingCount = requests.filter((r) => r.stage !== "scheduled").length

  const advanceStage = (request: UrgentRequest, note?: string) => {
    const currentIndex = stages.indexOf(request.stage)
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1]
      const currentUser = crew[0] // Simulated current user

      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? {
                ...r,
                stage: nextStage,
                history: [
                  ...r.history,
                  {
                    stage: nextStage,
                    timestamp: new Date().toISOString(),
                    by: currentUser.id,
                    notes: note,
                  },
                ],
              }
            : r
        )
      )
    }
    setSelectedRequest(null)
    setActionNote("")
  }

  const getOwnerName = (ownerId: string) => {
    const owner = crew.find((c) => c.id === ownerId)
    return owner?.name || ownerId
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-status-visible/20 text-status-visible border-status-visible/30 py-1 px-3">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {pendingCount === 1 ? t("pendingRequest") : t("pendingRequests", { count: pendingCount })}
          </Badge>
        )}
      </div>

      {/* Stage Pipeline */}
      <div className="flex items-center justify-between mb-6">
        {stages.map((stage, index) => {
          const config = stageConfig[stage]
          const Icon = config.icon
          const count = requestsByStage[stage].length

          return (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    config.bgColor
                  )}
                >
                  <Icon className={cn("h-6 w-6", config.color)} />
                </div>
                <p className="text-sm font-medium mt-2">{t(`stages.${config.labelKey}`)}</p>
                <Badge variant="secondary" className="mt-1">
                  {count}
                </Badge>
              </div>
              {index < stages.length - 1 && (
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Request Cards */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {requests
            .filter((r) => r.stage !== "scheduled")
            .sort(
              (a, b) =>
                new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
            )
            .map((request) => {
              const config = stageConfig[request.stage]
              const Icon = config.icon
              const owner = crew.find((c) => c.id === request.owner)

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card
                    className={cn(
                      "glass cursor-pointer transition-all hover:scale-[1.01]",
                      request.stage === "received" && "border-status-urgent/50"
                    )}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              config.bgColor
                            )}
                          >
                            <Icon className={cn("h-5 w-5", config.color)} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{request.client}</p>
                              <Badge
                                variant="outline"
                                className={cn("text-xs", config.color)}
                              >
                                {t(`stages.${config.labelKey}`)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t("labels.received")}{" "}
                                {formatDistanceToNow(parseISO(request.receivedAt), {
                                  addSuffix: true,
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {t("labels.due")}{" "}
                                {format(
                                  parseISO(request.requestedDeadline),
                                  "MMM d, HH:mm"
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {owner?.name || request.owner}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-subtle"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRequest(request)
                          }}
                        >
                          {request.stage === "received"
                            ? t("actions.assess")
                            : request.stage === "assessed"
                            ? t("actions.approve")
                            : t("actions.schedule")}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
        </AnimatePresence>

        {pendingCount === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-status-ready" />
            <p className="text-lg font-medium">{t("allCaughtUp")}</p>
            <p className="text-sm">{t("noPendingRequests")}</p>
          </div>
        )}
      </div>

      {/* Completed Section */}
      {requestsByStage.scheduled.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            {t("recentlyScheduled")}
          </h2>
          <div className="space-y-2">
            {requestsByStage.scheduled.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-status-ready" />
                  <span className="font-medium">{request.client}</span>
                  <span className="text-sm text-muted-foreground">
                    {request.summary}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("stages.scheduled")}{" "}
                  {formatDistanceToNow(
                    parseISO(request.history[request.history.length - 1].timestamp),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => {
          setSelectedRequest(null)
          setActionNote("")
        }}
      >
        <DialogContent className="glass max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-visible" />
              {selectedRequest?.client}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedRequest.summary}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t("labels.requestedDeadline")}</p>
                  <p className="font-medium">
                    {format(
                      parseISO(selectedRequest.requestedDeadline),
                      "MMM d, HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("labels.received")}</p>
                  <p className="font-medium">
                    {format(parseISO(selectedRequest.receivedAt), "MMM d, HH:mm")}
                  </p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="p-3 rounded-lg bg-accent/50">
                  <p className="text-sm text-muted-foreground mb-1">{t("labels.notes")}</p>
                  <p className="text-sm">{selectedRequest.notes}</p>
                </div>
              )}

              {/* History */}
              <div className="border-t border-glass-border pt-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <History className="h-4 w-4" />
                  {t("labels.history")}
                </p>
                <div className="space-y-2">
                  {selectedRequest.history.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5",
                          stageConfig[entry.stage].bgColor
                        )}
                      />
                      <div>
                        <span className="font-medium">
                          {t(`stages.${entry.stage}`)}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          by {getOwnerName(entry.by)}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(entry.timestamp), "MMM d, HH:mm")}
                        </p>
                        {entry.notes && (
                          <p className="text-xs mt-1 text-muted-foreground italic">
                            &ldquo;{entry.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Note */}
              {selectedRequest.stage !== "scheduled" && (
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    {t("labels.addNote")}
                  </label>
                  <Textarea
                    placeholder={t("notePlaceholder")}
                    value={actionNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setActionNote(e.target.value)
                    }
                    className="glass-subtle"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null)
                setActionNote("")
              }}
            >
              {tCommon("actions.cancel")}
            </Button>
            {selectedRequest && selectedRequest.stage !== "scheduled" && (
              <Button
                onClick={() => advanceStage(selectedRequest, actionNote)}
                className={cn(
                  selectedRequest.stage === "assessed" &&
                    "bg-status-info hover:bg-status-info/90",
                  selectedRequest.stage === "approved" &&
                    "bg-status-ready hover:bg-status-ready/90"
                )}
              >
                {selectedRequest.stage === "received"
                  ? t("buttons.markAsAssessed")
                  : selectedRequest.stage === "assessed"
                  ? t("buttons.approveRequest")
                  : t("buttons.addToSchedule")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
