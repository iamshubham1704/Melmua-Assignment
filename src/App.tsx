import { useState } from 'react'
import ArtistListing from './pages/ArtistListing'
import ArtistProfile from './pages/ArtistProfile'
import AIMakeup from './pages/AIMakeup'
import ToastProvider from './components/ToastProvider'
import './App.css'

type AppView = 'listing' | 'artist' | 'ai-makeup'

function App() {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<AppView>('listing')

  const handleArtistSelect = (artistId: string) => {
    setSelectedArtist(artistId)
    setCurrentView('artist')
  }

  const handleBackToListing = () => {
    setSelectedArtist(null)
    setCurrentView('listing')
  }

  const handleAIMakeup = () => {
    setCurrentView('ai-makeup')
  }

  if (currentView === 'ai-makeup') {
    return (
      <>
        <AIMakeup onBack={handleBackToListing} />
        <ToastProvider />
      </>
    )
  }

  if (currentView === 'artist' && selectedArtist) {
    return (
      <>
        <ArtistProfile 
          artistId={selectedArtist} 
          onBack={handleBackToListing}
          onAIMakeup={handleAIMakeup}
        />
        <ToastProvider />
      </>
    )
  }

  return (
    <>
      <ArtistListing 
        onArtistSelect={handleArtistSelect}
        onAIMakeup={handleAIMakeup}
      />
      <ToastProvider />
    </>
  )
}

export default App
