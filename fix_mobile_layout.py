with open('src/index.css', 'r') as f:
    css = f.read()

# We need to replace the section from /* Universal Chat Layout ... down to .scene__chat-wrap .chat-panel {
start_marker = "/* -----------------------------------------------\n   Universal Chat Layout (Desktop right side, Mobile 2/3 bottom)\n   ----------------------------------------------- */"
end_marker = ".scene__chat-wrap .chat-panel {"

start_idx = css.find(start_marker)
end_idx = css.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    old_section = css[start_idx:end_idx]
    
    new_section = """/* -----------------------------------------------
   Universal Chat Layout (Desktop right side, Mobile Szene 0 Stand davor)
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

/* Mobile Background */
.scene .scene-background {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: auto !important;
  width: 100% !important;
  height: 50svh !important;
  max-height: 50svh !important;
  min-height: 0 !important;
  flex: none !important;
  background-size: cover !important;
  background-position: center top !important;
  z-index: 0;
}

/* Mobile Chatbox */
.scene__chat-wrap {
  position: relative !important;
  top: auto !important;
  bottom: auto !important;
  left: auto !important;
  right: auto !important;
  width: 100% !important;
  height: auto !important;
  /* Ragt 10vh nach oben in das 50svh Bild rein (da background fixed 50svh ist, abzüglich 10vh Overlap = 40svh margin-top) */
  margin: 40svh 0 0 0 !important;
  padding: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: transparent !important;
  -webkit-overflow-scrolling: touch;
  flex: 1 1 auto !important;
}

"""
    new_css = css[:start_idx] + new_section + css[end_idx:]
    
    # We also need to add back the desktop background logic because the mobile background is now fixed/50svh.
    # So we need to put `inset: 0` back for desktop.
    desktop_media_query = "@media (min-width: 769px) {"
    desktop_idx = new_css.find(desktop_media_query)
    if desktop_idx != -1:
        desktop_insert = """
  .scene .scene-background {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-height: none !important;
  }
"""
        # Find the next '{' after the media query, which is the start of the block
        insert_pos = new_css.find('{', desktop_idx) + 1
        new_css = new_css[:insert_pos] + desktop_insert + new_css[insert_pos:]

    with open('src/index.css', 'w') as f:
        f.write(new_css)
    print("Replaced layout successfully.")
else:
    print("Could not find markers.")
