import re

with open('src/index.css', 'r') as f:
    css = f.read()

# 1. Emma Poer 2.3 sentence post styling
old_emma_css = """/* Final override for Emma Poer sentence post styling (Part 2.3). */
.monitor-select__paragraph--post .monitor-select__sentence,
.monitor-select__paragraph--post .monitor-select__sentence:hover,
.monitor-select__paragraph--post .monitor-select__sentence--selected,
.monitor-select__paragraph--post .monitor-select__sentence--selected:hover {
  background: #eceff1 !important;
  border-color: #fff !important;
  color: #000 !important;
  font-weight: 400;
  text-shadow: none !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.monitor-select__paragraph--post .monitor-select__sentence:hover,
.monitor-select__paragraph--post .monitor-select__sentence--selected {
  font-weight: 700 !important;
}

.monitor-select__paragraph--post .monitor-select__sentence--selected:hover {
  font-weight: 400 !important;
}"""

new_emma_css = """/* Final override for Emma Poer sentence post styling (Part 2.3). */
.monitor-select__paragraph--post .monitor-select__sentence,
.monitor-select__paragraph--post .monitor-select__sentence:hover {
  background: #eceff1 !important;
  border-color: #fff !important;
  color: #000 !important;
  font-weight: 400;
  text-shadow: none !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.monitor-select__paragraph--post .monitor-select__sentence:hover {
  font-weight: 700 !important;
}

.monitor-select__paragraph--post .monitor-select__sentence--selected,
.monitor-select__paragraph--post .monitor-select__sentence--selected:hover {
  background: #4A6583 !important; /* dunkleres grau/blau */
  border-color: #38516d !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
  text-shadow: none !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}"""

if old_emma_css in css:
    css = css.replace(old_emma_css, new_emma_css)
    print("Replaced Emma Poer CSS successfully.")
else:
    print("Could not find Emma Poer CSS.")


# 2. Activity Screens Background on Mobile (80% opacity/transparency)
# Find the Mobile Chatbox section or add the rule for mobile activity panel.
# We already have:
# @media (max-width: 768px) {
#   .scene--activity .scene__chat-wrap {
#     top: 20svh !important;
#   }
# }
mobile_activity_css_old = """@media (max-width: 768px) {
  .scene--activity .scene__chat-wrap {
    top: 20svh !important;
  }
}"""

mobile_activity_css_new = """@media (max-width: 768px) {
  .scene--activity .scene__chat-wrap {
    top: 20svh !important;
  }
  .scene--activity .scene__chat-wrap .chat-panel {
    background: rgba(13, 18, 69, 0.80) !important;
  }
}"""

if mobile_activity_css_old in css:
    css = css.replace(mobile_activity_css_old, mobile_activity_css_new)
    print("Replaced mobile activity chat panel background successfully.")
else:
    print("Could not find mobile activity css.")


# 3. Center Activity Dialogbox on Desktop
# Look for Desktop Layout section
desktop_css_marker = "  .scene__chat-wrap .chat-panel__header {\n    display: block;\n  }\n}"

desktop_css_new = """  .scene__chat-wrap .chat-panel__header {
    display: block;
  }
  
  /* Center Activity Screens on Desktop */
  .scene--activity .scene__chat-wrap {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}"""

if desktop_css_marker in css:
    css = css.replace(desktop_css_marker, desktop_css_new)
    print("Added desktop centering for activity screens successfully.")
else:
    print("Could not find desktop css marker.")


with open('src/index.css', 'w') as f:
    f.write(css)
