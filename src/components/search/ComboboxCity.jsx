// ComboboxCity.jsx
//
// Questo componente sostituisce CityAutocomplete con una UI coerente a shadcn/ui.
// Mostra un autocomplete con suggerimenti di città provenienti dal backend.
//
// Props:
// - selectedCity (string): città selezionata attualmente
// - setSelectedCity (function): funzione per aggiornare la città selezionata

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const ComboboxCity = ({ selectedCity, setSelectedCity }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])

  // Fetch suggerimenti città
  useEffect(() => {
    const fetchCities = async () => {
      if (!query || query.length < 1) return

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/cities?search=${query}`)
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error("Errore nel fetch delle città:", error)
        setSuggestions([])
      }
    }

    const delay = setTimeout(fetchCities, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCity ? selectedCity : "Seleziona città"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Cerca città..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {suggestions.map((city, index) => (
              <CommandItem
                key={index}
                value={city}
                onSelect={(value) => {
                  setSelectedCity(value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCity === city ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ComboboxCity
