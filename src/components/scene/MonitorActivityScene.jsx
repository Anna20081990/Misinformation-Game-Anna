import { useEffect, useRef } from 'react'
import { SceneBackground } from './SceneBackground.jsx'
import { HostAvatar } from '../layout/HostAvatar.jsx'

export function MonitorActivityScene({ messages = [], options = [], onSelectOption, variant = 'monitor' }) {
  const scrollRef = useRef(null)
  const sentenceOptions = options.filter((opt) => opt.kind === 'sentence')
  const choiceOptions = options.filter((opt) => opt.kind === 'choice')
  const actionOptions = options.filter((option) => option.kind !== 'sentence' && option.kind !== 'choice')
  const titleByVariant = {
    monitor: 'Stand-PC Monitor',
    tablet: 'Tablet Interface',
    hologram: 'Hologramm Interface',
  }
  const backgroundByVariant = {
    monitor: 'radial-gradient(circle at 50% 20%, #213a56 0%, #0d1a2a 55%, #070f18 100%)',
    tablet: 'radial-gradient(circle at 40% 20%, #2b3b58 0%, #132035 58%, #0a1421 100%)',
    hologram: 'radial-gradient(circle at 50% 18%, #102b45 0%, #081a2a 52%, #050c14 100%)',
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, options])

  const leadMessage = messages[0] || null
  const trailingMessages = messages.slice(1)

  return (
    <div className="scene">
      <SceneBackground
        backgroundImage={null}
        backgroundPlaceholder={backgroundByVariant[variant] || backgroundByVariant.monitor}
      />

      <div className={`monitor-scene monitor-scene--${variant}`}>
        <div className="monitor-scene__bezel">
          <div className="monitor-scene__screen">
            <header className="monitor-scene__header">
              <h2 className="monitor-scene__title">{titleByVariant[variant] || titleByVariant.monitor}</h2>
            </header>

            <div className="monitor-scene__messages" ref={scrollRef}>
              {leadMessage && (
                <article
                  key={leadMessage.id}
                  className={`monitor-message monitor-message--${leadMessage.speakerType === 'player' ? 'player' : 'host'}`}
                >
                  {leadMessage.speakerType !== 'player' && (
                    <HostAvatar characterId={leadMessage.hostId ?? leadMessage.characterId} speakerName={leadMessage.speakerName} />
                  )}
                  <div className="monitor-message__bubble">
                    {leadMessage.speakerType !== 'player' && (
                      <strong className="monitor-message__speaker">{leadMessage.speakerName || 'Host'}</strong>
                    )}
                    <p>{leadMessage.text}</p>
                  </div>
                </article>
              )}

              {variant === 'monitor-select' && (
                <section className="monitor-select" aria-label="Beitrag analysieren">
                  {!!sentenceOptions.length && (
                    <>
                      <h3 className="monitor-select__title">Beitrag</h3>
                      <p className="monitor-select__paragraph">
                        {sentenceOptions.map((sentence, index) => (
                          <span key={`sentence-wrap-${sentence.id ?? index}`}>
                            <button
                              type="button"
                              className={`monitor-select__sentence ${sentence.selected ? 'monitor-select__sentence--selected' : ''}`}
                              onClick={() => onSelectOption?.(index, sentence)}
                              disabled={Boolean(sentence.disabled)}
                            >
                              {sentence.label}
                            </button>
                            {index < sentenceOptions.length - 1 && <span> </span>}
                          </span>
                        ))}
                      </p>
                    </>
                  )}

                  {!!choiceOptions.length && (
                    <div className="monitor-choice">
                      <h3 className="monitor-select__title">{choiceOptions[0]?.groupTitle || 'Aktivität 2'}</h3>
                      {!!choiceOptions[0]?.topic && <p className="monitor-choice__topic">{choiceOptions[0]?.topic}</p>}
                      <div className="monitor-choice__list">
                        {choiceOptions.map((choice, index) => (
                          <button
                            key={choice.id ?? `choice-${index}`}
                            type="button"
                            className={`monitor-choice__item ${choice.selected ? 'monitor-choice__item--selected' : ''}`}
                            onClick={() => onSelectOption?.(index, choice)}
                            disabled={Boolean(choice.disabled)}
                          >
                            <strong>{choice.label}</strong>
                            <p>{choice.detailText}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {trailingMessages.map((message) => (
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
              {actionOptions.map((option, index) => (
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
