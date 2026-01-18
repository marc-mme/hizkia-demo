export interface Client {
  id: string
  name: string
  type: "museum" | "gallery" | "auction_house" | "private" | "corporate"
  contact: string
  phone: string
  email: string
  address: string
  notes?: string
}

export interface SavedLocation {
  id: string
  clientId: string
  name: string
  address: string
  contact: string
  phone: string
  instructions: string
  type: "pickup" | "delivery" | "both"
}

export const clients: Client[] = [
  {
    id: "louvre",
    name: "Musée du Louvre",
    type: "museum",
    contact: "Jean-Pierre Dubois",
    phone: "+33 1 40 20 50 50",
    email: "logistics@louvre.fr",
    address: "Rue de Rivoli, 75001 Paris",
    notes: "VIP client - always confirm 48h in advance",
  },
  {
    id: "pompidou",
    name: "Centre Pompidou",
    type: "museum",
    contact: "Marie Lefebvre",
    phone: "+33 1 44 78 12 33",
    email: "transport@centrepompidou.fr",
    address: "Place Georges-Pompidou, 75004 Paris",
    notes: "Loading dock at Rue Beaubourg entrance",
  },
  {
    id: "christies",
    name: "Christie's Paris",
    type: "auction_house",
    contact: "Sophie Martin",
    phone: "+33 1 40 76 85 85",
    email: "shipping@christies.com",
    address: "9 Avenue Matignon, 75008 Paris",
    notes: "High security requirements for valuable items",
  },
  {
    id: "orsay",
    name: "Musée d'Orsay",
    type: "museum",
    contact: "Philippe Renard",
    phone: "+33 1 40 49 48 14",
    email: "transport@musee-orsay.fr",
    address: "1 Rue de la Légion d'Honneur, 75007 Paris",
  },
  {
    id: "cartier",
    name: "Fondation Cartier",
    type: "museum",
    contact: "Claire Moreau",
    phone: "+33 1 42 18 56 50",
    email: "logistics@fondationcartier.com",
    address: "261 Boulevard Raspail, 75014 Paris",
  },
  {
    id: "perrotin",
    name: "Galerie Perrotin",
    type: "gallery",
    contact: "Nicolas Bernard",
    phone: "+33 1 42 16 79 79",
    email: "shipping@perrotin.com",
    address: "76 Rue de Turenne, 75003 Paris",
  },
  {
    id: "kamel",
    name: "Kamel Mennour",
    type: "gallery",
    contact: "Isabelle Durand",
    phone: "+33 1 56 24 03 63",
    email: "transport@kamelmennour.com",
    address: "47 Rue Saint-André des Arts, 75006 Paris",
  },
  {
    id: "private-collector",
    name: "M. Laurent (Private)",
    type: "private",
    contact: "Alexandre Laurent",
    phone: "+33 6 12 34 56 78",
    email: "a.laurent@email.com",
    address: "16th Arrondissement, Paris",
    notes: "Prefers morning deliveries",
  },
]

