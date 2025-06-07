import { Card, CardContent } from "@/components/ui/card"

const DashboardArtist = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold">🎭 Benvenuto Artista!</h1>
          <p className="text-muted-foreground">
            Questa è la tua area riservata. Da qui potrai gestire spettacoli, pacchetti, progetti e molto altro.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardArtist
