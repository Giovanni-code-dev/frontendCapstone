import {
    Globe, Instagram, Facebook, Youtube, FileDown,
    MapPin, Link as LinkIcon
  } from "lucide-react"
  import { Card, CardContent } from "@/components/ui/card"
  
  const ArtistProfileCard = ({ artist }) => {
    const primaryColor = artist.theme?.primaryColor || "#e0e0e0"
    const backgroundColor = artist.theme?.backgroundColor || "#ffffff"
    const fontFamily = artist.theme?.fontFamily || "inherit"
  
    return (
      <Card
        className="border-2 shadow-xl"
        style={{ borderColor: primaryColor, backgroundColor, fontFamily }}
      >
        <CardContent className="p-6 text-center space-y-4">
          {/* Avatar */}
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-32 h-32 mx-auto rounded-full object-cover border-4"
            style={{ borderColor: primaryColor }}
          />
  
          {/* Nome e bio */}
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          {artist.bio && <p className="text-muted-foreground">{artist.bio}</p>}
  
          {/* Categorie */}
          {artist.categories?.length > 0 && (
  <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
    {artist.categories.map((cat) => (
      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full" key={typeof cat === "object" ? cat._id : cat}>
        {typeof cat === "object" && cat.name ? cat.name : String(cat)}
      </span>
    ))}
  </div>
)}

  
          {/* Rating */}
          <div className="mt-2">
            {artist.averageRating ? (
              <p className="text-yellow-600 font-medium">
                ⭐ {artist.averageRating} su {artist.reviewCount} recensioni
              </p>
            ) : (
              <p className="text-muted-foreground italic">Nessuna recensione</p>
            )}
          </div>
  
          {/* Contatti */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            {artist.website && (
              <a href={artist.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <Globe className="w-4 h-4" /> Sito web
              </a>
            )}
            {artist.instagram && (
              <a href={artist.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            {artist.facebook && (
              <a href={artist.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            )}
            {artist.youtube && (
              <a href={artist.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <Youtube className="w-4 h-4" /> YouTube
              </a>
            )}
            {artist.tiktok && (
              <a href={artist.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <LinkIcon className="w-4 h-4" /> TikTok
              </a>
            )}
            {artist.portfolio && (
              <a href={artist.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline">
                <FileDown className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>
  
          {/* Posizione */}
          {artist.location?.city && (
            <div className="flex justify-center items-center gap-2 text-muted-foreground mt-4">
              <MapPin className="w-4 h-4" />
              <span>{artist.location.city}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  export default ArtistProfileCard
  