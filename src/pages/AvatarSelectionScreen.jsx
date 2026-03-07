import { PLAYER_AVATAR_IDS } from '../data/constants.js'
import { Avatar1, Avatar2, Avatar3 } from '../components/layout/PlayerAvatars.jsx'

const AVATAR_COMPONENTS = [Avatar1, Avatar2, Avatar3]
const AVATAR_LABELS = { avatar1: 'Mädchen', avatar2: 'Junge', avatar3: 'Hund' }

/**
 * Teil 0: Weißer Hintergrund, drei Avatare zur Auswahl (Mädchen, Junge, Hund).
 * Ein Klick wählt den Avatar und speichert ihn für die restlichen Teile.
 */
export function AvatarSelectionScreen({ selectedAvatarId, onSelectAvatar }) {
  return (
    <div className="avatar-selection">
      <h1 className="avatar-selection__title">Wähle deinen Avatar</h1>
      <p className="avatar-selection__subtitle">Klicke auf einen Avatar, um ihn für das Praktikum zu verwenden.</p>
      <div className="avatar-selection__list">
        {PLAYER_AVATAR_IDS.map((id, index) => {
          const AvatarComponent = AVATAR_COMPONENTS[index]
          const isSelected = selectedAvatarId === id
          return (
            <button
              key={id}
              type="button"
              className={`avatar-selection__item ${isSelected ? 'avatar-selection__item--selected' : ''}`}
              onClick={() => onSelectAvatar?.(id)}
              aria-pressed={isSelected}
              aria-label={`${AVATAR_LABELS[id]} wählen`}
            >
              <AvatarComponent className="avatar-selection__svg" />
              <span className="avatar-selection__label">{AVATAR_LABELS[id]}</span>
              {isSelected && <span className="avatar-selection__check">Ausgewählt</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
