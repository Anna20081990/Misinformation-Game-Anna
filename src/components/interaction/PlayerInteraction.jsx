/**
 * Unterer interaktiver Teil: gewählter oder generischer Avatar unten links + Sprechblase mit Antwortoptionen.
 * selectedAvatarId: aus Teil 0 gewählter Avatar (avatar1, avatar2, avatar3); sonst generischer Avatar.
 */
import { getPlayerAvatarComponent } from '../layout/PlayerAvatars.jsx'

export function PlayerInteraction({ options = [], onSelect, selectedAvatarId }) {
  if (!options.length) return null

  const AvatarComponent = getPlayerAvatarComponent(selectedAvatarId)

  return (
    <div className="player-interaction" role="group" aria-label="Deine Antwort">
      <div className="player-interaction__avatar">
        <AvatarComponent className="player-interaction__avatar-svg" />
      </div>
      <div className="player-interaction__bubble">
        <div className="player-interaction__bubble-tail" aria-hidden="true" />
        <div className="player-interaction__buttons">
          {options.map((opt, index) => (
            <button
              key={opt.id ?? index}
              type="button"
              className="player-interaction__button"
              onClick={() => onSelect?.(index, opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
