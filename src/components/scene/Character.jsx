/**
 * Eine Figur (Host/Character) an konfigurierbarer Position.
 * Zeigt Avatar oder Platzhalter.
 */
export function Character({ name, position, avatarUrl, align }) {
  const style = {
    position: 'absolute',
    left: position?.x ?? '50%',
    top: position?.y ?? '60%',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(120px, 18vw, 200px)',
    height: 'clamp(160px, 24vw, 280px)',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--character-bg, rgba(255,255,255,0.9))',
    border: '2px solid var(--character-border, #ccc)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    color: 'var(--character-text, #333)',
  }
  return (
    <div className="scene-character" style={style} data-align={align} data-name={name}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span className="character-placeholder">{name}</span>
      )}
    </div>
  )
}
