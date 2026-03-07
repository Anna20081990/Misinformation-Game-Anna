import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/scene/Scene.jsx'
import { MonitorActivityScene } from '../components/scene/MonitorActivityScene.jsx'
import { getSceneById } from '../data/scenes.js'
import { getPart1Step } from '../data/conversations/part1.js'
import { getSceneDialogs } from '../api/dialogApi.js'

const PART0_FALLBACK_STEPS = [
  {
    stepIndex: 0,
    type: 'intro',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Willkommen in Regelreich. In dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen. Sie entstehen im Gespräch. Neue Vorschläge werden veröffentlicht. Bürger kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen. Der Mittelpunkt dieser Debatten ist TikTalk. Eine Plattform, auf der aus Meinungen Trends werden - und aus Trends mitunter offizielle Entscheidungen. Lange Zeit galt TikTalk als lebhaft, aber berechenbar. Doch in den letzten Monaten hat sich etwas verändert. Bestimmte Diskussionen eskalieren schneller. Einige Beiträge verbreiten sich ungewöhnlich stark. Manche Debatten kippen plötzlich in eine Richtung, die kaum noch sachlich wirkt. Im Media Lab Regelreich spricht man inzwischen von drei auffälligen Mustern. Intern wurden dafür Fallakten angelegt. Um diese Fälle systematisch zu untersuchen, wurden zusätzliche Sommerpraktika ausgeschrieben. Du bist hier, um bei der Aufklärung zu helfen.',
      },
    ],
    options: [
      { id: 'ready', label: 'Ich bin bereit!', nextStep: 1 },
      { id: 'hesitant', label: 'Muss ich?', nextStep: 1 },
    ],
  },
  {
    stepIndex: 1,
    type: 'intro',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Stark, das passt zu Regelreich. Dann legen wir direkt los.',
        showOnOptionId: 'ready',
      },
      {
        hostId: 'ambassador',
        text: 'Alles gut, du musst nicht perfekt starten. Wir gehen Schritt für Schritt gemeinsam durch.',
        showOnOptionId: 'hesitant',
      },
      {
        hostId: 'ambassador',
        text: 'Wähle jetzt deinen Avatar für das Praktikum.',
      },
    ],
    options: [
      { id: 'avatar1', label: 'Avatar 1', nextStep: 2 },
      { id: 'avatar2', label: 'Avatar 2', nextStep: 2 },
      { id: 'avatar3', label: 'Avatar 3', nextStep: 2 },
    ],
  },
  {
    stepIndex: 2,
    type: 'transition',
    speechBubbles: [
      {
        hostId: 'ambassador',
        text: 'Perfekt. Weiter geht es jetzt ins Media Lab.',
      },
    ],
    options: [
      { id: 'continue', label: 'Weiter zu Teil 1', nextPart: 1 },
    ],
  },
]

function isAvatarOption(option) {
  const id = String(option?.id || '').toLowerCase()
  return option?.kind === 'avatar' || id === 'avatar1' || id === 'avatar2' || id === 'avatar3'
}

function getHostFullName(hostId) {
  if (hostId === 'ambassador') return 'Botschafter Regelreich'
  if (hostId === 'clara') return 'Clara Blick'
  if (hostId === 'uwe') return 'Uwe R. Blick'
  return 'Host'
}

function normalizeHostId(raw, selectedHostId) {
  const id = String(raw || 'selected').toLowerCase()
  if (id === 'ambassador') return 'ambassador'
  if (id === 'clara' || id === 'uwe') return id
  if (id === 'selected') return selectedHostId || 'selected'
  return selectedHostId || 'selected'
}

function getFallbackStep(scene, currentPart, stepIndex) {
  if (currentPart === 0) {
    return PART0_FALLBACK_STEPS.find((step) => step.stepIndex === stepIndex) || PART0_FALLBACK_STEPS[0]
  }

  if (currentPart === 1) {
    const step = getPart1Step(stepIndex)
    return {
      stepIndex: step.stepIndex,
      speechBubbles: (step.speechBubbles || []).map((bubble) => ({
        hostId: bubble.characterId === 'uwe' ? 'uwe' : 'clara',
        text: bubble.text,
      })),
      options: step.options || [],
    }
  }

  return {
    stepIndex: 0,
    speechBubbles: (scene.speechBubbles || []).map((bubble) => ({
      hostId: bubble.characterId === 'host' ? 'selected' : bubble.characterId,
      text: bubble.text,
    })),
    options: scene.interaction?.options || [],
  }
}

