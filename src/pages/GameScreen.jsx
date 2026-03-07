import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setStepIndex(0)
  }, [currentPart])

  if (currentPart === 0) {
    return (
      <div className="avatar-selection-scene">
        <AvatarSelectionScreen selectedAvatarId={selectedAvatarId} onSelectAvatar={onSelectAvatar} />
      </div>
    )
  }

  const isPart1 = currentPart === 1
  const part1Step = isPart1 ? getPart1Step(stepIndex) : null
  const speechBubbles = part1Step?.speechBubbles ?? scene.speechBubbles
  const interaction = part1Step ? { options: part1Step.options } : scene.interaction

  const handleSelectOption = (index, option) => {
    onSelectOption?.(index, option, currentPart)

    if (option?.nextPart != null && onPartChange) {
      onPartChange(option.nextPart)
      setStepIndex(0)
      return
    }
    if (option?.nextStep != null && isPart1) {
      setStepIndex(option.nextStep)
    }
  }

  return (
    <Scene
      scene={scene}
      speechBubbles={speechBubbles}
      interaction={interaction}
      onSelectOption={handleSelectOption}
      selectedAvatarId={selectedAvatarId}
    />
  )
}
