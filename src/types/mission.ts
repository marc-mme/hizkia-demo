export type MissionType = "pickup" | "delivery" | "round_trip" | "installation"

export type ArtworkCategory =
  | "painting"
  | "sculpture"
  | "photography"
  | "mixed_media"
  | "archive"

export type SpecialHandling =
  | "fragile"
  | "climate_controlled"
  | "oversized"
  | "high_value"

export type Certification =
  | "art_handler"
  | "climate_vehicle"
  | "heavy_lift"
  | "museum_clearance"

export type VehicleType = "van" | "climate_van" | "truck" | "oversized"

export type Equipment =
  | "blankets"
  | "crates"
  | "climate_packaging"
  | "custom_frame"
  | "soft_straps"

export interface ArtworkItem {
  id: string
  description: string
  category: ArtworkCategory
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight: number
  insuranceValue: number | null
}

export interface MissionFormData {
  // Step 1: Client & Mission Type
  clientId: string
  clientName: string
  missionType: MissionType
  referenceNumber: string
  internalNotes: string

  // Step 2: Artwork
  artworks: ArtworkItem[]
  useOverallDimensions: boolean
  overallDimensions: {
    length: number
    width: number
    height: number
  }
  overallWeight: number
  specialHandling: SpecialHandling[]
  totalInsuranceValue: number | null

  // Step 3: Pickup
  pickupLocation: string
  pickupContact: string
  pickupPhone: string
  pickupDateTime: string
  pickupInstructions: string

  // Step 4: Delivery
  deliveryLocation: string
  deliveryContact: string
  deliveryPhone: string
  deliveryDateTime: string
  deliveryInstructions: string
  sameAsPickup: boolean

  // Step 5: Requirements
  certifications: Certification[]
  vehicleType: VehicleType
  crewSize: 1 | 2 | 3
  equipment: Equipment[]

  // Pricing
  baseRate: number
  additionalFees: { label: string; amount: number }[]
  totalQuote: number
}

export const defaultMissionFormData: MissionFormData = {
  clientId: "",
  clientName: "",
  missionType: "delivery",
  referenceNumber: "",
  internalNotes: "",

  artworks: [],
  useOverallDimensions: false,
  overallDimensions: { length: 0, width: 0, height: 0 },
  overallWeight: 0,
  specialHandling: [],
  totalInsuranceValue: null,

  pickupLocation: "",
  pickupContact: "",
  pickupPhone: "",
  pickupDateTime: "",
  pickupInstructions: "",

  deliveryLocation: "",
  deliveryContact: "",
  deliveryPhone: "",
  deliveryDateTime: "",
  deliveryInstructions: "",
  sameAsPickup: false,

  certifications: [],
  vehicleType: "van",
  crewSize: 2,
  equipment: [],

  baseRate: 0,
  additionalFees: [],
  totalQuote: 0,
}

export const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  round_trip: "Round Trip",
  installation: "Installation",
}

export const CATEGORY_LABELS: Record<ArtworkCategory, string> = {
  painting: "Painting",
  sculpture: "Sculpture",
  photography: "Photography",
  mixed_media: "Mixed Media",
  archive: "Archive / Documents",
}

export const SPECIAL_HANDLING_LABELS: Record<SpecialHandling, string> = {
  fragile: "Fragile",
  climate_controlled: "Climate Controlled",
  oversized: "Oversized",
  high_value: "High Value (€100k+)",
}

export const CERTIFICATION_LABELS: Record<Certification, string> = {
  art_handler: "Art Handler Certified",
  climate_vehicle: "Climate Vehicle",
  heavy_lift: "Heavy Lift Equipment",
  museum_clearance: "Museum Clearance",
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  van: "Van",
  climate_van: "Climate Van",
  truck: "Truck",
  oversized: "Oversized Vehicle",
}

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  blankets: "Moving Blankets",
  crates: "Wooden Crates",
  climate_packaging: "Climate Packaging",
  custom_frame: "Custom Frame Protection",
  soft_straps: "Soft Straps",
}
