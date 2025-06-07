import { useState } from "react"
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

// Opzioni di categoria predefinite
const categories = [
  "mimo",
  "clown",
  "giocoleria",
  "danza aerea",
  "fuoco",
  "trampoli",
]

const SearchBar = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    date: null,
  })

  // Gestione ricerca
  const handleSearch = () => {
    onSearch(filters)
  }

  // Gestione reset
  const handleReset = () => {
    setFilters({ category: "", city: "", date: null })
    if (onReset) onReset()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col sm:flex-row gap-4 items-end">
      {/* Categoria */}
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">Categoria</label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, category: value.toLowerCase() }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona una categoria" />
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

      {/* Città */}
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">Città</label>
        <Input
          placeholder="Inserisci una città"
          value={filters.city}
          onChange={(e) =>
            setFilters((f) => ({ ...f, city: e.target.value }))
          }
        />
      </div>

      {/* Data */}
      <div className="flex-1">
        <label className="block mb-1 text-sm font-medium">Data</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              {filters.date ? format(filters.date, "PPP") : "Seleziona una data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              onSelect={(date) => setFilters((f) => ({ ...f, date }))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Bottoni */}
      <div className="flex gap-2">
        <Button onClick={handleSearch}>🔍 Cerca</Button>
        <Button variant="outline" onClick={handleReset}>♻️ Reset</Button>
      </div>
    </div>
  )
}

export default SearchBar
