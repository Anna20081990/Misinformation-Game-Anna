import { useEffect, useRef } from 'react'
import { HostAvatar } from '../layout/HostAvatar.jsx'

function getHostDisplayName(hostId, speakerName, selectedHostId) {
  const id = String(hostId || '').toLowerCase()
  const name = String(speakerName || '').toLowerCase()

  if (id === 'host' && selectedHostId === 'clara') return 'Clara Blick'
  if (id === 'host' && selectedHostId === 'uwe') return 'Uwe R. Blick'
  if (id === 'selected' && selectedHostId === 'clara') return 'Clara Blick'
  if (id === 'selected' && selectedHostId === 'uwe') return 'Uwe R. Blick'
  if (id === 'clara' || name.includes('clara')) return 'Clara Blick'
  if (id === 'uwe' || name.includes('uwe')) return 'Uwe R. Blick'
  return speakerName || 'Host'
}

export function ChatPanel({ messages = [], options = [], onSelectOption, selectedHostId }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, options])

  return (
    <section className="chat-panel" aria-label="Konversationsfenster">
      <header className="chat-panel__header">
        <h2 className="chat-panel__title">Media Lab Luminara</h2>
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
              <p>{message.text}</p>
            </div>
          </article>
          )
        })}
      </div>

      <footer className="chat-panel__options" role="group" aria-label="Antwortoptionen">
        {options.map((option, index) => (
          <button
            key={option.id ?? index}
            type="button"
            className="chat-panel__option"
            onClick={() => onSelectOption?.(index, option)}
          >
            {option.label}
          </button>
        ))}
      </footer>
    </section>
  )
}
