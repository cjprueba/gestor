import { useState } from 'react'
import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { ChevronsUpDown } from "lucide-react"

export interface Region { id: number; nombre: string }
export interface Provincia { id: number; nombre: string; region_id?: number; region?: { id: number } }
export interface Comuna { id: number; nombre: string; provincia_id?: number; provincia?: { id: number } }

interface RegionsMultiSelectProps {
  regions: Region[]
  value: number[]
  onChange: (next: number[]) => void
  disabled?: boolean
}

export function RegionsMultiSelect({ regions, value, onChange, disabled }: RegionsMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selectedCount = Array.isArray(value) ? value.length : 0
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCount > 0 ? `${selectedCount} seleccionada(s)` : "Seleccionar región(es)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="p-2">
          <Input placeholder="Buscar región..." className="h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="max-h-60 overflow-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
          {(regions || [])
            .filter(r => r.nombre.toLowerCase().includes(search.toLowerCase()))
            .map((region) => {
              const current = Array.isArray(value) ? value : []
              const checked = current.includes(region.id)
              return (
                <div
                  key={region.id}
                  className="px-2 py-1.5 cursor-pointer hover:bg-accent"
                  onClick={() => {
                    const next = checked ? current.filter((id) => id !== region.id) : [...current, region.id]
                    onChange(next)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={checked} onCheckedChange={() => { }} onClick={(e) => e.stopPropagation()} />
                    <span className="truncate">{region.nombre}</span>
                  </div>
                </div>
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ProvinciasMultiSelectProps {
  regiones: Region[]
  provincias: Provincia[]
  regionesSeleccionadas: number[]
  value: number[]
  onChange: (next: number[]) => void
  disabled?: boolean
}

export function ProvinciasMultiSelect({ regiones, provincias, regionesSeleccionadas, value, onChange, disabled }: ProvinciasMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selectedCount = Array.isArray(value) ? value.length : 0

  const provinciasFiltradas = (provincias || []).filter((p) => regionesSeleccionadas.includes(Number(p.region_id ?? p.region?.id ?? 0)))
  const grupos = provinciasFiltradas.reduce((acc: Record<number, Provincia[]>, p) => {
    const rid = Number(p.region_id ?? p.region?.id ?? 0)
    if (!acc[rid]) acc[rid] = []
    acc[rid].push(p)
    return acc
  }, {})

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${disabled ? 'opacity-60' : ''}`}
          disabled={disabled}
        >
          {selectedCount > 0 ? `${selectedCount} seleccionada(s)` : "Seleccionar provincia(s)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0" align="start">
        <div className="p-2">
          <Input placeholder="Buscar provincia..." className="h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="max-h-60 overflow-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
          {Object.entries(grupos).map(([rid, items]) => {
            const filtered = items.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
            if (filtered.length === 0) return null
            return (
              <div key={rid} className="pb-2">
                <div className="sticky top-0 z-10 bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                  {regiones.find(r => r.id === Number(rid))?.nombre || `Región ${rid}`}
                </div>
                {filtered.map((prov) => {
                  const current = Array.isArray(value) ? value : []
                  const checked = current.includes(prov.id)
                  return (
                    <div
                      key={prov.id}
                      className="px-2 py-1.5 cursor-pointer hover:bg-accent"
                      onClick={() => {
                        const next = checked ? current.filter((id) => id !== prov.id) : [...current, prov.id]
                        onChange(next)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={checked} onCheckedChange={() => { }} onClick={(e) => e.stopPropagation()} />
                        <span className="truncate">{prov.nombre}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ComunasMultiSelectProps {
  provincias: Provincia[]
  comunas: Comuna[]
  provinciasSeleccionadas: number[]
  value: number[]
  onChange: (next: number[]) => void
  disabled?: boolean
}

export function ComunasMultiSelect({ provincias, comunas, provinciasSeleccionadas, value, onChange, disabled }: ComunasMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selectedCount = Array.isArray(value) ? value.length : 0

  const comunasFiltradas = (comunas || []).filter((c) => provinciasSeleccionadas.includes(Number(c.provincia_id ?? c.provincia?.id ?? 0)))
  const grupos = comunasFiltradas.reduce((acc: Record<number, Comuna[]>, c) => {
    const pid = Number(c.provincia_id ?? c.provincia?.id ?? 0)
    if (!acc[pid]) acc[pid] = []
    acc[pid].push(c)
    return acc
  }, {})

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${disabled ? 'opacity-60' : ''}`}
          disabled={disabled}
        >
          {selectedCount > 0 ? `${selectedCount} seleccionada(s)` : "Seleccionar comuna(s)"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="p-2">
          <Input placeholder="Buscar comuna..." className="h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="max-h-60 overflow-auto overscroll-contain" onWheel={(e) => e.stopPropagation()}>
          {Object.entries(grupos).map(([pid, items]) => {
            const filtered = items.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()))
            if (filtered.length === 0) return null
            return (
              <div key={pid} className="pb-2">
                <div className="sticky top-0 z-10 bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                  {provincias.find(p => p.id === Number(pid))?.nombre || `Provincia ${pid}`}
                </div>
                {filtered.map((com) => {
                  const current = Array.isArray(value) ? value : []
                  const checked = current.includes(com.id)
                  return (
                    <div
                      key={com.id}
                      className="px-2 py-1.5 cursor-pointer hover:bg-accent"
                      onClick={() => {
                        const next = checked ? current.filter((id) => id !== com.id) : [...current, com.id]
                        onChange(next)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={checked} onCheckedChange={() => { }} onClick={(e) => e.stopPropagation()} />
                        <span className="truncate">{com.nombre}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}


