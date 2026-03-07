import { useState } from 'react'
import { GameScreen } from './pages/GameScreen.jsx'
import { AdminDialogScreen } from './pages/AdminDialogScreen.jsx'
import { useScene } from './hooks/useScene.js'
import { DEFAULT_PART } from './data/constants.js'

export function App() {
  const { currentPart, setCurrentPart } = useScene(DEFAULT_PART)
  const [selectedAvatarId, setSelectedAvatarId] = useState(null)
  const [viewMode, setViewMode] = useState('game')

  const handlePartChange = (part) => setCurrentPart(part)
  const handleSelectOption = (index, option, part) => {
    console.log('Antwort gewählt:', option?.label, 'Teil:', part)
  }

  return (
    <div className="app">
      <header className="app__header">
        <nav className="app__nav">
          <button
            type="button"
            className={`app__mode-btn ${viewMode === 'game' ? 'app__mode-btn--active' : ''}`}
            onClick={() => setViewMode('game')}
          >
            Spiel
          </button>
          <button
            type="button"
            className={`app__mode-btn ${viewMode === 'admin' ? 'app__mode-btn--active' : ''}`}
            onClick={() => setViewMode('admin')}
          >
            Admin
          </button>
          {viewMode === 'game' &&
            [0, 1, 2, 3, 4, 5].map((id) => (
            <button
              key={id}
              type="button"
              className={`app__nav-btn ${currentPart === id ? 'app__nav-btn--active' : ''}`}
              onClick={() => setCurrentPart(id)}
              aria-pressed={currentPart === id}
              aria-label={`Teil ${id}`}
            >
              {id}
            </button>
            ))}
        </nav>
      </header>
      <main className="app__main">
        {viewMode === 'game' ? (
          <GameScreen
            currentPart={currentPart}
            onPartChange={handlePartChange}
            onSelectOption={handleSelectOption}
            selectedAvatarId={selectedAvatarId}
            onSelectAvatar={setSelectedAvatarId}
          />
        ) : (
          <AdminDialogScreen />
        )}
      </main>
    </div>
  )
}
