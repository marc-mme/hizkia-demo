"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type TransportSlip } from "@/data/slips"
import { crew } from "@/data/crew"
import { format, parseISO } from "date-fns"
import { Printer, FileText } from "lucide-react"

interface SlipPrintableProps {
  slip: TransportSlip
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock additional data for the printable slip
const getMockSlipDetails = (slip: TransportSlip) => {
  const details: Record<string, {
    artwork: { title: string; artist: string; medium: string; dimensions: string }[]
    pickup: { name: string; address: string; contact: string; phone: string }
    delivery: { name: string; address: string; contact: string; phone: string }
    instructions: string[]
    equipment: string[]
  }> = {
    "OP-001": {
      artwork: [
        { title: "La Liberté guidant le peuple", artist: "Eugène Delacroix", medium: "Oil on canvas", dimensions: "260 × 325 cm" }
      ],
      pickup: { name: "Musée du Louvre", address: "Rue de Rivoli, 75001 Paris", contact: "M. Dubois", phone: "+33 1 40 20 50 50" },
      delivery: { name: "Centre Pompidou", address: "Place Georges-Pompidou, 75004 Paris", contact: "Mme. Martin", phone: "+33 1 44 78 12 33" },
      instructions: ["Handle with extreme care - masterpiece", "Climate controlled transport required", "Armed escort required"],
      equipment: ["Climate-controlled van", "Art handlers (2)", "Custom crate"],
    },
    "OP-002": {
      artwork: [
        { title: "Composition VIII", artist: "Wassily Kandinsky", medium: "Oil on canvas", dimensions: "140 × 201 cm" },
        { title: "Black Square", artist: "Kazimir Malevich", medium: "Oil on linen", dimensions: "79.5 × 79.5 cm" },
      ],
      pickup: { name: "Centre Pompidou Storage", address: "Rue Beaubourg, 75003 Paris", contact: "M. Laurent", phone: "+33 1 44 78 12 00" },
      delivery: { name: "Centre Pompidou - Level 5", address: "Place Georges-Pompidou, 75004 Paris", contact: "Mme. Petit", phone: "+33 1 44 78 12 33" },
      instructions: ["Gallery installation - prepare mounting hardware", "Coordinate with exhibition team"],
      equipment: ["Art handlers (3)", "Mounting equipment", "Ladders"],
    },
    "OP-003": {
      artwork: [
        { title: "Untitled (Still Life)", artist: "Pablo Picasso", medium: "Oil on canvas", dimensions: "92 × 73 cm" }
      ],
      pickup: { name: "Private Collection", address: "Avenue Montaigne, 75008 Paris", contact: "M. Richter", phone: "+33 1 53 67 84 00" },
      delivery: { name: "Christie's Paris", address: "9 Avenue Matignon, 75008 Paris", contact: "Mme. Beaumont", phone: "+33 1 40 76 85 85" },
      instructions: ["High value item - insurance documentation required", "Condition report before and after", "Photography prohibited"],
      equipment: ["Security van", "Art handlers (2)", "Condition report kit"],
    },
    "OP-004": {
      artwork: [
        { title: "Le Déjeuner sur l'herbe", artist: "Édouard Manet", medium: "Oil on canvas", dimensions: "208 × 264 cm" }
      ],
      pickup: { name: "Musée d'Orsay", address: "1 Rue de la Légion d'Honneur, 75007 Paris", contact: "M. Renaud", phone: "+33 1 40 49 48 14" },
      delivery: { name: "Conservation Workshop", address: "Rue de l'Abbé de l'Épée, 75005 Paris", contact: "Dr. Moreau", phone: "+33 1 40 46 22 11" },
      instructions: ["Conservation treatment - no direct sunlight", "Document all existing damage", "Use vibration dampeners"],
      equipment: ["Suspended transport system", "Conservation staff escort", "Environmental monitoring"],
    },
    "OP-005": {
      artwork: [
        { title: "Contemporary Sculpture #7", artist: "Jean Dubuffet", medium: "Painted polyurethane", dimensions: "180 × 120 × 90 cm" }
      ],
      pickup: { name: "Artist Estate", address: "Périgny-sur-Yerres, 94520", contact: "Fondation Dubuffet", phone: "+33 1 47 34 12 63" },
      delivery: { name: "Galeries Lafayette", address: "40 Boulevard Haussmann, 75009 Paris", contact: "M. Vidal", phone: "+33 1 42 82 34 56" },
      instructions: ["Retail display installation", "Coordinate with store hours", "Public area - use barriers"],
      equipment: ["Flatbed truck", "Rigging equipment", "Installation crew (4)"],
    },
    "OP-008": {
      artwork: [
        { title: "Portrait of a Lady", artist: "Unknown (18th century)", medium: "Oil on canvas", dimensions: "65 × 54 cm" }
      ],
      pickup: { name: "Petit Palais", address: "Avenue Winston Churchill, 75008 Paris", contact: "Mme. Garcia", phone: "+33 1 53 43 40 00" },
      delivery: { name: "Restoration Studio", address: "Quai de la Mégisserie, 75001 Paris", contact: "M. Blanc", phone: "+33 1 42 36 71 88" },
      instructions: ["Fragile frame - support corners", "Document varnish condition"],
      equipment: ["Padded transport case", "Art handler (1)"],
    },
  }

  return details[slip.operationId] || {
    artwork: [{ title: "Artwork Details", artist: "Artist Name", medium: "Medium", dimensions: "Dimensions" }],
    pickup: { name: slip.client, address: "Address TBC", contact: "Contact TBC", phone: "Phone TBC" },
    delivery: { name: "Destination", address: "Address TBC", contact: "Contact TBC", phone: "Phone TBC" },
    instructions: ["Handle with care"],
    equipment: ["Standard transport"],
  }
}

export function SlipPrintable({ slip, open, onOpenChange }: SlipPrintableProps) {
  const printRef = React.useRef<HTMLDivElement>(null)
  const details = getMockSlipDetails(slip)
  const assignedCrew = crew.find((c) => c.id === slip.assignedTo)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transport Slip ${slip.id}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Arial', sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              padding: 20px;
              color: #000;
            }
            .slip-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px; }
            .slip-logo { font-size: 24pt; font-weight: bold; letter-spacing: 2px; }
            .slip-logo-dot { color: #d4af37; }
            .slip-tagline { font-size: 9pt; color: #666; margin-top: 5px; }
            .slip-info { text-align: right; }
            .slip-id { font-size: 14pt; font-weight: bold; }
            .slip-op { color: #666; font-size: 10pt; }
            .slip-badge { display: inline-block; padding: 2px 8px; background: #d4af37; color: #fff; font-size: 9pt; font-weight: bold; text-transform: uppercase; border-radius: 3px; margin-top: 5px; }
            .slip-section { margin-bottom: 15px; }
            .slip-section-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; background: #f5f5f5; padding: 5px 10px; margin-bottom: 10px; border-left: 3px solid #d4af37; }
            .slip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .slip-field { margin-bottom: 8px; }
            .slip-field-label { font-size: 9pt; color: #666; text-transform: uppercase; }
            .slip-field-value { font-weight: 500; }
            .slip-artwork-item { padding: 10px; background: #fafafa; margin-bottom: 8px; border-left: 2px solid #ddd; }
            .slip-artwork-title { font-weight: bold; }
            .slip-artwork-meta { font-size: 10pt; color: #666; }
            .slip-list-item { padding: 3px 0; padding-left: 15px; position: relative; }
            .slip-list-item:before { content: "•"; position: absolute; left: 0; color: #d4af37; }
            .slip-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #ccc; }
            .slip-sig-box { border-bottom: 1px solid #000; height: 50px; margin-top: 10px; }
            .slip-sig-label { font-size: 9pt; color: #666; }
            .slip-sig-fields { font-size: 9pt; color: #666; margin-top: 5px; }
            .slip-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 8pt; color: #999; text-align: center; }
            @media print { body { padding: 0; } @page { margin: 15mm; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-hidden p-0 flex flex-col"
        style={{ width: "80vw", height: "80vh", maxWidth: "80vw" }}
      >
        <DialogHeader className="p-4 border-b border-glass-border flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            Transport Slip Preview
          </DialogTitle>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </DialogHeader>

        {/* Styled Preview Area - Paper-like appearance */}
        <div className="flex-1 overflow-y-auto p-8 bg-neutral-800">
          <div
            ref={printRef}
            className="bg-white text-black mx-auto shadow-2xl rounded-sm"
            style={{
              width: "100%",
              maxWidth: "1100px",
              padding: "50px 60px",
              fontFamily: "Arial, sans-serif",
              fontSize: "14pt",
              lineHeight: 1.5,
            }}
          >
            {/* Header */}
            <div className="slip-header" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "3px solid #d4af37",
              paddingBottom: "15px",
              marginBottom: "20px"
            }}>
              <div>
                <div className="slip-logo" style={{ fontSize: "24pt", fontWeight: "bold", letterSpacing: "2px" }}>
                  HIZKIA<span className="slip-logo-dot" style={{ color: "#d4af37" }}>.</span>
                </div>
                <div className="slip-tagline" style={{ fontSize: "9pt", color: "#666", marginTop: "5px" }}>
                  Art Logistics & Transport
                </div>
              </div>
              <div className="slip-info" style={{ textAlign: "right" }}>
                <div className="slip-id" style={{ fontSize: "14pt", fontWeight: "bold" }}>{slip.id}</div>
                <div className="slip-op" style={{ color: "#666", fontSize: "10pt" }}>
                  Operation: {slip.operationId}
                </div>
                <div className="slip-badge" style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  background: "#d4af37",
                  color: "#fff",
                  fontSize: "9pt",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  borderRadius: "3px",
                  marginTop: "5px"
                }}>
                  {slip.operationType}
                </div>
              </div>
            </div>

            {/* Mission Details */}
            <div className="slip-section" style={{ marginBottom: "15px" }}>
              <div className="slip-section-title" style={{
                fontWeight: "bold",
                fontSize: "10pt",
                textTransform: "uppercase",
                letterSpacing: "1px",
                background: "#f5f5f5",
                padding: "5px 10px",
                marginBottom: "10px",
                borderLeft: "3px solid #d4af37"
              }}>
                Mission Details
              </div>
              <div className="slip-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <div className="slip-field" style={{ marginBottom: "8px" }}>
                    <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Client</div>
                    <div className="slip-field-value" style={{ fontWeight: 500 }}>{slip.client}</div>
                  </div>
                  <div className="slip-field" style={{ marginBottom: "8px" }}>
                    <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Assigned Crew</div>
                    <div className="slip-field-value" style={{ fontWeight: 500 }}>{assignedCrew?.name || slip.assignedTo}</div>
                  </div>
                </div>
                <div>
                  <div className="slip-field" style={{ marginBottom: "8px" }}>
                    <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Due Date & Time</div>
                    <div className="slip-field-value" style={{ fontWeight: 500 }}>
                      {format(parseISO(slip.dueTime), "EEEE, MMMM d, yyyy 'at' HH:mm")}
                    </div>
                  </div>
                  <div className="slip-field" style={{ marginBottom: "8px" }}>
                    <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Status</div>
                    <div className="slip-field-value" style={{ fontWeight: 500, textTransform: "capitalize" }}>
                      {slip.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artwork */}
            <div className="slip-section" style={{ marginBottom: "15px" }}>
              <div className="slip-section-title" style={{
                fontWeight: "bold",
                fontSize: "10pt",
                textTransform: "uppercase",
                letterSpacing: "1px",
                background: "#f5f5f5",
                padding: "5px 10px",
                marginBottom: "10px",
                borderLeft: "3px solid #d4af37"
              }}>
                Artwork ({details.artwork.length} item{details.artwork.length > 1 ? "s" : ""})
              </div>
              {details.artwork.map((art, index) => (
                <div key={index} className="slip-artwork-item" style={{
                  padding: "10px",
                  background: "#fafafa",
                  marginBottom: "8px",
                  borderLeft: "2px solid #ddd"
                }}>
                  <div className="slip-artwork-title" style={{ fontWeight: "bold" }}>{art.title}</div>
                  <div className="slip-artwork-meta" style={{ fontSize: "10pt", color: "#666" }}>
                    {art.artist} • {art.medium} • {art.dimensions}
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div className="slip-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="slip-section" style={{ marginBottom: "15px" }}>
                <div className="slip-section-title" style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  background: "#f5f5f5",
                  padding: "5px 10px",
                  marginBottom: "10px",
                  borderLeft: "3px solid #d4af37"
                }}>
                  Pickup Location
                </div>
                <div className="slip-field" style={{ marginBottom: "8px" }}>
                  <div className="slip-field-value" style={{ fontWeight: 500 }}>{details.pickup.name}</div>
                  <div style={{ color: "#666" }}>{details.pickup.address}</div>
                </div>
                <div className="slip-field" style={{ marginTop: "10px" }}>
                  <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Contact</div>
                  <div className="slip-field-value" style={{ fontWeight: 500 }}>{details.pickup.contact}</div>
                  <div style={{ color: "#666" }}>{details.pickup.phone}</div>
                </div>
              </div>

              <div className="slip-section" style={{ marginBottom: "15px" }}>
                <div className="slip-section-title" style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  background: "#f5f5f5",
                  padding: "5px 10px",
                  marginBottom: "10px",
                  borderLeft: "3px solid #d4af37"
                }}>
                  Delivery Location
                </div>
                <div className="slip-field" style={{ marginBottom: "8px" }}>
                  <div className="slip-field-value" style={{ fontWeight: 500 }}>{details.delivery.name}</div>
                  <div style={{ color: "#666" }}>{details.delivery.address}</div>
                </div>
                <div className="slip-field" style={{ marginTop: "10px" }}>
                  <div className="slip-field-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Contact</div>
                  <div className="slip-field-value" style={{ fontWeight: 500 }}>{details.delivery.contact}</div>
                  <div style={{ color: "#666" }}>{details.delivery.phone}</div>
                </div>
              </div>
            </div>

            {/* Instructions & Equipment */}
            <div className="slip-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="slip-section" style={{ marginBottom: "15px" }}>
                <div className="slip-section-title" style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  background: "#f5f5f5",
                  padding: "5px 10px",
                  marginBottom: "10px",
                  borderLeft: "3px solid #d4af37"
                }}>
                  Special Instructions
                </div>
                {details.instructions.map((instruction, index) => (
                  <div key={index} className="slip-list-item" style={{ padding: "3px 0", paddingLeft: "15px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                    {instruction}
                  </div>
                ))}
              </div>

              <div className="slip-section" style={{ marginBottom: "15px" }}>
                <div className="slip-section-title" style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  background: "#f5f5f5",
                  padding: "5px 10px",
                  marginBottom: "10px",
                  borderLeft: "3px solid #d4af37"
                }}>
                  Required Equipment
                </div>
                {details.equipment.map((item, index) => (
                  <div key={index} className="slip-list-item" style={{ padding: "3px 0", paddingLeft: "15px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Section */}
            <div className="slip-signatures" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px dashed #ccc"
            }}>
              <div>
                <div className="slip-sig-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Pickup Signature</div>
                <div className="slip-sig-box" style={{ borderBottom: "1px solid #000", height: "50px", marginTop: "10px" }}></div>
                <div className="slip-sig-fields" style={{ fontSize: "9pt", color: "#666", marginTop: "5px" }}>
                  Name: _________________ Date: _________
                </div>
              </div>
              <div>
                <div className="slip-sig-label" style={{ fontSize: "9pt", color: "#666", textTransform: "uppercase" }}>Delivery Signature</div>
                <div className="slip-sig-box" style={{ borderBottom: "1px solid #000", height: "50px", marginTop: "10px" }}></div>
                <div className="slip-sig-fields" style={{ fontSize: "9pt", color: "#666", marginTop: "5px" }}>
                  Name: _________________ Date: _________
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="slip-footer" style={{
              marginTop: "20px",
              paddingTop: "10px",
              borderTop: "1px solid #ddd",
              fontSize: "8pt",
              color: "#999",
              textAlign: "center"
            }}>
              Generated on {format(new Date(), "MMMM d, yyyy 'at' HH:mm")} •
              HIZKIA Art Logistics • www.hizkia.com • +33 1 XX XX XX XX
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
