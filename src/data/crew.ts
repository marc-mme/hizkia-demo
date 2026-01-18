export interface CrewMember {
  id: string
  name: string
  avatar: string
  certifications: string[]
  available: boolean
  todayOps: number
  phone: string
  role: string
}

export const crew: CrewMember[] = [
  {
    id: "jean-dupont",
    name: "Jean Dupont",
    avatar: "JD",
    certifications: ["climate-control", "fragile-handling", "oversized-transport"],
    available: true,
    todayOps: 2,
    phone: "+33 6 12 34 56 78",
    role: "Senior Handler",
  },
  {
    id: "marie-laurent",
    name: "Marie Laurent",
    avatar: "ML",
    certifications: ["climate-control", "fragile-handling"],
    available: true,
    todayOps: 3,
    phone: "+33 6 23 45 67 89",
    role: "Art Handler",
  },
  {
    id: "pierre-martin",
    name: "Pierre Martin",
    avatar: "PM",
    certifications: ["installation-crew", "oversized-transport", "crane-certified"],
    available: true,
    todayOps: 1,
    phone: "+33 6 34 56 78 90",
    role: "Installation Specialist",
  },
  {
    id: "sophie-bernard",
    name: "Sophie Bernard",
    avatar: "SB",
    certifications: ["security-escort", "fragile-handling", "installation-crew"],
    available: true,
    todayOps: 2,
    phone: "+33 6 45 67 89 01",
    role: "Security Escort",
  },
  {
    id: "luc-moreau",
    name: "Luc Moreau",
    avatar: "LM",
    certifications: ["security-escort", "climate-control"],
    available: false,
    todayOps: 0,
    phone: "+33 6 56 78 90 12",
    role: "Transport Driver",
  },
  {
    id: "claire-petit",
    name: "Claire Petit",
    avatar: "CP",
    certifications: ["fragile-handling", "climate-control"],
    available: true,
    todayOps: 0,
    phone: "+33 6 67 89 01 23",
    role: "Art Handler",
  },
]

export function getAvailableCrew(): CrewMember[] {
  return crew.filter((member) => member.available)
}

export function getCrewByIds(ids: string[]): CrewMember[] {
  return crew.filter((member) => ids.includes(member.id))
}

export function getCrewWithCertification(cert: string): CrewMember[] {
  return crew.filter((member) => member.certifications.includes(cert))
}
