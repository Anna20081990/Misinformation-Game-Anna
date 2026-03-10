import { useEffect, useState } from 'react'
import { GameScreen } from './pages/GameScreen.jsx'
import { AdminDialogScreen } from './pages/AdminDialogScreen.jsx'
import { useScene } from './hooks/useScene.js'
import { DEFAULT_PART } from './data/constants.js'
import { getSceneDialogs } from './api/dialogApi.js'

const FALLBACK_NAV_STEPS_BY_PART = {
  1: [
    { stepIndex: 0, type: 'intro' },
    { stepIndex: 2, type: 'intro' },
    { stepIndex: 5, type: 'intro' },
    { stepIndex: 7, type: 'transition' },
  ],
  2: [
    { stepIndex: 0, type: 'intro' },
    { stepIndex: 1, type: 'example' },
    { stepIndex: 2, type: 'example' },
    { stepIndex: 3, type: 'activity' },
    { stepIndex: 4, type: 'activity' },
    { stepIndex: 5, type: 'summary' },
  ],
  3: [
    { stepIndex: 0, type: 'intro' },
    { stepIndex: 1, type: 'example' },
    { stepIndex: 2, type: 'example' },
    { stepIndex: 3, type: 'activity' },
    { stepIndex: 4, type: 'activity' },
    { stepIndex: 5, type: 'summary' },
  ],
  4: [
    { stepIndex: 0, type: 'intro' },
    { stepIndex: 1, type: 'example' },
    { stepIndex: 2, type: 'example' },
    { stepIndex: 3, type: 'activity' },
    { stepIndex: 4, type: 'activity' },
    { stepIndex: 5, type: 'summary' },
  ],
  5: [
    { stepIndex: 0, type: 'intro' },
    { stepIndex: 1, type: 'summary' },
    { stepIndex: 3, type: 'transition' },
  ],
}

const PART1_SUBCHAPTERS = [
  { stepIndex: 0, label: 'Intro' },
  { stepIndex: 2, label: 'Fallakten' },
  { stepIndex: 5, label: 'Aufstieg' },
  { stepIndex: 7, label: 'Host-Auswahl' },
]

function buildSubchapters(steps = [], part = null) {
  if (Number(part) === 1) {
    const availableStepIndexes = new Set(
      (steps || [])
        .filter((step) => Number.isFinite(step?.stepIndex))
        .map((step) => step.stepIndex)
    )

    const entries = PART1_SUBCHAPTERS.filter((entry) => availableStepIndexes.has(entry.stepIndex))
    return entries.map((entry, index) => ({ ...entry, chapterIndex: index }))
  }

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
        if (summaryEntry) summaryEntry.label = 'Outro'
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
  if (step && Number(currentStepIndex) >= 10) {
    const type = String(step.type || 'dialog').toLowerCase()
    if (type === 'intro') {
      const introEntry = subchapters.find((chapter) => chapter.label === 'Intro')
      if (introEntry) return introEntry.stepIndex
    }
    if (type === 'example') {
      const exampleEntries = subchapters
        .filter((chapter) => String(chapter.label || '').startsWith('Beispiel'))
        .sort((a, b) => a.stepIndex - b.stepIndex)
      const lastExampleEntry = exampleEntries[exampleEntries.length - 1]
      if (lastExampleEntry) return lastExampleEntry.stepIndex
    }
    if (type === 'transition') {
      const outroEntry = subchapters.find((chapter) => chapter.label === 'Outro' || chapter.label === 'Summary')
      if (outroEntry) return outroEntry.stepIndex
    }
  }

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
  const [dialogApiStatus, setDialogApiStatus] = useState({ ok: true, failedParts: [], lastError: '' })
  const [activeStepByPart, setActiveStepByPart] = useState({})
  const [stepJumpRequest, setStepJumpRequest] = useState({ part: DEFAULT_PART, stepIndex: 0, nonce: 0 })

  const handlePartChange = (part) => {
    setCurrentPart(part)
    setStepJumpRequest({ part, stepIndex: 0, nonce: Date.now() })
  }
  const handleSelectOption = (index, option, part) => {
    console.log('Antwort gewählt:', option?.label, 'Teil:', part)
  }

  const activeSteps = (dialogsByPart[currentPart]?.steps?.length
    ? dialogsByPart[currentPart].steps
    : (FALLBACK_NAV_STEPS_BY_PART[currentPart] || []))
  const activeSubchapters = buildSubchapters(activeSteps, currentPart)
  const activeChapterStepIndex = resolveActiveChapterStep(
    activeStepByPart[currentPart] ?? 0,
    activeSubchapters,
    activeSteps
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
      const parts = [0, 1, 2, 3, 4, 5]
      const loaded = {}
      const failedParts = []
      let lastError = ''

      await Promise.all(
        parts.map(async (part) => {
          try {
            const data = await getSceneDialogs(part)
            loaded[part] = data
          } catch (error) {
            loaded[part] = null
            failedParts.push(part)
            lastError = error?.message || String(error || '')
            console.error(`[Dialog API] Teil ${part} konnte nicht geladen werden.`, error)
          }
        })
      )

      if (!active) return
      setDialogsByPart(loaded)
      setDialogApiStatus({
        ok: failedParts.length === 0,
        failedParts,
        lastError,
      })
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
        {!dialogApiStatus.ok && (
          <div role="status" aria-live="polite" style={{ marginBottom: '0.75rem', color: '#8b0000', fontWeight: 600 }}>
            Backend-Dialoge nicht erreichbar (Teile: {dialogApiStatus.failedParts.join(', ')}). Letzter Fehler: {dialogApiStatus.lastError || 'unbekannt'}
          </div>
        )}
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
              setActiveStepByPart((prev) => (
                prev[part] === stepIndex ? prev : { ...prev, [part]: stepIndex }
              ))
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
