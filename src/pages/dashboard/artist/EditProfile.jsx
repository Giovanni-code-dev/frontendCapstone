import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"

const EditProfile = () => {
  const { user } = useUser()
  const [formData, setFormData] = useState({ name: "", bio: "", city: "" })

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      const data = await res.json()
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        city: data.city || "",
      })
    }

    if (user?.token) fetchProfile()
  }, [user?.token])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/artist/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert("Profilo aggiornato con successo!")
    } else {
      alert("Errore durante l'aggiornamento.")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Modifica il tuo profilo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome artista"
        />
        <Input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Città"
        />
        <Input
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Biografia"
        />
        <Button type="submit">Salva</Button>
      </form>
    </div>
  )
}

export default EditProfile
