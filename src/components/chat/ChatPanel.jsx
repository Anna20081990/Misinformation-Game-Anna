import { useEffect, useRef } from 'react'
import { HostAvatar } from '../layout/HostAvatar.jsx'
import { getPlayerAvatarComponent } from '../layout/PlayerAvatars.jsx'

function isAvatarOption(option) {
  const id = String(option?.id || '').toLowerCase()
  return option?.kind === 'avatar' || id === 'avatar1' || id === 'avatar2' || id === 'avatar3'
}

function getHostDisplayName(hostId, speakerName, selectedHostId) {
  const id = String(hostId || '').toLowerCase()
  const name = String(speakerName || '').toLowerCase()

  // If a specific non-host speaker label is provided (e.g. "Botschafter Regelreich"),
  // prefer it over dynamic host resolution from selectedHostId.
  if (speakerName && id !== 'selected') {
    if (!name.includes('clara') && !name.includes('uwe') && !name.includes('host')) {
      return speakerName
    }
  }

  if (id === 'ambassador') return 'Botschafter Regelreich'
  if (id === 'host' && selectedHostId === 'clara') return 'Klara Blick'
  if (id === 'host' && selectedHostId === 'uwe') return 'Uwe R. Blick'
  if (id === 'selected' && selectedHostId === 'clara') return 'Klara Blick'
  if (id === 'selected' && selectedHostId === 'uwe') return 'Uwe R. Blick'
  if (id === 'clara' || name.includes('clara')) return 'Klara Blick'
  if (id === 'uwe' || name.includes('uwe')) return 'Uwe R. Blick'
  return speakerName || 'Host'
}

function renderMessageText(text) {
  const normalized = String(text ?? '').replace(/\r\n?/g, '\n')
  const paragraphs = normalized.split(/\n{2,}/)

  return paragraphs.map((paragraph, index) => (
    <p key={`p-${index}`} className="chat-message__paragraph" style={{ whiteSpace: 'pre-wrap' }}>
      {paragraph}
    </p>
  ))
}

export function ChatPanel({ messages = [], options = [], onSelectOption, selectedHostId, selectedAvatarId, title = 'Media Lab Luminara' }) {
  const scrollRef = useRef(null)
  const avatarOptions = options.filter((option) => isAvatarOption(option))
  const textOptions = options.filter((option) => !isAvatarOption(option))

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, options])

  return (
    <section className="chat-panel" aria-label="Konversationsfenster">
      <header className="chat-panel__header">
        <h2 className="chat-panel__title">{title}</h2>
      </header>

      <div className="chat-panel__messages" ref={scrollRef}>
        {messages.map((message) => {
          const hostDisplayName = message.speakerType === 'player'
            ? message.speakerName
            : getHostDisplayName(message.hostId ?? message.characterId, message.speakerName, selectedHostId)

          return (
          <article
            key={message.id}
            className={`chat-message chat-message--${message.speakerType === 'player' ? 'player' : 'host'}`}
          >
            {message.speakerType !== 'player' && (
              <HostAvatar characterId={message.hostId ?? message.characterId} speakerName={hostDisplayName} />
            )}
            <div className="chat-message__bubble">
              {message.speakerName && message.speakerType !== 'player' && (
                <strong className="chat-message__speaker">{hostDisplayName}</strong>
              )}
              {renderMessageText(message.text)}
            </div>
          </article>
          )
        })}
      </div>

      <footer className="chat-panel__options" role="group" aria-label="Antwortoptionen">
        {!!avatarOptions.length && (
          <div className="chat-panel__avatar-options" role="group" aria-label="Avatar-Auswahl">
            {avatarOptions.map((option, index) => {
              const avatarId = option.avatarId || String(option.id || '').toLowerCase()
              const AvatarComponent = getPlayerAvatarComponent(avatarId)
              const isSelected = avatarId === selectedAvatarId

              return (
                <button
                  key={option.id ?? `avatar-${index}`}
                  type="button"
                  className={`chat-panel__avatar-option ${isSelected ? 'chat-panel__avatar-option--selected' : ''}`}
                  onClick={() => onSelectOption?.(index, option)}
                  aria-label={`Avatar ${index + 1} auswählen`}
                  aria-pressed={isSelected}
                >
                  <AvatarComponent className="chat-panel__avatar-image" />
                </button>
              )
            })}
          </div>
        )}

        {textOptions.map((option, index) => (
          <button
            key={option.id ?? index}
            type="button"
            className="chat-panel__option"
            onClick={() => onSelectOption?.(index + avatarOptions.length, option)}
            disabled={Boolean(option.disabled)}
          >
            {option.label}
          </button>
        ))}
      </footer>
    </section>
  )
}
