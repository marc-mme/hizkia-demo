export type OperationStatus = "visible" | "ready" | "in_progress" | "completed"
export type OperationType = "delivery" | "pickup" | "installation" | "auction"

export interface Operation {
  id: string
  client: string
  type: OperationType
  status: OperationStatus
  dateTime: string
  crew: string[]
  vehicle: string
  location: {
    pickup: string
    delivery: string
  }
  notes: string
  specialRequirements?: string[]
}

export const operations: Operation[] = [
  {
    id: "OP-001",
    client: "Musée du Louvre",
    type: "delivery",
    status: "ready",
    dateTime: "2026-01-20T09:00:00",
    crew: ["jean-dupont", "marie-laurent"],
    vehicle: "climate-van-01",
    location: {
      pickup: "Entrepôt HIZKIA, Tremblay-en-France",
      delivery: "Musée du Louvre, Aile Richelieu",
    },
    notes: "Renaissance painting collection - Handle with extreme care",
    specialRequirements: ["climate-control", "fragile-handling"],
  },
  {
    id: "OP-002",
    client: "Centre Pompidou",
    type: "installation",
    status: "visible",
    dateTime: "2026-01-20T14:00:00",
    crew: ["pierre-martin"],
    vehicle: "art-truck-02",
    location: {
      pickup: "Centre Pompidou Storage",
      delivery: "Centre Pompidou, Gallery 4",
    },
    notes: "Contemporary sculpture installation - Team of 3 required",
    specialRequirements: ["oversized-transport", "installation-crew"],
  },
  {
    id: "OP-003",
    client: "Christie's Paris",
    type: "auction",
    status: "in_progress",
    dateTime: "2026-01-20T10:30:00",
    crew: ["sophie-bernard", "luc-moreau"],
    vehicle: "secure-van-01",
    location: {
      pickup: "Private Collection, 16ème",
      delivery: "Christie's Paris, Avenue Matignon",
    },
    notes: "Pre-auction transport - High-value impressionist works",
    specialRequirements: ["security-escort", "insurance-verified"],
  },
  {
    id: "OP-004",
    client: "Musée d'Orsay",
    type: "pickup",
    status: "visible",
    dateTime: "2026-01-20T16:00:00",
    crew: ["jean-dupont"],
    vehicle: "climate-van-02",
    location: {
      pickup: "Musée d'Orsay, Niveau 5",
      delivery: "Restoration Workshop, Saint-Denis",
    },
    notes: "Impressionist painting for restoration",
    specialRequirements: ["climate-control"],
  },
  {
    id: "OP-005",
    client: "Galerie Lafayette Haussmann",
    type: "delivery",
    status: "ready",
    dateTime: "2026-01-21T08:00:00",
    crew: ["marie-laurent", "luc-moreau"],
    vehicle: "art-truck-01",
    location: {
      pickup: "Entrepôt HIZKIA, Tremblay-en-France",
      delivery: "Galerie Lafayette, 9ème",
    },
    notes: "Art exhibition pieces for retail display",
  },
  {
    id: "OP-006",
    client: "Fondation Louis Vuitton",
    type: "installation",
    status: "visible",
    dateTime: "2026-01-21T10:00:00",
    crew: ["pierre-martin", "sophie-bernard", "jean-dupont"],
    vehicle: "oversized-trailer-01",
    location: {
      pickup: "Artist Studio, Montreuil",
      delivery: "Fondation Louis Vuitton, Bois de Boulogne",
    },
    notes: "Large-scale contemporary installation - 4m x 3m x 2m",
    specialRequirements: ["oversized-transport", "installation-crew", "crane-required"],
  },
  {
    id: "OP-007",
    client: "Private Collector",
    type: "delivery",
    status: "completed",
    dateTime: "2026-01-19T14:00:00",
    crew: ["luc-moreau"],
    vehicle: "secure-van-02",
    location: {
      pickup: "Sotheby's Paris",
      delivery: "Private Residence, Neuilly-sur-Seine",
    },
    notes: "Post-auction delivery - 19th century bronze sculpture",
    specialRequirements: ["security-escort"],
  },
  {
    id: "OP-008",
    client: "Petit Palais",
    type: "pickup",
    status: "ready",
    dateTime: "2026-01-20T11:00:00",
    crew: ["marie-laurent"],
    vehicle: "climate-van-01",
    location: {
      pickup: "Petit Palais, Avenue Winston Churchill",
      delivery: "Entrepôt HIZKIA, Tremblay-en-France",
    },
    notes: "End of exhibition return - 12 framed works",
    specialRequirements: ["climate-control", "fragile-handling"],
  },
]

export function getOperationsByStatus(status: OperationStatus): Operation[] {
  return operations.filter((op) => op.status === status)
}

export function getOperationsByDate(date: string): Operation[] {
  return operations.filter((op) => op.dateTime.startsWith(date))
}

export function getTodayOperations(): Operation[] {
  const today = new Date().toISOString().split("T")[0]
  return getOperationsByDate(today)
}
