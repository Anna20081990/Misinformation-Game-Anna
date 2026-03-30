with open('src/index.css', 'r') as f:
    css = f.read()

# Replace the new universal chat layout block completely.
start_marker = "/* -----------------------------------------------\n   Universal Chat Layout (based on Szene 0 Mobile)\n   ----------------------------------------------- */"
start_idx = css.find(start_marker)
if start_idx != -1:
    css = css[:start_idx]

# We append the new block with proper media queries.
new_css = """
/* -----------------------------------------------
   Universal Chat Layout (Desktop right side, Mobile 2/3 bottom)
   ----------------------------------------------- */
.scene {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: calc(100vh - 3rem);
  min-height: calc(100dvh - 3rem);
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
  position: relative;
}

.scene .scene-background {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
  flex: none !important;
  background-size: cover !important;
  background-position: center top !important;
  z-index: 0;
}

/* Mobile Default Layout (Chatbox 2/3 bottom) */
.scene__chat-wrap {
  position: absolute !important;
  top: auto !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 66.66svh !important; /* 2/3 of screen */
  margin: 0 !important;
  padding: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: transparent !important;
  -webkit-overflow-scrolling: touch;
}

.scene__chat-wrap .chat-panel {
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  background: rgba(13, 18, 69, 0.50) !important; /* 50% transparency */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px 24px 0 0;
  border: none;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  color: var(--rr-text-white, #fff);
  overflow: hidden;
}

/* Header visible on desktop, maybe hidden on mobile? The image shows "Regelreich" on desktop. */
.scene__chat-wrap .chat-panel__header {
  display: none;
  background: transparent;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 1rem 1.5rem;
}

.scene__chat-wrap .chat-panel__title {
  color: white;
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.scene__chat-wrap .chat-panel__messages {
  padding: 1.5rem 1.5rem 1rem;
  gap: 1.5rem;
  overflow-y: auto;
}

.scene__chat-wrap .chat-message {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  align-items: flex-start;
  margin-bottom: 0;
  position: relative;
}

.scene__chat-wrap .chat-message--player {
  justify-content: flex-end;
}

.scene__chat-wrap .speech-bubble-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.scene__chat-wrap .chat-message--player .speech-bubble-wrapper {
  flex: 0 1 85%;
  align-items: flex-end;
}

.scene__chat-wrap .chat-message__speaker {
  position: static;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 400;
  margin-bottom: 0.3rem;
  padding-left: 0.5rem;
}

.scene__chat-wrap .chat-message__avatar-wrap {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #8FA3D1;
  background: #f4f4f4;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene__chat-wrap .chat-message__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene__chat-wrap .speech-bubble {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: none;
  box-shadow: none;
  margin-top: 2px;
}

.scene__chat-wrap .speech-bubble::after,
.scene__chat-wrap .speech-bubble.blue::after,
.scene__chat-wrap .speech-bubble.green::after {
  display: none;
}

.scene__chat-wrap .chat-message__paragraph {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 400;
  color: #111;
  margin: 0;
  line-height: 1.5;
}

.scene__chat-wrap .chat-panel__options {
  background: transparent;
  border-top: none;
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* Desktop Layout (Right side floating) */
@media (min-width: 769px) {
  .scene__chat-wrap {
    top: 5vh !important;
    right: 5vw !important;
    bottom: 5vh !important;
    left: auto !important;
    width: min(45vw, 550px) !important;
    height: auto !important;
    border-radius: 24px;
  }
  
  .scene__chat-wrap .chat-panel {
    border-radius: 24px;
  }
  
  .scene__chat-wrap .chat-panel__header {
    display: block;
  }
}
"""

with open('src/index.css', 'w') as f:
    f.write(css.rstrip() + '\n\n' + new_css)
