import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/scene/Scene.jsx'
import { getSceneById } from '../data/scenes.js'
import { getPart1Step } from '../data/conversations/part1.js'
import { getSceneDialogs } from '../api/dialogApi.js'

const PART0_INTRO_TEXT = 'Willkommen in Regelreich. In dieser Stadt entstehen Regeln nicht hinter verschlossenen Türen. Sie entstehen im Gespräch. Neue Vorschläge werden veröffentlicht. Bürger kommentieren. Ideen werden diskutiert, verändert, manchmal verworfen. Der Mittelpunkt dieser Debatten ist TikTalk. Eine Plattform, auf der aus Meinungen Trends werden - und aus Trends mitunter offizielle Entscheidungen. Lange Zeit galt TikTalk als lebhaft, aber berechenbar. Doch in den letzten Monaten hat sich etwas verändert. Bestimmte Diskussionen eskalieren schneller. Einige Beiträge verbreiten sich ungewöhnlich stark. Manche Debatten kippen plötzlich in eine Richtung, die kaum noch sachlich wirkt. Im Media Lab Regelreich spricht man inzwischen von drei auffälligen Mustern. Intern wurden dafür Fallakten angelegt. Um diese Fälle systematisch zu untersuchen, wurden zusätzliche Sommerpraktika ausgeschrieben. Du bist hier, um bei der Aufklärung zu helfen.'
const PART0_READY_REPLY = 'Stark, das passt zu Regelreich. Dann legen wir direkt los.'
const PART0_HESITANT_REPLY = 'Alles gut, du musst nicht perfekt starten. Wir gehen Schritt für Schritt gemeinsam durch.'
const PART0_AVATAR_PROMPT = 'Wähle jetzt deinen Avatar für das Praktikum.'
const PART0_AVATAR_IDS = ['avatar1', 'avatar2', 'avatar3']

function getHostFullName(hostId) {
  if (hostId === 'clara') return 'Clara Blick'
  if (hostId === 'uwe') return 'Uwe R. Blick'
  return 'Host'
}

function normalizeHostId(raw, selectedHostId) {
  const id = String(raw || 'selected').toLowerCase()
  if (id === 'clara' || id === 'uwe') return id
  if (id === 'selected') return selectedHostId || 'selected'
  return selectedHostId || 'selected'
}

function getFallbackStep(scene, currentPart, stepIndex) {
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
  const [part0Stage, setPart0Stage] = useState('intro')
  const appendedStepKeysRef = useRef(new Set())
  const transitionTimerRef = useRef(null)

  useEffect(() => {
    setStepIndex(0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSceneDialogs(null)
    setPart0Stage('intro')
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
      if (currentPart === 0) return

      try {
        const data = await getSceneDialogs(currentPart)
        if (!active) return
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

  const sortedBackendSteps = [...(sceneDialogs?.steps || [])].sort((a, b) => a.stepIndex - b.stepIndex)
  const stepData =
    sortedBackendSteps.find((step) => step.stepIndex === stepIndex) ||
    sortedBackendSteps[0] ||
    getFallbackStep(scene, currentPart, stepIndex)

  const options = stepData.options || []
  const part0Options = part0Stage === 'intro'
    ? [
      { id: 'ready', label: 'Ich bin bereit!' },
      { id: 'hesitant', label: 'Muss ich?' },
    ]
    : [
      ...PART0_AVATAR_IDS.map((avatarId) => ({
        id: `avatar:${avatarId}`,
        kind: 'avatar',
        avatarId,
        label: `Avatar ${avatarId}`,
      })),
      { id: 'continue', label: 'Weiter zu Teil 1', disabled: !selectedAvatarId },
    ]

  useEffect(() => {
    onStepChange?.(currentPart, stepData.stepIndex ?? 0)
  }, [currentPart, stepData.stepIndex, onStepChange])

  useEffect(() => {
    if (currentPart !== 0) return
    if (chatMessages.length) return

    setChatMessages([
      {
        id: 'part0:intro',
        speakerType: 'host',
        hostId: 'host',
        speakerName: 'Botschafter Regelreich',
        text: PART0_INTRO_TEXT,
      },
    ])
  }, [currentPart, chatMessages.length])

  useEffect(() => {
    if (currentPart === 0) return

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

  const handlePart0Option = (index, option) => {
    onSelectOption?.(index, option, currentPart)

    if (option?.id === 'ready' || option?.id === 'hesitant') {
      const cityReply = option.id === 'ready' ? PART0_READY_REPLY : PART0_HESITANT_REPLY

      setChatMessages((prev) => [
        ...prev,
        {
          id: `part0:player:${Date.now()}:${index}`,
          speakerType: 'player',
          speakerName: 'Du',
          text: option.label,
        },
        {
          id: `part0:reply:${Date.now()}:${option.id}`,
          speakerType: 'host',
          hostId: 'host',
          speakerName: 'Botschafter Regelreich',
          text: cityReply,
        },
        {
          id: `part0:prompt:${Date.now()}`,
          speakerType: 'host',
          hostId: 'host',
          speakerName: 'Botschafter Regelreich',
          text: PART0_AVATAR_PROMPT,
        },
      ])

      setPart0Stage('avatar')
      return
    }

    if (option?.kind === 'avatar' && option?.avatarId) {
      onSelectAvatar?.(option.avatarId)
      return
    }

    if (option?.id === 'continue') {
      onPartChange?.(1)
    }
  }

  const handleSelectOption = (index, option) => {
    onSelectOption?.(index, option, currentPart)
    setLastSelectedOptionId(option?.id ?? null)

    const selectedFromPart1 = currentPart === 1 && stepData.stepIndex === 0 && (option?.id === 'clara' || option?.id === 'uwe')
    if (selectedFromPart1) {
      onSelectHost?.(option.id)
    }

    if (option?.label) {
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

  return (
    <Scene
      scene={scene}
      messages={chatMessages}
      options={currentPart === 0 ? part0Options : options}
      onSelectOption={currentPart === 0 ? handlePart0Option : handleSelectOption}
      selectedAvatarId={selectedAvatarId}
      selectedHostId={selectedHostId}
    />
  )
}
