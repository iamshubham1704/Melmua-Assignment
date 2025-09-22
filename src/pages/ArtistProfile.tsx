import { useState } from 'react'
import { mockArtists, mockReviews } from '../data/mockData'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StarRating from '../components/ui/StarRating'
import BookingModal from '../components/BookingModal'

interface ArtistProfileProps {
  artistId: string
  onBack: () => void
  onAIMakeup: () => void
}

export default function ArtistProfile({ artistId, onBack, onAIMakeup }: ArtistProfileProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  
  const artist = mockArtists.find(a => a.id === artistId)
  const reviews = mockReviews.filter(r => r.artistId === artistId)

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artist not found</h1>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-center mb-8 space-x-4">
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              ← Back to Artists
            </Button>
            <Button
              onClick={onAIMakeup}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>✨</span>
              <span>Try AI Makeup</span>
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/3 text-center">
                <div className="relative mb-6">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-40 h-40 rounded-full mx-auto object-cover shadow-lg border-4 border-white"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{artist.name}</h1>
                <p className="text-gray-600 mb-6 text-lg">{artist.location}</p>
                
                <div className="flex items-center justify-center mb-6">
                  <StarRating rating={artist.rating} />
                  <span className="ml-3 text-gray-600 font-medium">
                    ({artist.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex justify-center gap-3 mb-6">
                  <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    {artist.experience} years experience
                  </span>
                  {artist.isVerified && (
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <p className="font-medium">Languages: {artist.languages.join(', ')}</p>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center lg:text-left">About</h2>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed text-center lg:text-left">{artist.bio}</p>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center lg:text-left">Specialties</h3>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {artist.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 text-sm rounded-full font-medium shadow-sm hover:shadow-md transition-shadow"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Services & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {artist.services.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white rounded-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                    {service.isPopular && (
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm rounded-full font-medium shadow-lg">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{service.description}</p>
                  
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      Duration: {service.duration} minutes
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ${service.price}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setSelectedService(service.id)
                      setShowBookingModal(true)
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {artist.portfolio.map((image) => (
              <Card key={image.id} className="overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-80 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-800 text-sm rounded-full font-medium shadow-lg">
                      {image.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{image.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{image.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {image.createdAt.toLocaleDateString()}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 text-sm rounded-full font-medium">
                      {image.category}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Reviews</h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-16 h-16 rounded-full mr-6 object-cover shadow-lg border-2 border-white"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{review.user.name}</h4>
                      <div className="flex items-center">
                        <StarRating rating={review.rating} />
                        <span className="ml-3 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                          {review.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{review.comment}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          artist={artist}
          serviceId={selectedService}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedService(null)
          }}
        />
      )}
    </div>
  )
}
