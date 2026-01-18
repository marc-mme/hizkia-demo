export type ActivityType = "status_change" | "assignment" | "urgent" | "alert" | "slip"

export interface ActivityEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  type: ActivityType
  action: string
  target: string
  targetId?: string
  details?: string
}

export const activityFeed: ActivityEntry[] = [
  {
    id: "ACT-001",
    timestamp: "2026-01-20T11:45:00",
    userId: "sophie-bernard",
    userName: "Sophie Bernard",
    type: "urgent",
    action: "assessed",
    target: "URG-001",
    details: "Marked as feasible with security vehicle",
  },
  {
    id: "ACT-002",
    timestamp: "2026-01-20T11:30:00",
    userId: "system",
    userName: "System",
    type: "urgent",
    action: "received",
    target: "URG-002",
    details: "New urgent request from Musée du Louvre",
  },
  {
    id: "ACT-003",
    timestamp: "2026-01-20T10:45:00",
    userId: "pierre-martin",
    userName: "Pierre Martin",
    type: "status_change",
    action: "scheduled",
    target: "URG-004",
    targetId: "OP-006",
    details: "Updated start time to 07:00",
  },
  {
    id: "ACT-004",
    timestamp: "2026-01-20T10:30:00",
    userId: "marie-laurent",
    userName: "Marie Laurent",
    type: "status_change",
    action: "marked ready",
    target: "OP-001",
    details: "Louvre delivery ready for dispatch",
  },
  {
    id: "ACT-005",
    timestamp: "2026-01-20T09:15:00",
    userId: "jean-dupont",
    userName: "Jean Dupont",
    type: "assignment",
    action: "assigned to",
    target: "OP-003",
    details: "Christie's auction transport",
  },
  {
    id: "ACT-006",
    timestamp: "2026-01-20T09:00:00",
    userId: "system",
    userName: "System",
    type: "alert",
    action: "warning",
    target: "SLIP-002",
    details: "Slip due in 4 hours - not yet validated",
  },
  {
    id: "ACT-007",
    timestamp: "2026-01-20T08:30:00",
    userId: "marie-laurent",
    userName: "Marie Laurent",
    type: "slip",
    action: "validated",
    target: "SLIP-005",
    details: "Galerie Lafayette delivery slip",
  },
  {
    id: "ACT-008",
    timestamp: "2026-01-20T07:00:00",
    userId: "sophie-bernard",
    userName: "Sophie Bernard",
    type: "slip",
    action: "printed",
    target: "SLIP-006",
    details: "Petit Palais pickup slip",
  },
  {
    id: "ACT-009",
    timestamp: "2026-01-19T19:00:00",
    userId: "pierre-martin",
    userName: "Pierre Martin",
    type: "status_change",
    action: "completed",
    target: "OP-007",
    details: "Private collector delivery completed",
  },
  {
    id: "ACT-010",
    timestamp: "2026-01-19T18:00:00",
    userId: "luc-moreau",
    userName: "Luc Moreau",
    type: "assignment",
    action: "assigned to",
    target: "OP-005",
    details: "Galerie Lafayette delivery",
  },
]

export function getRecentActivity(limit: number = 10): ActivityEntry[] {
  return activityFeed.slice(0, limit)
}

export function getActivityByType(type: ActivityType): ActivityEntry[] {
  return activityFeed.filter((entry) => entry.type === type)
}

export function getActivityByUser(userId: string): ActivityEntry[] {
  return activityFeed.filter((entry) => entry.userId === userId)
}
