import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Search } from "lucide-react"

/**
 * 🎭 Opzioni disponibili per la categoria artista
 */
const categories = [
  "mimo",
  "clown",
  "giocoleria",
  "danza aerea",
  "fuoco",
  "trampoli",
]

/**
 * 🔍 SearchBar
 * Barra di ricerca avanzata con filtri URL-based.
 * Va usata dentro una Navbar già esistente (non contiene logo né avatar).
 */
const SearchBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 🔎 Stato locale dei filtri utente
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    date: null,
  })

  const hasActiveFilters = location.search.length > 0

  // 🚀 Costruisce URL con query string e reindirizza
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.city) params.set("city", filters.city)
    if (filters.category) params.set("category", filters.category)
    if (filters.date instanceof Date && !isNaN(filters.date)) {
      const formattedDate = format(filters.date, "yyyy-MM-dd")
      params.set("date", formattedDate)
    }

    navigate(`/home?${params.toString()}`)
  }

  // ♻️ Ripristina lo stato iniziale e rimuove query string
  const handleReset = () => {
    setFilters({ city: "", category: "", date: null })
    navigate("/home")
  }

  return (
    <div className="flex w-full max-w-5xl items-center rounded-full border shadow-md bg-white overflow-hidden divide-x divide-border px-2">
      {/* 🏙️ Città */}
      <div className="px-4 py-3 flex-1 min-w-[120px]">
        <div className="text-xs font-semibold text-muted-foreground">Dove</div>
        <Input
          variant="ghost"
          className="p-0 border-0 focus-visible:ring-0 text-sm"
          placeholder="Cerca destinazioni"
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
        />
      </div>

      {/* 📅 Data */}
      <div className="px-4 py-3 flex-1 min-w-[140px]">
        <div className="text-xs font-semibold text-muted-foreground">Quando</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto text-sm font-normal">
              {filters.date ? format(filters.date, "PPP") : "Aggiungi data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              onSelect={(date) => setFilters((prev) => ({ ...prev, date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 🎭 Categoria */}
      <div className="px-4 py-3 flex-1 min-w-[140px]">
        <div className="text-xs font-semibold text-muted-foreground">Categoria</div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger variant="ghost" className="p-0 h-auto text-sm font-normal">
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 🎯 Pulsanti azione */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Cerca */}
        <Button
          size="icon"
          className="rounded-full bg-red-500 hover:bg-red-600 text-white"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Reset (solo se filtri attivi) */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="rounded-full px-3 py-1 text-sm border-gray-300 hover:bg-gray-100"
            onClick={handleReset}
          >
            ♻️
          </Button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
