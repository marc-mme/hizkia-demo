export type SlipStatus = "created" | "validated" | "printed"

export interface TransportSlip {
  id: string
  operationId: string
  status: SlipStatus
  dueTime: string
  assignedTo: string
  client: string
  operationType: string
  createdAt: string
  validatedAt?: string
  printedAt?: string
}

export const slips: TransportSlip[] = [
  {
    id: "SLIP-001",
    operationId: "OP-001",
    status: "validated",
    dueTime: "2026-01-20T08:30:00",
    assignedTo: "marie-laurent",
    client: "Musée du Louvre",
    operationType: "delivery",
    createdAt: "2026-01-19T14:00:00",
    validatedAt: "2026-01-19T16:00:00",
  },
  {
    id: "SLIP-002",
    operationId: "OP-002",
    status: "created",
    dueTime: "2026-01-20T13:00:00",
    assignedTo: "pierre-martin",
    client: "Centre Pompidou",
    operationType: "installation",
    createdAt: "2026-01-19T15:00:00",
  },
  {
    id: "SLIP-003",
    operationId: "OP-003",
    status: "printed",
    dueTime: "2026-01-20T10:00:00",
    assignedTo: "sophie-bernard",
    client: "Christie's Paris",
    operationType: "auction",
    createdAt: "2026-01-19T10:00:00",
    validatedAt: "2026-01-19T11:00:00",
    printedAt: "2026-01-19T12:00:00",
  },
  {
    id: "SLIP-004",
    operationId: "OP-004",
    status: "created",
    dueTime: "2026-01-20T15:30:00",
    assignedTo: "jean-dupont",
    client: "Musée d'Orsay",
    operationType: "pickup",
    createdAt: "2026-01-19T16:00:00",
  },
  {
    id: "SLIP-005",
    operationId: "OP-005",
    status: "validated",
    dueTime: "2026-01-21T07:30:00",
    assignedTo: "luc-moreau",
    client: "Galerie Lafayette",
    operationType: "delivery",
    createdAt: "2026-01-19T17:00:00",
    validatedAt: "2026-01-20T09:00:00",
  },
  {
    id: "SLIP-006",
    operationId: "OP-008",
    status: "printed",
    dueTime: "2026-01-20T10:30:00",
    assignedTo: "marie-laurent",
    client: "Petit Palais",
    operationType: "pickup",
    createdAt: "2026-01-19T18:00:00",
    validatedAt: "2026-01-19T19:00:00",
    printedAt: "2026-01-20T07:00:00",
  },
]

export function getSlipsByStatus(status: SlipStatus): TransportSlip[] {
  return slips.filter((slip) => slip.status === status)
}

export function getSlipColumns() {
  return {
    created: getSlipsByStatus("created"),
    validated: getSlipsByStatus("validated"),
    printed: getSlipsByStatus("printed"),
  }
}
