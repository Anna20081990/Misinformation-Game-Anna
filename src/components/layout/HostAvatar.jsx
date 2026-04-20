function resolveHostId(characterId, speakerName) {
  const id = String(characterId || '').toLowerCase()
  if (id === 'emma') return 'conni'
  if (id === 'konrad') return 'konsti'
  if (id === 'didi') return 'lee'
  if (
    id === 'clara' ||
    id === 'uwe' ||
    id === 'ambassador' ||
    id === 'conni' ||
    id === 'konsti' ||
    id === 'lee'
  ) {
    return id
  }

  const name = String(speakerName || '').toLowerCase()
  if (name.includes('clara')) return 'clara'
  if (name.includes('uwe')) return 'uwe'
  if (name.includes('botschafterin')) return 'ambassador'
  if (name.includes('conni')) return 'conni'
  if (name.includes('konsti')) return 'konsti'
  if (name.includes('lee')) return 'lee'
  if (name.includes('emma')) return 'conni'
  if (name.includes('konrad')) return 'konsti'
  if (name.includes('didi')) return 'lee'
  return 'host'
}

function ClaraAvatar() {
  return <img src="/backgrounds/clara_blick_new.png" className="host-avatar__img" alt="Klara Blick" />
}

function UweAvatar() {
  return <img src="/backgrounds/uwe_blick_new.png" className="host-avatar__img" alt="Uwe R. Blick" />
}

function AmbassadorAvatar() {
  return <img src="/backgrounds/botschafterin.png" className="host-avatar__img" alt="Botschafterin Regelreich" />
}

function ConniAvatar() {
  return <img src="/backgrounds/conni_plex.jpg" className="host-avatar__img" alt="Conni Plex" />
}

function KonstiAvatar() {
  return <img src="/backgrounds/konsti_los.jpg" className="host-avatar__img" alt="Konsti Los" />
}

function LeeAvatar() {
  return <img src="/backgrounds/lee_ott.jpg" className="host-avatar__img" alt="Lee Ott" />
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
      {hostId === 'ambassador' && <AmbassadorAvatar />}
      {hostId === 'conni' && <ConniAvatar />}
      {hostId === 'konsti' && <KonstiAvatar />}
      {hostId === 'lee' && <LeeAvatar />}
      {hostId === 'host' && <GenericHostAvatar />}
    </div>
  )
}

