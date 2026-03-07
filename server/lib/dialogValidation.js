import { SCENES } from '../../src/data/scenes.js'
const HOST_IDS = new Set(['selected', 'clara', 'uwe'])

function assert(condition, message, status = 400) {
  if (!condition) {
    const error = new Error(message)
    error.status = status
    throw error
  }
}

export function ensureSceneExists(sceneId) {
  const exists = SCENES.some((scene) => scene.id === Number(sceneId))
  assert(exists, `Szene ${sceneId} existiert nicht.`, 404)
}

export function normalizeStepPayload(payload, fallbackStepIndex = null) {
  assert(payload && typeof payload === 'object', 'Request-Body muss ein Objekt sein.')

  const stepIndex = payload.stepIndex ?? fallbackStepIndex
  assert(Number.isInteger(stepIndex) && stepIndex >= 0, 'stepIndex muss eine ganze Zahl >= 0 sein.')

  const speechBubbles = payload.speechBubbles ?? []
  assert(Array.isArray(speechBubbles), 'speechBubbles muss ein Array sein.')

  const options = payload.options ?? []
  assert(Array.isArray(options), 'options muss ein Array sein.')

  const normalizedBubbles = speechBubbles.map((bubble, index) => {
    assert(bubble && typeof bubble === 'object', `speechBubbles[${index}] muss ein Objekt sein.`)
    assert(typeof bubble.text === 'string' && bubble.text.trim(), `speechBubbles[${index}].text ist erforderlich.`)
    const hostId = String(bubble.hostId ?? bubble.characterId ?? 'selected').toLowerCase()
    assert(HOST_IDS.has(hostId), `speechBubbles[${index}].hostId muss einer der Werte selected, clara oder uwe sein.`)

    return {
      hostId,
      text: bubble.text.trim(),
    }
  })

  const normalizedOptions = options.map((option, index) => {
    assert(option && typeof option === 'object', `options[${index}] muss ein Objekt sein.`)
    assert(typeof option.label === 'string' && option.label.trim(), `options[${index}].label ist erforderlich.`)

    const normalized = {
      id: option.id ?? `opt-${stepIndex}-${index}`,
      label: option.label.trim(),
    }

    if (option.nextStep != null) {
      assert(Number.isInteger(option.nextStep) && option.nextStep >= 0, `options[${index}].nextStep muss eine ganze Zahl >= 0 sein.`)
      normalized.nextStep = option.nextStep
    }

    if (option.nextPart != null) {
      assert(Number.isInteger(option.nextPart), `options[${index}].nextPart muss eine ganze Zahl sein.`)
      normalized.nextPart = option.nextPart
    }

    return normalized
  })

  return { stepIndex, speechBubbles: normalizedBubbles, options: normalizedOptions }
}

export function validateSceneDialogLogic(sceneEntry) {
  const steps = sceneEntry.steps ?? []
  const stepIds = new Set(steps.map((step) => step.stepIndex))
  assert(stepIds.size === steps.length, `Szene ${sceneEntry.sceneId}: stepIndex muss eindeutig sein.`)

  for (const step of steps) {
    assert(Number.isInteger(step.stepIndex) && step.stepIndex >= 0, `Szene ${sceneEntry.sceneId}: ungültiger stepIndex ${step.stepIndex}.`)
    assert(Array.isArray(step.speechBubbles), `Szene ${sceneEntry.sceneId}, Step ${step.stepIndex}: speechBubbles muss ein Array sein.`)
    assert(Array.isArray(step.options), `Szene ${sceneEntry.sceneId}, Step ${step.stepIndex}: options muss ein Array sein.`)
    for (const bubble of step.speechBubbles) {
      const hostId = String(bubble?.hostId ?? '').toLowerCase()
      assert(HOST_IDS.has(hostId), `Szene ${sceneEntry.sceneId}, Step ${step.stepIndex}: ungültiger hostId ${hostId}.`)
    }

    for (const option of step.options) {
      if (option.nextStep != null) {
        assert(stepIds.has(option.nextStep), `Szene ${sceneEntry.sceneId}, Step ${step.stepIndex}: nextStep ${option.nextStep} existiert nicht.`)
      }

      if (option.nextPart != null) {
        const targetSceneExists = SCENES.some((scene) => scene.id === option.nextPart)
        assert(targetSceneExists, `Szene ${sceneEntry.sceneId}, Step ${step.stepIndex}: nextPart ${option.nextPart} existiert nicht.`)
      }
    }
  }
}

export function ensureStepNotReferenced(sceneEntry, stepIndex) {
  const source = sceneEntry.steps.find((step) =>
    (step.options ?? []).some((option) => option.nextStep === stepIndex),
  )

  assert(!source, `Step ${stepIndex} kann nicht gelöscht werden, weil Step ${source?.stepIndex} darauf verweist.`, 409)
}
