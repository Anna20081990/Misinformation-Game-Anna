import { useLayoutEffect, useRef, useState } from 'react'
import { HostAvatar } from '../layout/HostAvatar.jsx'
import { getPlayerAvatarComponent } from '../layout/PlayerAvatars.jsx'

function isAvatarOption(option) {
  const id = String(option?.id || '').toLowerCase()
  return (
    option?.kind === 'avatar' ||
    id === 'avatar1' ||
    id === 'avatar2' ||
    id === 'avatar3'
  )
}

function getHostDisplayName(hostId, speakerName, selectedHostId) {
  const normalizedSpeakerName = String(speakerName || '')
    .replace(/PÃ¶r/g, 'P\u00f6r')
    .replace(/P�r/g, 'P\u00f6r')
  const id = String(hostId || '').toLowerCase()
  const name = normalizedSpeakerName.toLowerCase()

  // If a specific non-host speaker label is provided (e.g. "Botschafter Regelreich"),
  // prefer it over dynamic host resolution from selectedHostId.
  if (normalizedSpeakerName && id !== 'selected') {
    if (
      !name.includes('clara') &&
      !name.includes('uwe') &&
      !name.includes('host')
    ) {
      return normalizedSpeakerName
    }
  }

  if (id === 'ambassador') return 'Botschafter Regelreich'
  if (id === 'conni' || name.includes('conni')) return 'Conni Plex'
  if (id === 'konsti' || name.includes('konsti')) return 'Konsti Los'
  if (id === 'lee' || name.includes('lee')) return 'Lee Ott'
  if (id === 'emma' || name.includes('emma')) return 'Conni Plex'
  if (id === 'konrad' || name.includes('konrad')) return 'Konsti Los'
  if (id === 'didi' || name.includes('didi')) return 'Lee Ott'
  if (id === 'host' && selectedHostId === 'clara') return 'Klara Blick'
  if (id === 'host' && selectedHostId === 'uwe') return 'Uwe-R. Blick'
  if (id === 'selected' && selectedHostId === 'clara') return 'Klara Blick'
  if (id === 'selected' && selectedHostId === 'uwe') return 'Uwe-R. Blick'
  if (id === 'clara' || name.includes('clara')) return 'Klara Blick'
  if (id === 'uwe' || name.includes('uwe')) return 'Uwe-R. Blick'
  return normalizedSpeakerName || 'Host'
}

function getImageMaxWidth(message) {
  return message.imageScale
    ? `${Math.max(1, Math.min(100, message.imageScale * 100))}%`
    : '100%'
}

export function renderMessageParagraphs(
  text,
  { className = 'chat-message__paragraph', style } = {}
) {
  const normalized = String(text ?? '').replace(/\r\n?/g, '\n')
  const paragraphs = normalized.split(/\n\s*\n+/)

  return paragraphs.map((paragraph, index) => (
    <p
      key={`p-${index}`}
      className={className}
      style={
        style ?? {
          whiteSpace: 'pre-wrap',
          margin: index === 0 ? 0 : '0.8em 0 0 0',
        }
      }
    >
      {paragraph}
    </p>
  ))
}