export const savedLocations: SavedLocation[] = [
  // Louvre locations
  {
    id: "louvre-dock",
    clientId: "louvre",
    name: "Louvre Loading Dock",
    address: "Porte des Lions, Quai François Mitterrand, 75001 Paris",
    contact: "Jean-Pierre Dubois",
    phone: "+33 1 40 20 50 50",
    instructions: "Enter via Porte des Lions. Security check required. Max vehicle height 3.5m.",
    type: "both",
  },
  {
    id: "louvre-richelieu",
    clientId: "louvre",
    name: "Louvre - Richelieu Wing",
    address: "Passage Richelieu, Rue de Rivoli, 75001 Paris",
    contact: "Marc Fontaine",
    phone: "+33 1 40 20 51 51",
    instructions: "Use Passage Richelieu entrance. Staff parking available. Call security on arrival.",
    type: "pickup",
  },
  {
    id: "louvre-storage",
    clientId: "louvre",
    name: "Louvre Reserves (Liévin)",
    address: "Centre de Conservation du Louvre, 62800 Liévin",
    contact: "Émilie Rousseau",
    phone: "+33 3 21 18 62 62",
    instructions: "External storage facility. Book 48h in advance. Climate-controlled loading bay.",
    type: "both",
  },
  // Pompidou locations
  {
    id: "pompidou-beaubourg",
    clientId: "pompidou",
    name: "Pompidou - Beaubourg Entrance",
    address: "Rue Beaubourg, 75004 Paris",
    contact: "Marie Lefebvre",
    phone: "+33 1 44 78 12 33",
    instructions: "Service entrance on Rue Beaubourg. Call 15 min before arrival.",
    type: "both",
  },
  {
    id: "pompidou-rambuteau",
    clientId: "pompidou",
    name: "Pompidou - Rambuteau Loading",
    address: "Rue Rambuteau, 75004 Paris",
    contact: "Thomas Girard",
    phone: "+33 1 44 78 12 40",
    instructions: "Large artwork entrance. Max 4m height clearance. Reservation required.",
    type: "delivery",
  },
  // Christie's locations
  {
    id: "christies-matignon",
    clientId: "christies",
    name: "Christie's Main",
    address: "9 Avenue Matignon, 75008 Paris",
    contact: "Sophie Martin",
    phone: "+33 1 40 76 85 85",
    instructions: "Use service entrance at rear. Photo ID required for all crew.",
    type: "both",
  },
  {
    id: "christies-warehouse",
    clientId: "christies",
    name: "Christie's Secure Storage",
    address: "Zone Industrielle, 93200 Saint-Denis",
    contact: "Laurent Petit",
    phone: "+33 1 40 76 85 90",
    instructions: "High security facility. Pre-registration required. No photography.",
    type: "both",
  },
  // Orsay locations
  {
    id: "orsay-legion",
    clientId: "orsay",
    name: "Orsay Loading Area",
    address: "Quai Anatole France, 75007 Paris",
    contact: "Philippe Renard",
    phone: "+33 1 40 49 48 14",
    instructions: "Loading area accessible from Quai side. Booking required 24h in advance.",
    type: "both",
  },
  {
    id: "orsay-bellechasse",
    clientId: "orsay",
    name: "Orsay - Rue de Bellechasse",
    address: "62 Rue de Bellechasse, 75007 Paris",
    contact: "Nathalie Blanc",
    phone: "+33 1 40 49 48 20",
    instructions: "Staff entrance. Use for smaller items only. Max 2m x 2m.",
    type: "pickup",
  },
  // Cartier locations
  {
    id: "cartier-raspail",
    clientId: "cartier",
    name: "Fondation Cartier - Main",
    address: "261 Boulevard Raspail, 75014 Paris",
    contact: "Claire Moreau",
    phone: "+33 1 42 18 56 50",
    instructions: "Main entrance. Contemporary art building. Loading via basement.",
    type: "both",
  },
  // Perrotin locations
  {
    id: "perrotin-turenne",
    clientId: "perrotin",
    name: "Perrotin - Turenne",
    address: "76 Rue de Turenne, 75003 Paris",
    contact: "Nicolas Bernard",
    phone: "+33 1 42 16 79 79",
    instructions: "Main gallery space. Street parking difficult - use nearby garage.",
    type: "both",
  },
  {
    id: "perrotin-bouloi",
    clientId: "perrotin",
    name: "Perrotin - Rue du Bouloi",
    address: "60 Rue du Bouloi, 75001 Paris",
    contact: "Amélie Vidal",
    phone: "+33 1 42 16 79 80",
    instructions: "Second gallery space. Call before arrival for access code.",
    type: "both",
  },
  // Kamel Mennour locations
  {
    id: "kamel-saint-andre",
    clientId: "kamel",
    name: "Kamel Mennour - Saint-André",
    address: "47 Rue Saint-André des Arts, 75006 Paris",
    contact: "Isabelle Durand",
    phone: "+33 1 56 24 03 63",
    instructions: "Main gallery. Narrow street - morning deliveries preferred.",
    type: "both",
  },
  {
    id: "kamel-mazarine",
    clientId: "kamel",
    name: "Kamel Mennour - Mazarine",
    address: "6 Rue du Pont de Lodi, 75006 Paris",
    contact: "Pierre Lemaire",
    phone: "+33 1 56 24 03 64",
    instructions: "Secondary space. Easier access than Saint-André.",
    type: "both",
  },
  // Private collector
  {
    id: "private-residence",
    clientId: "private-collector",
    name: "Residence (16th)",
    address: "Avenue Foch, 75116 Paris",
    contact: "Alexandre Laurent",
    phone: "+33 6 12 34 56 78",
    instructions: "Private residence. Concierge access. No street parking - use building garage.",
    type: "both",
  },
]

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}

export function getLocationsByClient(clientId: string): SavedLocation[] {
  return savedLocations.filter((l) => l.clientId === clientId)
}

export function searchClients(query: string): Client[] {
  const lower = query.toLowerCase()
  return clients.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      c.contact.toLowerCase().includes(lower)
  )
}
