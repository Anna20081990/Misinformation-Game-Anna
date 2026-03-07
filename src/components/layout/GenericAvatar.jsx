/**
 * Generischer Comic-Avatar im gleichen Stil wie die Charaktere im Hintergrundbild.
 * Neutraler, freundlicher Stil mit klaren Umrissen.
 */
export function GenericAvatar({ className = '' }) {
  return (
    <div className={`generic-avatar ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-avatar__svg"
        role="img"
        aria-label="Spieler-Avatar"
      >
        {/* Körper – einfache Jacke/Body */}
        <ellipse cx="60" cy="128" rx="38" ry="28" fill="#3a4a5a" stroke="#2a3540" strokeWidth="2" />
        <path
          d="M28 115 L92 115 L90 155 L30 155 Z"
          fill="#2d3b48"
          stroke="#2a3540"
          strokeWidth="2"
        />
        {/* Hals */}
        <rect x="54" y="98" width="12" height="18" rx="2" fill="#e8c4a0" stroke="#d4a574" strokeWidth="1.5" />
        {/* Kopf */}
        <circle cx="60" cy="72" r="32" fill="#f0d4b8" stroke="#2a3540" strokeWidth="2.5" />
        {/* Haare (kurz, dunkel) */}
        <path
          d="M32 55 Q60 38 88 55 Q85 72 60 72 Q35 72 32 55"
          fill="#2a3540"
          stroke="#1a2028"
          strokeWidth="1"
        />
        {/* Augen */}
        <circle cx="48" cy="68" r="4" fill="#2a3540" />
        <circle cx="72" cy="68" r="4" fill="#2a3540" />
        {/* Lächeln */}
        <path
          d="M46 82 Q60 92 74 82"
          stroke="#2a3540"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
