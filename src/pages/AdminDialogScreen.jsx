import { useEffect, useMemo, useState } from 'react'
import {
  createSceneDialogStep,
  deleteSceneDialogStep,
  getSceneDialogs,
  getScenes,
  updateSceneDialogStep,
} from '../api/dialogApi.js'

function emptyForm(stepIndex = 0) {
  return {
    stepIndex,
    speechBubbles: [{ characterId: '', speakerName: '', text: '', anchor: 'left' }],
    options: [{ id: '', label: '', nextStep: '', nextPart: '' }],
  }
}

function toNumberOrNull(value) {
  if (value === '' || value == null) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function normalizeForApi(formData) {
  return {
    stepIndex: Number(formData.stepIndex),
    speechBubbles: formData.speechBubbles
      .filter((item) => item.text && item.text.trim())
      .map((item) => ({
        characterId: item.characterId?.trim() || null,
        speakerName: item.speakerName?.trim() || null,
        text: item.text.trim(),
        anchor: item.anchor || 'left',
      })),
    options: formData.options
      .filter((item) => item.label && item.label.trim())
      .map((item, index) => {
        const out = {
          id: item.id?.trim() || `opt-${formData.stepIndex}-${index}`,
          label: item.label.trim(),
        }

        const nextStep = toNumberOrNull(item.nextStep)
        const nextPart = toNumberOrNull(item.nextPart)

        if (nextStep != null) out.nextStep = nextStep
        if (nextPart != null) out.nextPart = nextPart

        return out
      }),
  }
}

function fromStep(step) {
  return {
    stepIndex: step.stepIndex,
    speechBubbles: (step.speechBubbles || []).map((item) => ({
      characterId: item.characterId ?? '',
      speakerName: item.speakerName ?? '',
      text: item.text ?? '',
      anchor: item.anchor ?? 'left',
    })),
    options: (step.options || []).map((item) => ({
      id: item.id ?? '',
      label: item.label ?? '',
      nextStep: item.nextStep ?? '',
      nextPart: item.nextPart ?? '',
    })),
  }
}

export function AdminDialogScreen() {
  const [scenes, setScenes] = useState([])
  const [selectedSceneId, setSelectedSceneId] = useState(null)
  const [sceneDialogs, setSceneDialogs] = useState({ sceneId: null, steps: [] })
  const [editingStepIndex, setEditingStepIndex] = useState(null)
  const [formData, setFormData] = useState(emptyForm(0))
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const sortedSteps = useMemo(
    () => [...(sceneDialogs.steps || [])].sort((a, b) => a.stepIndex - b.stepIndex),
    [sceneDialogs.steps],
  )

  async function loadScenes() {
    setLoading(true)
    setError('')
    try {
      const data = await getScenes()
      setScenes(data)
      const firstSceneId = data[0]?.sceneId ?? null
      if (selectedSceneId == null && firstSceneId != null) {
        setSelectedSceneId(firstSceneId)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadDialogs(sceneId) {
    if (sceneId == null) return

    setLoading(true)
    setError('')
    try {
      const data = await getSceneDialogs(sceneId)
      setSceneDialogs(data)
      setEditingStepIndex(null)
      const nextIndex = Math.max(-1, ...(data.steps || []).map((step) => step.stepIndex)) + 1
      setFormData(emptyForm(nextIndex))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScenes()
  }, [])

  useEffect(() => {
    if (selectedSceneId != null) {
      loadDialogs(selectedSceneId)
    }
  }, [selectedSceneId])

  function updateBubble(index, field, value) {
    setFormData((prev) => {
      const next = [...prev.speechBubbles]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, speechBubbles: next }
    })
  }

  function updateOption(index, field, value) {
    setFormData((prev) => {
      const next = [...prev.options]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, options: next }
    })
  }

  function selectStep(stepIndex) {
    const step = sortedSteps.find((item) => item.stepIndex === stepIndex)
    if (!step) return
    setEditingStepIndex(stepIndex)
    setFormData(fromStep(step))
    setStatus('')
  }

  function startNewStep() {
    const nextIndex = Math.max(-1, ...sortedSteps.map((step) => step.stepIndex)) + 1
    setEditingStepIndex(null)
    setFormData(emptyForm(nextIndex))
    setStatus('Neuer Dialogschritt vorbereitet.')
  }

  async function saveStep() {
    if (selectedSceneId == null) return

    setLoading(true)
    setError('')
    setStatus('')

    try {
      const payload = normalizeForApi(formData)

      if (editingStepIndex == null) {
        await createSceneDialogStep(selectedSceneId, payload)
        setStatus(`Dialogschritt ${payload.stepIndex} erstellt.`)
      } else {
        await updateSceneDialogStep(selectedSceneId, editingStepIndex, payload)
        setStatus(`Dialogschritt ${editingStepIndex} aktualisiert.`)
      }

      await loadDialogs(selectedSceneId)
      if (editingStepIndex != null) {
        selectStep(editingStepIndex)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeStep() {
    if (selectedSceneId == null || editingStepIndex == null) return

    setLoading(true)
    setError('')
    setStatus('')

    try {
      await deleteSceneDialogStep(selectedSceneId, editingStepIndex)
      setStatus(`Dialogschritt ${editingStepIndex} gelöscht.`)
      await loadDialogs(selectedSceneId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin">
      <div className="admin__header">
        <h1 className="admin__title">Dialogverwaltung</h1>
        <p className="admin__subtitle">Szenen und Dialoglogik lokal über das Backend bearbeiten.</p>
      </div>

      <div className="admin__layout">
        <aside className="admin__panel">
          <h2>Szenen</h2>
          <div className="admin__list">
            {scenes.map((scene) => (
              <button
                key={scene.sceneId}
                type="button"
                className={`admin__list-btn ${scene.sceneId === selectedSceneId ? 'admin__list-btn--active' : ''}`}
                onClick={() => setSelectedSceneId(scene.sceneId)}
              >
                <span>Teil {scene.sceneId}</span>
                <small>{scene.name}</small>
                <small>{scene.stepCount} Schritte</small>
              </button>
            ))}
          </div>
        </aside>

        <aside className="admin__panel">
          <div className="admin__panel-head">
            <h2>Dialogschritte</h2>
            <button type="button" className="admin__action" onClick={startNewStep}>Neu</button>
          </div>
          <div className="admin__list">
            {sortedSteps.map((step) => (
              <button
                key={step.stepIndex}
                type="button"
                className={`admin__list-btn ${editingStepIndex === step.stepIndex ? 'admin__list-btn--active' : ''}`}
                onClick={() => selectStep(step.stepIndex)}
              >
                <span>Step {step.stepIndex}</span>
                <small>{step.options?.length || 0} Optionen</small>
              </button>
            ))}
            {!sortedSteps.length && <p className="admin__hint">Keine Dialogschritte vorhanden.</p>}
          </div>
        </aside>

        <div className="admin__editor">
          <div className="admin__panel-head">
            <h2>{editingStepIndex == null ? 'Neuer Dialogschritt' : `Step ${editingStepIndex} bearbeiten`}</h2>
            <div className="admin__actions">
              <button type="button" className="admin__action" onClick={saveStep} disabled={loading}>Speichern</button>
              <button
                type="button"
                className="admin__danger"
                onClick={removeStep}
                disabled={loading || editingStepIndex == null}
              >
                Löschen
              </button>
            </div>
          </div>

          <label className="admin__field">
            <span>Step Index</span>
            <input
              type="number"
              value={formData.stepIndex}
              disabled={editingStepIndex != null}
              onChange={(event) => setFormData((prev) => ({ ...prev, stepIndex: Number(event.target.value) }))}
            />
          </label>

          <h3>Speech Bubbles</h3>
          {(formData.speechBubbles || []).map((bubble, index) => (
            <div key={`bubble-${index}`} className="admin__block">
              <label className="admin__field">
                <span>Character ID</span>
                <input value={bubble.characterId} onChange={(event) => updateBubble(index, 'characterId', event.target.value)} />
              </label>
              <label className="admin__field">
                <span>Speaker</span>
                <input value={bubble.speakerName} onChange={(event) => updateBubble(index, 'speakerName', event.target.value)} />
              </label>
              <label className="admin__field">
                <span>Anchor</span>
                <select value={bubble.anchor} onChange={(event) => updateBubble(index, 'anchor', event.target.value)}>
                  <option value="left">left</option>
                  <option value="right">right</option>
                </select>
              </label>
              <label className="admin__field admin__field--full">
                <span>Text</span>
                <textarea rows="3" value={bubble.text} onChange={(event) => updateBubble(index, 'text', event.target.value)} />
              </label>
              <button
                type="button"
                className="admin__link"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    speechBubbles: prev.speechBubbles.filter((_, i) => i !== index),
                  }))
                }
                disabled={formData.speechBubbles.length <= 1}
              >
                Bubble entfernen
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin__action"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                speechBubbles: [...prev.speechBubbles, { characterId: '', speakerName: '', text: '', anchor: 'left' }],
              }))
            }
          >
            Bubble hinzufügen
          </button>

          <h3>Optionen</h3>
          {(formData.options || []).map((option, index) => (
            <div key={`option-${index}`} className="admin__block">
              <label className="admin__field">
                <span>ID</span>
                <input value={option.id} onChange={(event) => updateOption(index, 'id', event.target.value)} />
              </label>
              <label className="admin__field admin__field--full">
                <span>Label</span>
                <input value={option.label} onChange={(event) => updateOption(index, 'label', event.target.value)} />
              </label>
              <label className="admin__field">
                <span>nextStep</span>
                <input value={option.nextStep} onChange={(event) => updateOption(index, 'nextStep', event.target.value)} />
              </label>
              <label className="admin__field">
                <span>nextPart</span>
                <input value={option.nextPart} onChange={(event) => updateOption(index, 'nextPart', event.target.value)} />
              </label>
              <button
                type="button"
                className="admin__link"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    options: prev.options.filter((_, i) => i !== index),
                  }))
                }
                disabled={formData.options.length <= 1}
              >
                Option entfernen
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin__action"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                options: [...prev.options, { id: '', label: '', nextStep: '', nextPart: '' }],
              }))
            }
          >
            Option hinzufügen
          </button>

          {loading && <p className="admin__hint">Lade...</p>}
          {status && <p className="admin__success">{status}</p>}
          {error && <p className="admin__error">{error}</p>}
        </div>
      </div>
    </section>
  )
}
