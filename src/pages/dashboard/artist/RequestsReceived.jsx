import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useUser } from "@/contexts/UserContext"

const RequestsReceived = () => {
  const { user } = useUser()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/requests/artist`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })

        if (!res.ok) throw new Error("Errore nel recupero richieste")
        const data = await res.json()
        setRequests(data)
      } catch (err) {
        console.error("Errore:", err)
        setError("Errore durante il caricamento delle richieste")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user?.token])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Richieste Ricevute</h2>

      {loading && <Skeleton className="h-32 w-full" />}
      {error && <p className="text-red-500">{error}</p>}

      {requests.map((request) => (
        <Card key={request._id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{request.customer?.name}</span>
              <Badge variant="outline">
                {format(new Date(request.date), "dd/MM/yyyy")}
              </Badge>
            </div>
            <p>{request.message}</p>
            <div className="text-sm text-muted-foreground">
              Shows: {request.shows?.map(s => s.title).join(", ") || "Nessuno"}<br />
              Packages: {request.packages?.map(p => p.title).join(", ") || "Nessuno"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default RequestsReceived
