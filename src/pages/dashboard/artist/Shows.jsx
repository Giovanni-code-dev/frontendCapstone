import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/UserContext"

const Shows = () => {
  const { user } = useUser()
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newShow, setNewShow] = useState({
    title: "",
    description: "",
    category: "altro",
    durationMinutes: 30,
  })

  const [file, setFile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchShows()
  }, [])

  const fetchShows = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Errore nel caricamento")
      const data = await res.json()
      setShows(data)
    } catch (err) {
      setError("Errore nel caricamento degli spettacoli")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewShow({
      title: "",
      description: "",
      category: "altro",
      durationMinutes: 30,
    })
    setFile(null)
    setEditMode(false)
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isEdit = editMode
    const url = `${import.meta.env.VITE_BACKEND_URL}/shows${isEdit ? `/${editId}` : ""}`

    const headers = {
      Authorization: `Bearer ${user?.token}`,
    }

    let body
    let method


    const formData = new FormData()
formData.append("title", newShow.title)
formData.append("description", newShow.description)
formData.append("category", newShow.category)
formData.append("durationMinutes", newShow.durationMinutes)
if (file) formData.append("image", file) // campo singolo per PATCH

method = isEdit ? "PATCH" : "POST"
body = formData
// NON impostare headers["Content-Type"] con FormData


    try {
      const res = await fetch(url, {
        method,
        headers,
        body,
      })

      if (!res.ok) throw new Error("Errore durante il salvataggio dello show")
      const saved = await res.json()

      if (isEdit) {
        setShows((prev) => prev.map((s) => (s._id === editId ? saved : s)))
      } else {
        setShows((prev) => [saved, ...prev])
      }

      resetForm()
    } catch (err) {
      console.error("Errore nel submit:", err)
      alert("Errore durante il salvataggio dello show.")
    }
  }

  const editShow = (show) => {
    setEditMode(true)
    setEditId(show._id)
    setNewShow({
      title: show.title,
      description: show.description,
      category: show.category,
      durationMinutes: show.durationMinutes,
    })
    setFile(null)
  }

  const deleteShow = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo spettacolo?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shows/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Errore durante l'eliminazione")
      setShows((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      console.error(err)
      setError("Errore durante l'eliminazione")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        🎭 {editMode ? "Modifica spettacolo" : "Aggiungi spettacolo"}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={newShow.title}
            onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Breve descrizione</Label>
          <textarea
            id="description"
            value={newShow.description}
            onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
            required
            rows={3}
            className="w-full p-2 border rounded-md resize-none"
            placeholder="Inserisci una breve descrizione dello spettacolo..."
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            value={newShow.category}
            onChange={(e) => setNewShow({ ...newShow, category: e.target.value })}
            className="w-full p-2 rounded-md border"
            required
          >
            <option value="danza aerea">Danza aerea</option>
            <option value="trampoli">Trampoli</option>
            <option value="giocoleria">Giocoleria</option>
            <option value="mimo">Mimo</option>
            <option value="fuoco">Fuoco</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        <div>
          <Label htmlFor="durationMinutes">Durata (minuti)</Label>
          <Input
            id="durationMinutes"
            type="number"
            value={newShow.durationMinutes}
            onChange={(e) => setNewShow({ ...newShow, durationMinutes: Number(e.target.value) })}
          />
        </div>

        <div className="md:col-span-3">
          <Label htmlFor="image">Copertina</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            
          />
        </div>

        <Button type="submit" className="md:col-span-3 w-full">
          {editMode ? "💾 Salva modifiche" : "➕ Aggiungi spettacolo"}
        </Button>
      </form>

      {/* Lista spettacoli */}
      {loading && <p>Caricamento in corso...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shows.map((show) => (
          <Card key={show._id} className="shadow-md flex flex-col h-[360px]">
            {show.images?.[0]?.url && (
              <img
                src={show.images[0].url}
                alt="Copertina spettacolo"
                className="w-full h-48 object-cover rounded-t-md"
              />
            )}
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex flex-col justify-between flex-1 p-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{show.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{show.description}</p>
                  <p className="text-sm">
                    🎭 {show.category} — ⏱ {show.durationMinutes} min
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={() => editShow(show)}>
                    ✏️ Modifica
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteShow(show._id)}>
                    Elimina
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Shows
