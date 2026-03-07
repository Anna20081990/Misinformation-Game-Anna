import { SceneBackground } from './SceneBackground.jsx'
import { ChatPanel } from '../chat/ChatPanel.jsx'
import { getPlayerAvatarComponent } from '../layout/PlayerAvatars.jsx'

/**
 * Container: Hintergrund + Chatbox rechts + Spieler-Avatar links unten.
 */
export function Scene({ scene, messages = [], options = [], onSelectOption, selectedAvatarId }) {
  if (!scene) return null

  const { id, backgroundImage, backgroundPlaceholder } = scene
  const AvatarComponent = getPlayerAvatarComponent(selectedAvatarId)
  const showPlayerOnBackground = id === 2 && Boolean(selectedAvatarId)

  return (
    <div className="scene">
      <SceneBackground
        backgroundImage={backgroundImage}
        backgroundPlaceholder={backgroundPlaceholder}
      />

      <div className="scene__chat-wrap">
        <ChatPanel
          messages={messages}
          options={options}
          onSelectOption={onSelectOption}
        />
      </div>

      {showPlayerOnBackground && (
        <div className="scene__player-onstage" aria-hidden="true">
          <AvatarComponent className="scene__player-onstage-img" />
        </div>
      )}

      <div className="scene__player-dock" aria-hidden="true">
        <div className="scene__player-avatar">
          <AvatarComponent className="scene__player-avatar-img" />
        </div>
      </div>
    </div>
  )
}
