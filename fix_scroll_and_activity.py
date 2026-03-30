with open('src/index.css', 'r') as f:
    css = f.read()

start_marker = "/* Mobile Chatbox */\n.scene__chat-wrap {"
end_marker = "\n.scene__chat-wrap .chat-panel {"

start_idx = css.find(start_marker)
end_idx = css.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_section = """/* Mobile Chatbox */
.scene__chat-wrap {
  position: absolute !important;
  top: 40svh !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: transparent !important;
  -webkit-overflow-scrolling: touch;
}

/* Activity Screens - Chatbox 20% höher (startet bei 20svh) */
.scene--activity .scene__chat-wrap {
  top: 20svh !important;
}"""
    
    new_css = css[:start_idx] + new_section + css[end_idx:]
    with open('src/index.css', 'w') as f:
        f.write(new_css)
    print("Replaced chatbox layout successfully.")
else:
    print("Could not find markers.")
