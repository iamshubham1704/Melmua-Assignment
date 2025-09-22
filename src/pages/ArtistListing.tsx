import { useState, useEffect } from 'react'
import { mockArtists } from '../data/mockData'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import StarRating from '../components/ui/StarRating'
import { Wand2, Sparkles } from 'lucide-react'

interface ArtistListingProps {
  onArtistSelect: (artistId: string) => void
  onAIMakeup: () => void
}

export default function ArtistListing({ onArtistSelect, onAIMakeup }: ArtistListingProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const filteredArtists = mockArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = !selectedSpecialty || artist.specialties.includes(selectedSpecialty)
    return matchesSearch && matchesSpecialty
  })

  const allSpecialties = Array.from(new Set(mockArtists.flatMap(artist => artist.specialties)))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className={`text-center max-w-4xl mx-auto ${isLoaded ? 'animate-fade-in-up' : ''}`}>
            <h1 className="heading-primary text-5xl md:text-6xl lg:text-7xl mb-6">
              Book My Glam
            </h1>
            <p className="text-body text-xl md:text-2xl mb-12 leading-relaxed">
              Discover the most talented makeup artists in your area. 
              Professional beauty services tailored to your style and occasion.
            </p>
            
            {/* AI Makeup Button */}
            <div className="flex justify-center">
              <Button
                onClick={onAIMakeup}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
              >
                <Wand2 className="h-6 w-6" />
                <span>Try AI Makeup</span>
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto container-padding">
          <div className={`professional-card p-8 ${isLoaded ? 'animate-scale-in' : ''}`}>
            <h2 className="heading-secondary text-2xl mb-8 text-center">Find Your Perfect Artist</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Artists
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="professional-input w-full"
                />
              </div>
              <div className="lg:w-80">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  id="specialty"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="professional-input w-full appearance-none cursor-pointer"
                >
                  <option value="">All Specialties</option>
                  {allSpecialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="heading-secondary text-3xl text-center mb-12">Featured Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist, index) => (
              <div
                key={artist.id}
                className={`professional-card p-6 ${isLoaded ? 'animate-fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <h3 className="heading-secondary text-xl mb-2">{artist.name}</h3>
                  <p className="text-body mb-4">{artist.location}</p>
                  
                  <div className="flex items-center justify-center mb-4">
                    <StarRating rating={artist.rating} size="sm" />
                    <span className="ml-2 text-sm text-gray-600">
                      ({artist.reviewCount} reviews)
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-body text-sm leading-relaxed line-clamp-3">{artist.bio}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {artist.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                      {artist.specialties.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{artist.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-600">
                      {artist.experience} years experience
                    </span>
                    {artist.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => onArtistSelect(artist.id)}
                    variant="gradient"
                    className="w-full"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredArtists.length === 0 && (
        <section className="section-padding bg-gray-50">
          <div className="max-w-2xl mx-auto container-padding text-center">
            <div className="professional-card p-12">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="heading-secondary text-2xl mb-4">No Artists Found</h3>
              <p className="text-body text-lg mb-8">
                We couldn't find any artists matching your criteria. Try adjusting your search!
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialty('')
                }}
                variant="gradient"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
