/**
 * Feste Leiste am unteren Rand mit 1 oder 2 Antwort-Buttons.
 * options: [{ id, label }], onSelect(index).
 */
export function InteractionBox({ options = [], onSelect }) {
  if (!options.length) return null
  return (
    <div className="interaction-box" role="group" aria-label="Antwortoptionen">
      <div className="interaction-box__decor">
        <span className="interaction-box__icon interaction-box__icon--arrows" aria-hidden="true" />
        <span className="interaction-box__wave" aria-hidden="true" />
        <span className="interaction-box__icon interaction-box__icon--help" aria-hidden="true" />
      </div>
      <div className="interaction-box__buttons">
        {options.map((opt, index) => (
          <button
            key={opt.id ?? index}
            type="button"
            className="interaction-box__button"
            onClick={() => onSelect?.(index, opt)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
