import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/scene/Scene.jsx'
import { AvatarSelectionScreen } from './AvatarSelectionScreen.jsx'
import { getSceneById } from '../data/scenes.js'
import { getPart1Step } from '../data/conversations/part1.js'
import { getSceneDialogs } from '../api/dialogApi.js'

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

  useEffect(() => {
    setStepIndex(0)
    setLastSelectedOptionId(null)
    setChatMessages([])
    setSceneDialogs(null)
    appendedStepKeysRef.current = new Set()
  }, [currentPart])

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

  if (currentPart === 0) {
    return (
      <div className="avatar-selection-scene">
        <AvatarSelectionScreen
          selectedAvatarId={selectedAvatarId}
          onSelectAvatar={onSelectAvatar}
          onContinue={() => onPartChange?.(1)}
        />
      </div>
    )
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
      options={options}
      onSelectOption={handleSelectOption}
      selectedAvatarId={selectedAvatarId}
      selectedHostId={selectedHostId}
    />
  )
}