export function GameScreen({
  currentPart,
  onPartChange,
  onSelectOption,
  stepJumpRequest,
  onStepChange,
  selectedAvatarId,
  onSelectAvatar,
  selectedHostId,
  onSelectHost,
}) {
  const scene = getSceneById(currentPart)
  const [stepIndex, setStepIndex] = useState(0)
  const [lastSelectedOptionId, setLastSelectedOptionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [sceneDialogs, setSceneDialogs] = useState(null)
  const appendedStepKeysRef = useRef(new Set())
  const transitionTimerRef = useRef(null)
  const previousStepMetaRef = useRef({ part: null, type: null, stepIndex: null })

  useEffect(() => {
    setStepIndex(0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSceneDialogs(null)
    appendedStepKeysRef.current = new Set()
  }, [currentPart])

  useEffect(() => {
    if (!stepJumpRequest) return

    setStepIndex(stepJumpRequest.stepIndex ?? 0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    appendedStepKeysRef.current = new Set()
  }, [stepJumpRequest])

  useEffect(() => {
    let active = true

    async function loadDialogs() {
      try {
        const data = await getSceneDialogs(currentPart)
        if (!active) return
        if (Number(data?.sceneId) !== Number(currentPart)) {
          setSceneDialogs(null)
          return
        }
        setSceneDialogs(data)
      } catch {
        if (!active) return
        setSceneDialogs(null)
      }
    }

    loadDialogs()
    return () => {
      active = false
    }
  }, [currentPart])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  const effectiveSceneDialogs = Number(sceneDialogs?.sceneId) === Number(currentPart) ? sceneDialogs : null
  const sortedBackendSteps = [...(effectiveSceneDialogs?.steps || [])].sort((a, b) => a.stepIndex - b.stepIndex)
  const stepData =
    sortedBackendSteps.find((step) => step.stepIndex === stepIndex) ||
    sortedBackendSteps[0] ||
    getFallbackStep(scene, currentPart, stepIndex)

  const options = stepData.options || []
  const isMonitorActivityMode = currentPart === 2 && String(stepData.type || '').toLowerCase() === 'activity'
  const displayOptions = options.map((option) => {
    if (currentPart === 0 && String(option?.id || '').toLowerCase() === 'continue') {
      return { ...option, disabled: !selectedAvatarId }
    }

    return option
  })

  useEffect(() => {
    onStepChange?.(currentPart, stepData.stepIndex ?? 0)
  }, [currentPart, stepData.stepIndex, onStepChange])

  useEffect(() => {
    const currentType = String(stepData.type || '').toLowerCase()
    const prev = previousStepMetaRef.current
    const samePart = prev.part === currentPart
    const enteredActivity = samePart && prev.type !== 'activity' && currentType === 'activity'
    const enteredSummary = samePart && prev.type === 'activity' && currentType === 'summary'

    // For Teil 2 monitor flow: start each activity phase and summary with a clean thread.
    if (currentPart === 2 && (enteredActivity || enteredSummary)) {
      setChatMessages([])
      appendedStepKeysRef.current = new Set()
    }

    previousStepMetaRef.current = {
      part: currentPart,
      type: currentType,
      stepIndex: stepData.stepIndex ?? 0,
    }
  }, [currentPart, stepData.stepIndex, stepData.type])

  useEffect(() => {
    const effectiveStepIndex = stepData.stepIndex ?? stepIndex
    const key = `${currentPart}:${effectiveStepIndex}`
    if (appendedStepKeysRef.current.has(key)) return

    appendedStepKeysRef.current.add(key)
    const speechBubbles = stepData.speechBubbles || []
    const conditional = speechBubbles.filter((bubble) => bubble.showOnOptionId)
    const unconditioned = speechBubbles.filter((bubble) => !bubble.showOnOptionId)
    const selectedConditional = conditional.filter((bubble) => bubble.showOnOptionId === lastSelectedOptionId)
    const effectiveBubbles = conditional.length
      ? (selectedConditional.length ? selectedConditional : unconditioned)
      : speechBubbles

    const hostMessages = effectiveBubbles.map((bubble, index) => {
      const resolvedHostId = normalizeHostId(bubble.hostId, selectedHostId)

      return {
        id: `${key}:host:${index}`,
        speakerType: 'host',
        hostId: resolvedHostId,
        speakerName: getHostFullName(resolvedHostId),
        text: bubble.text,
      }
    })

    setChatMessages((prev) => [...prev, ...hostMessages])
  }, [currentPart, stepData, stepIndex, selectedHostId, lastSelectedOptionId])

  const handleSelectOption = (index, option) => {
    onSelectOption?.(index, option, currentPart)
    setLastSelectedOptionId(option?.id ?? null)

    if (currentPart === 0 && isAvatarOption(option)) {
      onSelectAvatar?.(String(option.id).toLowerCase())
    }

    const selectedFromPart1 = currentPart === 1 && stepData.stepIndex === 0 && (option?.id === 'clara' || option?.id === 'uwe')
    if (selectedFromPart1) {
      onSelectHost?.(option.id)
    }

    if (option?.label && !isAvatarOption(option)) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `player:${currentPart}:${Date.now()}:${index}`,
          speakerType: 'player',
          speakerName: 'Du',
          text: option.label,
        },
      ])
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)

    const shouldNavigate = option?.nextPart != null || option?.nextStep != null
    if (!shouldNavigate) return

    transitionTimerRef.current = setTimeout(() => {
      if (option?.nextPart != null && onPartChange) {
        onPartChange(option.nextPart)
        setStepIndex(0)
        return
      }

      if (option?.nextStep != null) {
        setStepIndex(option.nextStep)
      }
    }, 220)
  }

  if (isMonitorActivityMode) {
    return <MonitorActivityScene messages={chatMessages} options={displayOptions} onSelectOption={handleSelectOption} />
  }

  return (
    <Scene
      scene={scene}
      messages={chatMessages}
      options={displayOptions}
      onSelectOption={handleSelectOption}
      selectedAvatarId={selectedAvatarId}
      selectedHostId={selectedHostId}
    />
  )
}
