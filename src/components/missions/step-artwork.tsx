"use client"

import * as React from "react"
import { useMissionForm } from "./mission-form-context"
import {
  CATEGORY_LABELS,
  SPECIAL_HANDLING_LABELS,
  ArtworkCategory,
  SpecialHandling,
  ArtworkItem,
} from "@/types/mission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Palette,
  Box,
  Camera,
  Layers,
  Archive,
  Ruler,
  Weight,
  Shield,
  Snowflake,
  AlertTriangle,
  Gem,
  Euro,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react"

const categoryIcons: Record<ArtworkCategory, typeof Palette> = {
  painting: Palette,
  sculpture: Box,
  photography: Camera,
  mixed_media: Layers,
  archive: Archive,
}

const handlingIcons: Record<SpecialHandling, typeof Shield> = {
  fragile: AlertTriangle,
  climate_controlled: Snowflake,
  oversized: Box,
  high_value: Gem,
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function createEmptyArtwork(): ArtworkItem {
  return {
    id: generateId(),
    description: "",
    category: "painting",
    dimensions: { length: 0, width: 0, height: 0 },
    weight: 0,
    insuranceValue: null,
  }
}

interface ArtworkItemCardProps {
  item: ArtworkItem
  index: number
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (updates: Partial<ArtworkItem>) => void
  onRemove: () => void
  canRemove: boolean
}

function ArtworkItemCard({
  item,
  index,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
  canRemove,
}: ArtworkItemCardProps) {
  const Icon = categoryIcons[item.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border border-glass-border rounded-xl overflow-hidden"
    >
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 hover:bg-accent/20 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium truncate">
            {item.description || `Item ${index + 1}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {CATEGORY_LABELS[item.category]}
            {item.dimensions.length > 0 &&
              ` • ${item.dimensions.length}×${item.dimensions.width}×${item.dimensions.height}cm`}
            {item.weight > 0 && ` • ${item.weight}kg`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4 border-t border-glass-border">
              {/* Description */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Description
                </label>
                <Textarea
                  value={item.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="e.g., 19th century oil on canvas, 'Portrait of a Lady'"
                  className="glass-subtle min-h-[60px]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_LABELS) as ArtworkCategory[]).map(
                    (category) => {
                      const CatIcon = categoryIcons[category]
                      const isSelected = item.category === category
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => onUpdate({ category })}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all",
                            isSelected
                              ? "bg-gold/10 border-gold/30 text-gold"
                              : "glass-subtle border-glass-border hover:bg-accent/30"
                          )}
                        >
                          <CatIcon className="h-3 w-3" />
                          {CATEGORY_LABELS[category].split(" ")[0]}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    L (cm)
                  </label>
                  <Input
                    type="number"
                    value={item.dimensions.length || ""}
                    onChange={(e) =>
                      onUpdate({
                        dimensions: {
                          ...item.dimensions,
                          length: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="120"
                    className="glass-subtle"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    W (cm)
                  </label>
                  <Input
                    type="number"
                    value={item.dimensions.width || ""}
                    onChange={(e) =>
                      onUpdate({
                        dimensions: {
                          ...item.dimensions,
                          width: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="80"
                    className="glass-subtle"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    H (cm)
                  </label>
                  <Input
                    type="number"
                    value={item.dimensions.height || ""}
                    onChange={(e) =>
                      onUpdate({
                        dimensions: {
                          ...item.dimensions,
                          height: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="5"
                    className="glass-subtle"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={item.weight || ""}
                    onChange={(e) =>
                      onUpdate({ weight: Number(e.target.value) })
                    }
                    placeholder="15"
                    className="glass-subtle"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  Insurance Value (optional)
                </label>
                <Input
                  type="number"
                  value={item.insuranceValue || ""}
                  onChange={(e) =>
                    onUpdate({
                      insuranceValue: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                  placeholder="Enter value in €"
                  className="glass-subtle"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function StepArtwork() {
  const { data, updateData } = useMissionForm()
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  // Initialize with one empty artwork if none exist
  React.useEffect(() => {
    if (data.artworks.length === 0) {
      updateData({ artworks: [createEmptyArtwork()] })
    }
  }, [data.artworks.length, updateData])

  const addArtwork = () => {
    const newItem = createEmptyArtwork()
    updateData({ artworks: [...data.artworks, newItem] })
    setExpandedId(newItem.id)
  }

  const removeArtwork = (id: string) => {
    updateData({ artworks: data.artworks.filter((a) => a.id !== id) })
    if (expandedId === id) setExpandedId(null)
  }

  const updateArtwork = (id: string, updates: Partial<ArtworkItem>) => {
    updateData({
      artworks: data.artworks.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })
  }

  const toggleHandling = (handling: SpecialHandling) => {
    const current = data.specialHandling || []
    if (current.includes(handling)) {
      updateData({
        specialHandling: current.filter((h) => h !== handling),
      })
    } else {
      updateData({ specialHandling: [...current, handling] })
    }
  }

  // Calculate totals
  const totals = React.useMemo(() => {
    if (data.useOverallDimensions) {
      return {
        weight: data.overallWeight,
        insurance: data.totalInsuranceValue || 0,
        count: data.artworks.length || 1,
      }
    }
    return {
      weight: data.artworks.reduce((sum, a) => sum + (a.weight || 0), 0),
      insurance: data.artworks.reduce(
        (sum, a) => sum + (a.insuranceValue || 0),
        0
      ),
      count: data.artworks.length,
    }
  }, [data])

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateData({ useOverallDimensions: false })}
              className={cn(
                "flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2",
                !data.useOverallDimensions
                  ? "bg-gold/10 border-gold/30 text-gold"
                  : "glass-subtle border-glass-border hover:bg-accent/30"
              )}
            >
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Individual Items</span>
            </button>
            <button
              type="button"
              onClick={() => updateData({ useOverallDimensions: true })}
              className={cn(
                "flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2",
                data.useOverallDimensions
                  ? "bg-gold/10 border-gold/30 text-gold"
                  : "glass-subtle border-glass-border hover:bg-accent/30"
              )}
            >
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">Overall Dimensions</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {!data.useOverallDimensions ? (
          <motion.div
            key="individual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Artwork Items */}
            <Card className="glass">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-5 w-5 text-gold" />
                  Artwork Items
                  <Badge variant="secondary" className="ml-2">
                    {data.artworks.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addArtwork}
                  className="glass-subtle"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {data.artworks.map((item, index) => (
                    <ArtworkItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      isExpanded={expandedId === item.id}
                      onToggle={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                      onUpdate={(updates) => updateArtwork(item.id, updates)}
                      onRemove={() => removeArtwork(item.id)}
                      canRemove={data.artworks.length > 1}
                    />
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="overall"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Overall Dimensions */}
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ruler className="h-5 w-5 text-gold" />
                  Overall Package Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the combined dimensions for all items as a single
                  package.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Length (cm)
                    </label>
                    <Input
                      type="number"
                      value={data.overallDimensions.length || ""}
                      onChange={(e) =>
                        updateData({
                          overallDimensions: {
                            ...data.overallDimensions,
                            length: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="150"
                      className="glass-subtle"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Width (cm)
                    </label>
                    <Input
                      type="number"
                      value={data.overallDimensions.width || ""}
                      onChange={(e) =>
                        updateData({
                          overallDimensions: {
                            ...data.overallDimensions,
                            width: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="100"
                      className="glass-subtle"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      value={data.overallDimensions.height || ""}
                      onChange={(e) =>
                        updateData({
                          overallDimensions: {
                            ...data.overallDimensions,
                            height: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="80"
                      className="glass-subtle"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                      <Weight className="h-3 w-3" />
                      Total Weight (kg)
                    </label>
                    <Input
                      type="number"
                      value={data.overallWeight || ""}
                      onChange={(e) =>
                        updateData({ overallWeight: Number(e.target.value) })
                      }
                      placeholder="50"
                      className="glass-subtle"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      Total Insurance Value
                    </label>
                    <Input
                      type="number"
                      value={data.totalInsuranceValue || ""}
                      onChange={(e) =>
                        updateData({
                          totalInsuranceValue: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                      placeholder="Optional"
                      className="glass-subtle"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {totals.count > 0 && (
        <Card className="glass-subtle">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Summary</span>
              <div className="flex gap-4">
                <span>
                  <strong>{totals.count}</strong> item
                  {totals.count !== 1 && "s"}
                </span>
                {totals.weight > 0 && (
                  <span>
                    <strong>{totals.weight}</strong> kg
                  </span>
                )}
                {totals.insurance > 0 && (
                  <span>
                    <strong>€{totals.insurance.toLocaleString()}</strong>{" "}
                    insured
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Handling */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-gold" />
            Special Handling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(SPECIAL_HANDLING_LABELS) as SpecialHandling[]).map(
              (handling) => {
                const Icon = handlingIcons[handling]
                const isSelected = data.specialHandling?.includes(handling)
                return (
                  <button
                    key={handling}
                    type="button"
                    onClick={() => toggleHandling(handling)}
                    className={cn(
                      "p-3 rounded-lg border transition-all flex items-center gap-3 text-left",
                      isSelected
                        ? "bg-gold/10 border-gold/30"
                        : "glass-subtle border-glass-border hover:bg-accent/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-gold/20" : "bg-accent/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-gold" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isSelected && "text-gold font-medium"
                      )}
                    >
                      {SPECIAL_HANDLING_LABELS[handling]}
                    </span>
                  </button>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
