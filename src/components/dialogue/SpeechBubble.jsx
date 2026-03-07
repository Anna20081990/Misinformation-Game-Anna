/**
 * Sprechblase mit dynamischer Größe (passt sich dem Text an).
 * anchorTo: 'left' | 'right' – Ausrichtung und Schwanz-Position.
 */
export function SpeechBubble({ text, speakerName, anchorTo = 'left' }) {
  const isLeft = anchorTo === 'left'
  return (
    <div
      className={`speech-bubble speech-bubble--${isLeft ? 'left' : 'right'}`}
      role="dialog"
      aria-label={speakerName ? `Sprechblase von ${speakerName}` : undefined}
    >
      {speakerName && <span className="speech-bubble__speaker">{speakerName}:</span>}
      <p className="speech-bubble__text">{text}</p>
      <span className="speech-bubble__tail" aria-hidden="true" />
    </div>
  )
}
