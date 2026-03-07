import { SCENES } from '../../src/data/scenes.js'
import { PART1_CONVERSATION } from '../../src/data/conversations/part1.js'

function toHostId(value) {
  const id = String(value || '').toLowerCase()
  if (id.includes('clara')) return 'clara'
  if (id.includes('uwe')) return 'uwe'
  return 'selected'
}

function normalizeSpeechBubbles(speechBubbles = []) {
  return speechBubbles.map((bubble) => ({
    hostId: toHostId(bubble.hostId ?? bubble.characterId ?? bubble.speakerName),
    text: String(bubble.text || '').trim(),
  })).filter((bubble) => bubble.text)
}

function normalizeOptions(options = []) {
  return options.map((option, index) => {
    const out = {
      id: option.id ?? `opt-${index}`,
      label: String(option.label || '').trim(),
    }

    if (option.nextStep != null) out.nextStep = Number(option.nextStep)
    if (option.nextPart != null) out.nextPart = Number(option.nextPart)

    return out
  }).filter((option) => option.label)
}

function buildSceneSteps(sceneId) {
  if (sceneId === 1) {
    return PART1_CONVERSATION.map((step) => ({
      stepIndex: Number(step.stepIndex),
      speechBubbles: normalizeSpeechBubbles(step.speechBubbles),
      options: normalizeOptions(step.options),
    }))
  }

  const scene = SCENES.find((item) => item.id === sceneId)
  if (!scene || sceneId === 0) return []

  return [{
    stepIndex: 0,
    speechBubbles: normalizeSpeechBubbles(scene.speechBubbles),
    options: normalizeOptions(scene.interaction?.options || []),
  }]
}

export function buildSeedDialogs() {
  return SCENES
    .map((scene) => ({
      sceneId: Number(scene.id),
      steps: buildSceneSteps(Number(scene.id)),
    }))
    .sort((a, b) => a.sceneId - b.sceneId)
}
