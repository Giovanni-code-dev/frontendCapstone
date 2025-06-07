import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import ArtistCard from "@/components/ArtistCard"
import { format } from "date-fns"

// 🔀 Funzione per mescolare casualmente un array
const shuffleArray = (array) =>
  array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

const HomeCustomer = () => {
  const [filteredArtists, setFilteredArtists] = useState([])

  const handleSearch = async (filters = {}) => {
    const params = new URLSearchParams()

    if (filters.city) params.set("city", filters.city)
    if (filters.category) params.set("category", filters.category)
    if (filters.date instanceof Date && !isNaN(filters.date)) {
      const formatted = format(filters.date, "yyyy-MM-dd")
      params.set("date", formatted)
      console.log("📅 Data selezionata:", formatted)
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}/artist/public?${params.toString()}`
    console.log("🔍 URL richiesta:", url)

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Errore HTTP ${res.status}`)
      const data = await res.json()
      console.log("🎨 Artisti ricevuti:", data)
      const shuffled = shuffleArray(data)
      setFilteredArtists(shuffled)
    } catch (error) {
      console.error("❌ Errore nella fetch artisti:", error)
    }
  }

  const handleReset = () => {
    console.log("🔄 Reset filtri")
    handleSearch({})
  }

  // 🔁 Esegui la prima ricerca al caricamento
  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="p-4 space-y-6">
      <SearchBar onSearch={handleSearch} onReset={handleReset} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <ArtistCard key={artist._id} artist={artist} />
          ))
        ) : (
          <p className="text-center col-span-full text-muted-foreground">
            Nessun artista trovato con questi criteri.
          </p>
        )}
      </div>
    </div>
  )
}

export default HomeCustomer
