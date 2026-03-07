import { useEffect, useState } from 'react'
import { GameScreen } from './pages/GameScreen.jsx'
import { AdminDialogScreen } from './pages/AdminDialogScreen.jsx'
import { useScene } from './hooks/useScene.js'
import { DEFAULT_PART } from './data/constants.js'
import { getSceneDialogs } from './api/dialogApi.js'

function buildSubchapters(steps = []) {
  const sortedSteps = [...steps]
    .filter((step) => Number.isFinite(step?.stepIndex))
    .sort((a, b) => a.stepIndex - b.stepIndex)

  const primarySteps = sortedSteps.filter((step) => step.stepIndex < 10)
  const entries = []
  let introAdded = false
  let exampleCount = 0
  let activityCount = 0
  let hasSummary = false

  for (const step of primarySteps) {
    const type = String(step.type || 'dialog').toLowerCase()

    if (type === 'intro') {
      if (!introAdded) {
        entries.push({ stepIndex: step.stepIndex, label: 'Intro' })
        introAdded = true
      }
      continue
    }

    if (type === 'example') {
      exampleCount += 1
      entries.push({ stepIndex: step.stepIndex, label: `Beispiel ${exampleCount}` })
      continue
    }

    if (type === 'activity') {
      activityCount += 1
      entries.push({ stepIndex: step.stepIndex, label: `Aktivität ${activityCount}` })
      continue
    }

    if (type === 'summary') {
      if (!hasSummary) {
        entries.push({ stepIndex: step.stepIndex, label: 'Summary' })
        hasSummary = true
      }
      continue
    }

    if (type === 'transition') {
      if (hasSummary) {
        const summaryEntry = entries.find((entry) => entry.label === 'Summary')
        if (summaryEntry) summaryEntry.label = 'Summary / Transition'
      } else {
        entries.push({ stepIndex: step.stepIndex, label: 'Transition' })
      }
      continue
    }

    entries.push({ stepIndex: step.stepIndex, label: `Schritt ${step.stepIndex}` })
  }

  return entries.map((entry, index) => ({ ...entry, chapterIndex: index }))
}

function resolveActiveChapterStep(currentStepIndex, subchapters, steps = []) {
  if (!subchapters.length) return 0

  const chapterByStep = new Map(subchapters.map((chapter) => [chapter.stepIndex, chapter.stepIndex]))
  if (chapterByStep.has(currentStepIndex)) return currentStepIndex

  const step = steps.find((item) => item.stepIndex === currentStepIndex)
  if (step?.options?.length) {
    const candidateChapterSteps = step.options
      .map((option) => option?.nextStep)
      .filter((nextStep) => Number.isFinite(nextStep) && chapterByStep.has(nextStep))
      .sort((a, b) => a - b)
    if (candidateChapterSteps.length) return candidateChapterSteps[0]
  }

  const fallback = subchapters
    .map((chapter) => chapter.stepIndex)
    .filter((stepIndex) => stepIndex <= currentStepIndex)
    .sort((a, b) => b - a)[0]

  return fallback ?? subchapters[0].stepIndex
}

export function App() {
  const { currentPart, setCurrentPart } = useScene(DEFAULT_PART)
  const [selectedAvatarId, setSelectedAvatarId] = useState(null)
  const [selectedHostId, setSelectedHostId] = useState(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem('selectedHostId') || null
  })
  const [viewMode, setViewMode] = useState('game')
  const [dialogsByPart, setDialogsByPart] = useState({})
  const [activeStepByPart, setActiveStepByPart] = useState({})
  const [stepJumpRequest, setStepJumpRequest] = useState({ part: DEFAULT_PART, stepIndex: 0, nonce: 0 })

  const handlePartChange = (part) => {
    setCurrentPart(part)
    setStepJumpRequest({ part, stepIndex: 0, nonce: Date.now() })
  }
  const handleSelectOption = (index, option, part) => {
    console.log('Antwort gewählt:', option?.label, 'Teil:', part)
  }

  const activeSubchapters = buildSubchapters(dialogsByPart[currentPart]?.steps || [])
  const activeChapterStepIndex = resolveActiveChapterStep(
    activeStepByPart[currentPart] ?? 0,
    activeSubchapters,
    dialogsByPart[currentPart]?.steps || []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (selectedHostId) {
      window.localStorage.setItem('selectedHostId', selectedHostId)
    } else {
      window.localStorage.removeItem('selectedHostId')
    }
  }, [selectedHostId])

  useEffect(() => {
    let active = true

    async function loadDialogsForNavigation() {
      const parts = [1, 2, 3, 4, 5]
      const loaded = {}

      await Promise.all(
        parts.map(async (part) => {
          try {
            const data = await getSceneDialogs(part)
            loaded[part] = data
          } catch {
            loaded[part] = null
          }
        })
      )

      if (!active) return
      setDialogsByPart(loaded)
    }

    loadDialogsForNavigation()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setActiveStepByPart((prev) => ({ ...prev, [currentPart]: prev[currentPart] ?? 0 }))
  }, [currentPart])

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
              onClick={() => handlePartChange(id)}
              aria-pressed={currentPart === id}
              aria-label={`Teil ${id}`}
            >
              {id}
            </button>
            ))}
        </nav>
        {viewMode === 'game' && currentPart > 0 && activeSubchapters.length > 0 && (
          <nav className="app__subnav" aria-label={`Unterkapitel Teil ${currentPart}`}>
            {activeSubchapters.map((chapter) => (
              <button
                key={`${currentPart}.${chapter.chapterIndex}`}
                type="button"
                className={`app__subnav-btn ${activeChapterStepIndex === chapter.stepIndex ? 'app__subnav-btn--active' : ''}`}
                onClick={() => setStepJumpRequest({ part: currentPart, stepIndex: chapter.stepIndex, nonce: Date.now() })}
                aria-pressed={activeChapterStepIndex === chapter.stepIndex}
                aria-label={`Teil ${currentPart}.${chapter.chapterIndex}: ${chapter.label}`}
              >
                <span className="app__subnav-index">{currentPart}.{chapter.chapterIndex}</span>
                <span className="app__subnav-label">{chapter.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>
      <main className="app__main">
        {viewMode === 'game' ? (
          <GameScreen
            currentPart={currentPart}
            onPartChange={handlePartChange}
            onSelectOption={handleSelectOption}
            stepJumpRequest={stepJumpRequest.part === currentPart ? stepJumpRequest : null}
            onStepChange={(part, stepIndex) => {
              setActiveStepByPart((prev) => ({ ...prev, [part]: stepIndex }))
            }}
            selectedAvatarId={selectedAvatarId}
            onSelectAvatar={setSelectedAvatarId}
            selectedHostId={selectedHostId}
            onSelectHost={setSelectedHostId}
          />
        ) : (
          <AdminDialogScreen />
        )}
      </main>
    </div>
  )
}
