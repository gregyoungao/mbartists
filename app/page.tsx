import HeroSection from '@/components/hero/HeroSection'
import ArtistMap from '@/components/map/ArtistMap'
import Navigation from '@/components/nav/Navigation'
import FeaturedRoster from '@/components/roster/FeaturedRoster'

// Sample featured artists - will be replaced with WordPress data
const SAMPLE_FEATURED_ARTISTS = [
  { slug: "skrillex", name: "Skrillex", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Electronic"] },
  { slug: "excision", name: "Excision", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Heavy Bass"] },
  { slug: "illenium", name: "Illenium", image: "/placeholder-artist.jpg", genres: ["Melodic Bass", "Future Bass"] },
  { slug: "virtual-riot", name: "Virtual Riot", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Complextro"] },
  { slug: "barely-alive", name: "Barely Alive", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Heavy Bass"] },
  { slug: "zomboy", name: "Zomboy", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Electro"] },
  { slug: "must-die", name: "MUST DIE!", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Bass"] },
  { slug: "subtronics", name: "Subtronics", image: "/placeholder-artist.jpg", genres: ["Dubstep", "Riddim"] },
]

export default function Page() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <FeaturedRoster artists={SAMPLE_FEATURED_ARTISTS} />
      <ArtistMap />
    </main>
  )
}
