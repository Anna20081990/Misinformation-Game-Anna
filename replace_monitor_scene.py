import re

with open('src/components/scene/MonitorActivityScene.jsx', 'r') as f:
    content = f.read()

# Replace wrapper classes
content = content.replace('<div className={`monitor-scene monitor-scene--${variant}`}>', '<div className="scene__chat-wrap">')
content = content.replace('<div className="monitor-scene__bezel">', '')
content = content.replace('<div className="monitor-scene__screen">', '<div className="chat-panel">')
content = content.replace('<header className="monitor-scene__header">', '<header className="chat-panel__header">')
content = content.replace('<h2 className="monitor-scene__title">', '<h2 className="chat-panel__title">')
content = content.replace('<div className="monitor-scene__messages" ref={scrollRef}>', '<div className="chat-panel__messages" ref={scrollRef}>')

# We removed <div className="monitor-scene__bezel">, so we need to remove one closing </div> at the end.
# In the footer part:
footer_search = """            <footer
              className="monitor-scene__options"
              role="group"
              aria-label="Aktivitätsoptionen"
            >
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
      </div>"""

footer_replace = """            <footer
              className="chat-panel__options"
              role="group"
              aria-label="Aktivitätsoptionen"
            >
              {actionOptions.map((option, index) => (
                <button
                  key={option.id ?? index}
                  type="button"
                  className={`btn-dialog-option ${index % 2 === 0 ? 'blue' : 'green'}`}
                  onClick={() => onSelectOption?.(index, option)}
                  disabled={Boolean(option.disabled)}
                >
                  {option.label}
                </button>
              ))}
            </footer>
        </div>
      </div>"""
content = content.replace(footer_search, footer_replace)

# Replace message markup
def replace_messages(text):
    old_msg = """                <article
                  key={message.id}
                  className={`monitor-message monitor-message--${message.speakerType === 'player' ? 'player' : 'host'}`}
                >
                  {message.speakerType !== 'player' && (
                    <HostAvatar
                      characterId={message.hostId ?? message.characterId}
                      speakerName={message.speakerName}
                    />
                  )}
                  <div className="monitor-message__bubble">
                    {message.speakerType !== 'player' && (
                      <strong className="monitor-message__speaker">
                        {message.speakerName || 'Host'}
                      </strong>
                    )}
                    {renderMessageParagraphs(message.text, {
                      className: 'monitor-message__paragraph',
                    })}
                  </div>
                </article>"""
    new_msg = """                <article
                  key={message.id}
                  className={`chat-message chat-message--${message.speakerType === 'player' ? 'player' : 'host'}`}
                >
                  {message.speakerType !== 'player' && (
                    <HostAvatar
                      characterId={message.hostId ?? message.characterId}
                      speakerName={message.speakerName}
                    />
                  )}
                  <div className="speech-bubble-wrapper">
                    {message.speakerType !== 'player' && (
                      <strong className="chat-message__speaker">
                        {message.speakerName || 'Host'}
                      </strong>
                    )}
                    <div className={`speech-bubble ${message.speakerType === 'player' ? 'green' : ''}`}>
                      {renderMessageParagraphs(message.text, {
                        className: 'chat-message__paragraph',
                      })}
                    </div>
                  </div>
                </article>"""
    return text.replace(old_msg, new_msg)

content = replace_messages(content)

with open('src/components/scene/MonitorActivityScene.jsx', 'w') as f:
    f.write(content)
