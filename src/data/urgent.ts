export type UrgentStage = "received" | "assessed" | "approved" | "scheduled"

export interface UrgentRequest {
  id: string
  client: string
  summary: string
  requestedDeadline: string
  receivedAt: string
  stage: UrgentStage
  owner: string
  notes?: string
  history: {
    stage: UrgentStage
    timestamp: string
    by: string
    notes?: string
  }[]
}

export const urgentRequests: UrgentRequest[] = [
  {
    id: "URG-001",
    client: "Christie's Paris",
    summary: "Emergency pickup - Buyer changed delivery location",
    requestedDeadline: "2026-01-20T16:00:00",
    receivedAt: "2026-01-20T09:15:00",
    stage: "assessed",
    owner: "sophie-bernard",
    notes: "Buyer relocated to Monaco, need secure transport",
    history: [
      {
        stage: "received",
        timestamp: "2026-01-20T09:15:00",
        by: "system",
      },
      {
        stage: "assessed",
        timestamp: "2026-01-20T09:45:00",
        by: "sophie-bernard",
        notes: "Feasible but requires security vehicle",
      },
    ],
  },
  {
    id: "URG-002",
    client: "Musée du Louvre",
    summary: "Additional artwork for tomorrow's exhibition",
    requestedDeadline: "2026-01-21T08:00:00",
    receivedAt: "2026-01-20T11:30:00",
    stage: "received",
    owner: "jean-dupont",
    history: [
      {
        stage: "received",
        timestamp: "2026-01-20T11:30:00",
        by: "system",
      },
    ],
  },
  {
    id: "URG-003",
    client: "Private Collector",
    summary: "Insurance inspection required before Friday",
    requestedDeadline: "2026-01-24T12:00:00",
    receivedAt: "2026-01-19T16:00:00",
    stage: "approved",
    owner: "marie-laurent",
    history: [
      {
        stage: "received",
        timestamp: "2026-01-19T16:00:00",
        by: "system",
      },
      {
        stage: "assessed",
        timestamp: "2026-01-19T17:00:00",
        by: "marie-laurent",
        notes: "Standard inspection, crew available",
      },
      {
        stage: "approved",
        timestamp: "2026-01-20T08:00:00",
        by: "pierre-martin",
        notes: "Approved - Added to Thursday schedule",
      },
    ],
  },
  {
    id: "URG-004",
    client: "Fondation Louis Vuitton",
    summary: "Artist requests earlier installation time",
    requestedDeadline: "2026-01-21T07:00:00",
    receivedAt: "2026-01-20T10:00:00",
    stage: "scheduled",
    owner: "pierre-martin",
    history: [
      {
        stage: "received",
        timestamp: "2026-01-20T10:00:00",
        by: "system",
      },
      {
        stage: "assessed",
        timestamp: "2026-01-20T10:15:00",
        by: "pierre-martin",
        notes: "Can accommodate - crew confirmed",
      },
      {
        stage: "approved",
        timestamp: "2026-01-20T10:30:00",
        by: "sophie-bernard",
      },
      {
        stage: "scheduled",
        timestamp: "2026-01-20T10:45:00",
        by: "pierre-martin",
        notes: "OP-006 updated to 07:00 start",
      },
    ],
  },
]

export function getUrgentByStage(stage: UrgentStage): UrgentRequest[] {
  return urgentRequests.filter((req) => req.stage === stage)
}

export function getPendingUrgent(): UrgentRequest[] {
  return urgentRequests.filter((req) => req.stage !== "scheduled")
}
