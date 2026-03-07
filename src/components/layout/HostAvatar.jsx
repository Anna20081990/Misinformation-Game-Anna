function resolveHostId(characterId, speakerName) {
  const id = String(characterId || '').toLowerCase()
  if (id === 'clara' || id === 'uwe') return id

  const name = String(speakerName || '').toLowerCase()
  if (name.includes('clara')) return 'clara'
  if (name.includes('uwe')) return 'uwe'
  return 'host'
}

function ClaraAvatar() {
  return (
    <svg viewBox="0 0 96 96" className="host-avatar__svg" role="img" aria-label="Clara Blick">
      <defs>
        <linearGradient id="claraBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd9ff" />
          <stop offset="100%" stopColor="#93f0d1" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="47" fill="url(#claraBg)" />
      <ellipse cx="48" cy="76" rx="23" ry="15" fill="#2e4b69" />
      <rect x="43" y="52" width="10" height="13" rx="2" fill="#efbf9f" />
      <circle cx="48" cy="40" r="18" fill="#f5d2b6" />
      <path d="M30 39 Q34 20 48 20 Q63 20 66 39 Q62 34 56 33 Q53 30 48 30 Q41 30 36 35 Q33 36 30 39" fill="#26447a" />
      <circle cx="42" cy="40" r="2" fill="#223250" />
      <circle cx="54" cy="40" r="2" fill="#223250" />
      <path d="M40 48 Q48 53 56 48" stroke="#223250" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 70 Q40 63 48 63 Q56 63 68 70" stroke="#9ad8ff" strokeWidth="2" fill="none" />
    </svg>
  )
}

function UweAvatar() {
  return (
    <svg viewBox="0 0 96 96" className="host-avatar__svg" role="img" aria-label="Uwe R. Blick">
      <defs>
        <linearGradient id="uweBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b9f7a2" />
          <stop offset="100%" stopColor="#9fcbff" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="47" fill="url(#uweBg)" />
      <ellipse cx="48" cy="77" rx="24" ry="15" fill="#3a4f68" />
      <rect x="43" y="53" width="10" height="12" rx="2" fill="#efbf9f" />
      <circle cx="48" cy="41" r="18" fill="#f2d4bc" />
      <path d="M31 37 Q38 20 48 20 Q58 20 65 37 Q55 32 48 32 Q40 32 31 37" fill="#dce7f3" />
      <circle cx="41.5" cy="42" r="2" fill="#2d3b53" />
      <circle cx="54.5" cy="42" r="2" fill="#2d3b53" />
      <path d="M40 49 Q48 54 56 49" stroke="#2d3b53" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="42" r="5.5" fill="none" stroke="#3d5b82" strokeWidth="1.4" />
      <circle cx="54" cy="42" r="5.5" fill="none" stroke="#3d5b82" strokeWidth="1.4" />
      <path d="M47 42 L49 42" stroke="#3d5b82" strokeWidth="1.4" />
      <path d="M35 68 H61 L59 77 H37 Z" fill="#5b7aa3" />
    </svg>
  )
}

function GenericHostAvatar() {
  return (
    <svg viewBox="0 0 96 96" className="host-avatar__svg" role="img" aria-label="Host">
      <circle cx="48" cy="48" r="47" fill="#d9c7ff" />
      <ellipse cx="48" cy="76" rx="23" ry="14" fill="#4a4a66" />
      <circle cx="48" cy="41" r="17" fill="#f0d3ba" />
      <path d="M31 37 Q39 24 48 24 Q58 24 65 37" fill="#3d4c7d" />
      <circle cx="42" cy="41" r="2" fill="#293457" />
      <circle cx="54" cy="41" r="2" fill="#293457" />
      <path d="M41 48 Q48 53 55 48" stroke="#293457" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function HostAvatar({ characterId, speakerName }) {
  const hostId = resolveHostId(characterId, speakerName)

  return (
    <div className="host-avatar" aria-label={speakerName || 'Host'}>
      {hostId === 'clara' && <ClaraAvatar />}
      {hostId === 'uwe' && <UweAvatar />}
      {hostId === 'host' && <GenericHostAvatar />}
    </div>
  )
}
