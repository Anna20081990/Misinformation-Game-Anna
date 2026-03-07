import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/scene/Scene.jsx'
import { AvatarSelectionScreen } from './AvatarSelectionScreen.jsx'
import { getSceneById } from '../data/scenes.js'
import { getPart1Step } from '../data/conversations/part1.js'

/**
 * Eine Seite: aktueller Teil, Scene + Interaktionslogik.
 * Teil 0 = Avatar-Auswahl; Teil 1 = Konversation mit drei Interaktionsschleifen; andere Teile = feste Config.
 */
export function GameScreen({ currentPart, onPartChange, onSelectOption, selectedAvatarId, onSelectAvatar }) {
  const scene = getSceneById(currentPart)
  const [stepIndex, setStepIndex] = useState(0)
  const [chatMessages, setChatMessages] = useState([])
  const appendedStepKeysRef = useRef(new Set())
  const transitionTimerRef = useRef(null)

  useEffect(() => {
    setStepIndex(0)
    setChatMessages([])
    appendedStepKeysRef.current = new Set()
  }, [currentPart])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current)
    }
  }, [])

  const isPart1 = currentPart === 1
  const part1Step = isPart1 ? getPart1Step(stepIndex) : null
  const speechBubbles = part1Step?.speechBubbles ?? scene.speechBubbles
  const options = part1Step ? part1Step.options : scene.interaction?.options ?? []

  useEffect(() => {
    if (currentPart === 0) return

    const key = `${currentPart}:${isPart1 ? stepIndex : 0}`
    if (appendedStepKeysRef.current.has(key)) return

    appendedStepKeysRef.current.add(key)
    const hostMessages = (speechBubbles ?? []).map((bubble, index) => ({
      id: `${key}:host:${index}`,
      speakerType: 'host',
      characterId: bubble.characterId,
      speakerName: bubble.speakerName,
      text: bubble.text,
    }))

    setChatMessages((prev) => [...prev, ...hostMessages])
  }, [currentPart, isPart1, stepIndex, speechBubbles])

  if (currentPart === 0) {
    return (
      <div className="avatar-selection-scene">
        <AvatarSelectionScreen selectedAvatarId={selectedAvatarId} onSelectAvatar={onSelectAvatar} />
      </div>
    )
  }

  const handleSelectOption = (index, option) => {
    onSelectOption?.(index, option, currentPart)

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

    const shouldNavigate = option?.nextPart != null || (option?.nextStep != null && isPart1)
    if (!shouldNavigate) return

    transitionTimerRef.current = setTimeout(() => {
      if (option?.nextPart != null && onPartChange) {
        onPartChange(option.nextPart)
        setStepIndex(0)
        return
      }

      if (option?.nextStep != null && isPart1) {
        setStepIndex(option.nextStep)
      }
    }, 220)
  }

  const handleChatOptionSelect = (index, option) => {
    if (!option) {
      return
    }
    handleSelectOption(index, option)
  }

  return (
    <Scene
      scene={scene}
      messages={chatMessages}
      options={options}
      onSelectOption={handleChatOptionSelect}
      selectedAvatarId={selectedAvatarId}
    />
  )
}
