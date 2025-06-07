import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"

const Packages = () => {
  const { user } = useUser()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stato per il form
  const [newPackage, setNewPackage] = useState({
    title: "",
    description: "",
    price: ""
  })

  // Fetch iniziale
  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error("Errore nel caricamento")

      const data = await res.json()
      setPackages(data)
    } catch (err) {
      setError("Errore nel caricamento dei pacchetti")
    } finally {
      setLoading(false)
    }
  }

  // Gestione submit form
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPackage)
      })

      if (!res.ok) throw new Error("Errore nella creazione del pacchetto")

      const created = await res.json()
      setPackages(prev => [...prev, created]) // aggiorna la lista
      setNewPackage({ title: "", description: "", price: "" }) // reset form
    } catch (err) {
      console.error(err)
      setError("Errore durante l'aggiunta del pacchetto")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">🎁 I tuoi Pacchetti</h1>

      {/* Form di aggiunta */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={newPackage.title}
            onChange={e => setNewPackage({ ...newPackage, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrizione</Label>
          <Input
            id="description"
            value={newPackage.description}
            onChange={e => setNewPackage({ ...newPackage, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input
            id="price"
            type="number"
            value={newPackage.price}
            onChange={e => setNewPackage({ ...newPackage, price: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="md:col-span-3 w-full">
          ➕ Aggiungi pacchetto
        </Button>
      </form>

      {/* Lista pacchetti */}
      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <Card key={pkg._id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{pkg.title}</h2>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
              <p className="font-bold">{pkg.price}€</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Packages