export function ChatPanel({
  messages = [],
  options = [],
  onSelectOption,
  selectedHostId,
  selectedAvatarId,
  title = 'Media Lab Luminara',
}) {
  const scrollRef = useRef(null)
  const [scrollbarMetrics, setScrollbarMetrics] = useState({
    isVisible: false,
    thumbHeight: 0,
    thumbTop: 0,
  })
  const previousSnapshotRef = useRef({
    firstMessageId: null,
    lastMessageId: null,
    length: 0,
  })
  const activeScrollAnchorIdRef = useRef(null)
  const avatarOptions = options.filter((option) => isAvatarOption(option))
  const textOptions = options.filter((option) => !isAvatarOption(option))

  function updateScrollbarMetrics() {
    const container = scrollRef.current
    if (!container) return

    const scrollable = container.scrollHeight > container.clientHeight + 1
    if (!scrollable) {
      setScrollbarMetrics((prev) =>
        prev.isVisible
          ? { isVisible: false, thumbHeight: 0, thumbTop: 0 }
          : prev
      )
      return
    }

    const thumbHeight = Math.max(
      12,
      (container.clientHeight / container.scrollHeight) * 100
    )
    const maxScrollTop = container.scrollHeight - container.clientHeight
    const scrollProgress = maxScrollTop > 0 ? container.scrollTop / maxScrollTop : 0
    const thumbTop = scrollProgress * (100 - thumbHeight)

    setScrollbarMetrics({
      isVisible: true,
      thumbHeight,
      thumbTop,
    })
  }

  function scrollToMessageTop(container, messageId) {
    if (!container || messageId == null) return
    const targetId = String(messageId)
    const firstNewMessage = Array.from(container.children).find(
      (element) => element?.dataset?.messageId === targetId
    )
    if (!firstNewMessage) return
    container.scrollTop = Math.max(0, firstNewMessage.offsetTop - 16)
  }

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const previous = previousSnapshotRef.current
    const firstMessageId = messages[0]?.id ?? null
    const lastMessageId = messages[messages.length - 1]?.id ?? null
    const hasOverflow = container.scrollHeight > container.clientHeight
    const startsNewThread =
      messages.length === 0 ||
      previous.length === 0 ||
      messages.length < previous.length ||
      firstMessageId !== previous.firstMessageId

    if (startsNewThread) {
      container.scrollTop = 0
    } else {
      const appendedMessage =
        messages.length > previous.length && lastMessageId !== previous.lastMessageId
      const firstAppendedMessage = messages[previous.length]
      const previousLastMessage = messages[previous.length - 1]
      const firstAppendedMessageId =
        firstAppendedMessage?.speakerType !== 'player' &&
        previousLastMessage?.speakerType === 'player'
          ? previousLastMessage?.id ?? null
          : firstAppendedMessage?.id ?? null

      if (appendedMessage && hasOverflow) {
        activeScrollAnchorIdRef.current = firstAppendedMessageId
        scrollToMessageTop(container, firstAppendedMessageId)
      }
    }

    updateScrollbarMetrics()

    previousSnapshotRef.current = {
      firstMessageId,
      lastMessageId,
      length: messages.length,
    }
  }, [messages, options])

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return undefined

    updateScrollbarMetrics()
    if (typeof ResizeObserver === 'undefined') return undefined

    const resizeObserver = new ResizeObserver(updateScrollbarMetrics)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [])

  function handleMessageImageLoad() {
    const container = scrollRef.current
    const activeAnchorId = activeScrollAnchorIdRef.current
    if (!container || activeAnchorId == null) return
    scrollToMessageTop(container, activeAnchorId)
    updateScrollbarMetrics()
  }

  return (
    <section className="chat-panel" aria-label="Konversationsfenster">
      <header className="chat-panel__header">
        <h2 className="chat-panel__title">{title}</h2>
      </header>

      <div
        className="chat-panel__messages"
        ref={scrollRef}
        onScroll={updateScrollbarMetrics}
      >
        {messages.map((message) => {
          const isBadgeImage = message.presentation === 'badge'
          const isJuniorBadge = String(message.imageSrc || '').includes(
            'badge-junior-analyst-v2.png'
          )
          const isImageOnlyMessage = Boolean(
            message.imageSrc && !message.text && !message.speakerName
          )
          const hostDisplayName =
            message.speakerType === 'player'
              ? message.speakerName
              : getHostDisplayName(
                  message.hostId ?? message.characterId,
                  message.speakerName,
                  selectedHostId
                )

          const isRegelreich = true
          
          return (
            <article
              key={message.id}
              data-message-id={message.id}
              className={`chat-message chat-message--${message.speakerType === 'player' ? 'player' : 'host'} ${isBadgeImage ? 'chat-message--badge-only' : ''}`}
            >
              {message.speakerType !== 'player' && !isBadgeImage && (
                <HostAvatar
                  characterId={message.hostId ?? message.characterId}
                  speakerName={hostDisplayName}
                />
              )}
              
              <div className={isRegelreich ? 'speech-bubble-wrapper' : 'chat-message__content'}>
                {message.speakerName &&
                  message.speakerType !== 'player' &&
                  !isBadgeImage &&
                  !message.imageSrc && (
                  <strong className="chat-message__speaker">
                    {hostDisplayName}
                  </strong>
                )}
                
                <div
                  className={`${isRegelreich ? 'speech-bubble' : 'chat-message__bubble'} ${isImageOnlyMessage ? 'chat-message__bubble--image-only' : ''} ${isBadgeImage ? 'chat-message__bubble--badge-only' : ''} ${isRegelreich && message.speakerType === 'player' && message.bubbleColor ? message.bubbleColor : ''}`}
                >
                  {!!message.imageSrc && (
                    isJuniorBadge ? (
                    <span
                      style={{
                        position: 'relative',
                        display: 'block',
                        width: getImageMaxWidth(message),
                        margin: '0 auto',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: '17%',
                          top: '9%',
                          width: '66%',
                          height: '52%',
                          background: '#ffffff',
                          borderRadius: '45% 45% 34% 34%',
                          zIndex: 0,
                        }}
                      />
                      <img
                        src={message.imageSrc}
                        alt={message.imageAlt || ''}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                        }}
                        onLoad={handleMessageImageLoad}
                      />
                    </span>
                  ) : (
                    <img
                      src={message.imageSrc}
                      alt={message.imageAlt || ''}
                      style={{
                        display: 'block',
                        margin: '0 auto',
                        maxWidth: getImageMaxWidth(message),
                        height: 'auto',
                      }}
                      onLoad={handleMessageImageLoad}
                    />
                  )
                )}
                {message.text ? renderMessageParagraphs(message.text) : null}
                </div>
              </div>
            </article>
          )
        })}

        <footer
          className="chat-panel__options"
          role="group"
          aria-label="Antwortoptionen"
        >
          {!!avatarOptions.length && (
            <div
              className="chat-panel__avatar-options"
              role="group"
              aria-label="Avatar-Auswahl"
            >
              {avatarOptions.map((option, index) => {
                const avatarId =
                  option.avatarId || String(option.id || '').toLowerCase()
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

          {textOptions.map((option, index) => {
            const isRegelreich = true
            const btnClass = isRegelreich 
              ? `btn-dialog-option ${index % 2 === 0 ? 'blue' : 'green'}` 
              : 'chat-panel__option'

            return (
              <button
                key={option.id ?? index}
                type="button"
                className={btnClass}
                onClick={() =>
                  onSelectOption?.(index + avatarOptions.length, option)
                }
                disabled={Boolean(option.disabled)}
              >
                {option.label}
              </button>
            )
          })}
        </footer>
      </div>
      {scrollbarMetrics.isVisible && (
        <div
          className="chat-panel__mobile-scrollbar"
          aria-hidden="true"
          style={{
            '--chat-scrollbar-thumb-height': `${scrollbarMetrics.thumbHeight}%`,
            '--chat-scrollbar-thumb-top': `${scrollbarMetrics.thumbTop}%`,
          }}
        >
          <span className="chat-panel__mobile-scrollbar-thumb" />
        </div>
      )}
    </section>
  )
}
