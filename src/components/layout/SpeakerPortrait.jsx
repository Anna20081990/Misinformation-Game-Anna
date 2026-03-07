/**
 * Kleiner Kreis unten links – zeigt aktuellen Sprecher (optional).
 */
export function SpeakerPortrait({ name, avatarUrl }) {
  return (
    <div className="speaker-portrait" aria-hidden="true">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="speaker-portrait__img" />
      ) : (
        <span className="speaker-portrait__placeholder">{name ? name.charAt(0) : '?'}</span>
      )}
    </div>
  )
}
