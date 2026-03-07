import { useEffect, useRef } from 'react'
import { SceneBackground } from './SceneBackground.jsx'
import { HostAvatar } from '../layout/HostAvatar.jsx'

export function MonitorActivityScene({ messages = [], options = [], onSelectOption }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, options])

  return (
    <div className="scene">
      <SceneBackground
        backgroundImage={null}
        backgroundPlaceholder="radial-gradient(circle at 50% 20%, #213a56 0%, #0d1a2a 55%, #070f18 100%)"
      />

      <div className="monitor-scene">
        <div className="monitor-scene__bezel">
          <div className="monitor-scene__screen">
            <header className="monitor-scene__header">
              <h2 className="monitor-scene__title">Stand-PC Monitor</h2>
            </header>

            <div className="monitor-scene__messages" ref={scrollRef}>
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`monitor-message monitor-message--${message.speakerType === 'player' ? 'player' : 'host'}`}
                >
                  {message.speakerType !== 'player' && (
                    <HostAvatar characterId={message.hostId ?? message.characterId} speakerName={message.speakerName} />
                  )}
                  <div className="monitor-message__bubble">
                    {message.speakerType !== 'player' && (
                      <strong className="monitor-message__speaker">{message.speakerName || 'Host'}</strong>
                    )}
                    <p>{message.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <footer className="monitor-scene__options" role="group" aria-label="Aktivitätsoptionen">
              {options.map((option, index) => (
                <button
                  key={option.id ?? index}
                  type="button"
                  className="monitor-scene__option"
                  onClick={() => onSelectOption?.(index, option)}
                  disabled={Boolean(option.disabled)}
                >
                  {option.label}
                </button>
              ))}
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
