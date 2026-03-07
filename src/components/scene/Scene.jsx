import { SceneBackground } from './SceneBackground.jsx'
import { SpeechBubble } from '../dialogue/SpeechBubble.jsx'
import { PlayerInteraction } from '../interaction/PlayerInteraction.jsx'

/**
 * Container: Hintergrund + Sprechblasen (NPCs) + Spieler-Interaktion (Avatar + Sprechblase unten links).
 * speechBubbles und interaction können von außen kommen (z. B. aktueller Konversationsschritt).
 * Sprechblasengröße passt sich dem Text dynamisch an.
 */
export function Scene({ scene, speechBubbles: speechBubblesOverride, interaction: interactionOverride, onSelectOption, selectedAvatarId }) {
  if (!scene) return null

  const { backgroundImage, backgroundPlaceholder, speechBubbles: sceneBubbles = [], interaction: sceneInteraction } = scene
  const speechBubbles = speechBubblesOverride ?? sceneBubbles
  const interaction = interactionOverride ?? sceneInteraction

  return (
    <div className="scene">
      <SceneBackground
        backgroundImage={backgroundImage}
        backgroundPlaceholder={backgroundPlaceholder}
      />
      <div className="scene__content">
        <div className="scene__bubbles">
          {speechBubbles.map((bubble, index) => (
            <div
              key={`${bubble.characterId}-${index}`}
              className="scene__bubble-wrapper"
              data-anchor={bubble.anchor}
            >
              <SpeechBubble
                text={bubble.text}
                speakerName={bubble.speakerName}
                anchorTo={bubble.anchor || 'left'}
              />
            </div>
          ))}
        </div>
      </div>
      <PlayerInteraction
        options={interaction?.options ?? []}
        onSelect={onSelectOption}
        selectedAvatarId={selectedAvatarId}
      />
    </div>
  )
}
