# CODEMAP

Stand: 2026-03-08
Scope: Struktur-Übersicht (Dateinamen/Pfade), max depth 4, ohne Inhaltsanalyse.

## Legend
- `[ENTRY]` = Entry Points (Startdateien / Main / Game Loop)
- `[CORE]` = Core Systems / Manager / Controller
- `[CONFIG]` = Config / Build / Runtime-Konfiguration
- `[ASSET]` = Assets (Bilder, statische Ressourcen)

## Project Tree (max depth 4)

```text
.
├── docs/
│   ├── AGENTS.md
│   ├── ARCHITECTURE.md
│   ├── CODEMAP.md
│   ├── DECISIONS_LOG.md
│   ├── PDF_NOTES.md
│   ├── PDF_TO_TASKS.md
│   ├── PROJECT_CONTEXT.md
│   ├── README.md
│   ├── RUNBOOK.md
│   └── TASKS_NEXT.md
├── index.html [ENTRY]
├── package.json [CONFIG]
├── package-lock.json [CONFIG]
├── vite.config.js [CONFIG]
├── public/
│   └── backgrounds/ [ASSET]
│       ├── Media Lab.png [ASSET]
│       ├── Willkommen.png [ASSET]
│       ├── avatar-klara.png [ASSET]
│       ├── avatar-uwe.png [ASSET]
│       ├── avatar_boy.png [ASSET]
│       ├── avatar_dog.png [ASSET]
│       ├── avatar_girl.png [ASSET]
│       ├── default-scene.png [ASSET]
│       ├── keller-klara.png [ASSET]
│       ├── keller-monitor.png [ASSET]
│       ├── keller-scene.png [ASSET]
│       ├── keller-uwe.png [ASSET]
│       ├── media-lab.png [ASSET]
│       ├── open-office-scene.svg [ASSET]
│       ├── private-office-scene.svg [ASSET]
│       └── regelreich-panorama.svg [ASSET]
├── server/
│   ├── app.js [CORE]
│   ├── index.js [ENTRY]
│   ├── data/
│   │   └── dialogs.json [CONFIG]
│   └── lib/
│       ├── dialogSeed.js [CORE]
│       ├── dialogStore.js [CORE]
│       └── dialogValidation.js [CORE]
├── src/
│   ├── App.jsx [ENTRY]
│   ├── main.jsx [ENTRY]
│   ├── index.css
│   ├── api/
│   │   └── dialogApi.js [CORE]
│   ├── hooks/
│   │   └── useScene.js [CORE]
│   ├── data/
│   │   ├── constants.js [CONFIG]
│   │   ├── scenes.js [CONFIG]
│   │   └── conversations/
│   │       └── part1.js [CONFIG]
│   ├── pages/
│   │   ├── AdminDialogScreen.jsx [CORE]
│   │   ├── AvatarSelectionScreen.jsx [ENTRY]
│   │   └── GameScreen.jsx [ENTRY]
│   └── components/
│       ├── chat/
│       │   └── ChatPanel.jsx [CORE]
│       ├── dialogue/
│       │   └── SpeechBubble.jsx
│       ├── interaction/
│       │   ├── InteractionBox.jsx [CORE]
│       │   └── PlayerInteraction.jsx [CORE]
│       ├── layout/
│       │   ├── GenericAvatar.jsx
│       │   ├── HostAvatar.jsx [CORE]
│       │   ├── PlayerAvatars.jsx
│       │   └── SpeakerPortrait.jsx
│       └── scene/
│           ├── Character.jsx
│           ├── MonitorActivityScene.jsx [CORE]
│           ├── Scene.jsx [CORE]
│           └── SceneBackground.jsx [CORE]
├── avatar_boy.png [ASSET]
├── avatar_dog.png [ASSET]
├── avatar_girl.png [ASSET]
├── default-scene.png [ASSET]
└── keller-scene.png [ASSET]
```

## Entry Points
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/pages/AvatarSelectionScreen.jsx`
- `src/pages/GameScreen.jsx`
- `server/index.js`

## Core Systems / Manager / Controller
- Frontend flow & orchestration:
  - `src/pages/GameScreen.jsx`
  - `src/pages/AdminDialogScreen.jsx`
  - `src/hooks/useScene.js`
- Frontend runtime components:
  - `src/components/scene/Scene.jsx`
  - `src/components/scene/SceneBackground.jsx`
  - `src/components/scene/MonitorActivityScene.jsx`
  - `src/components/chat/ChatPanel.jsx`
  - `src/components/interaction/InteractionBox.jsx`
  - `src/components/interaction/PlayerInteraction.jsx`
  - `src/components/layout/HostAvatar.jsx`
- Frontend/backend boundary:
  - `src/api/dialogApi.js`
- Backend core:
  - `server/app.js`
  - `server/lib/dialogStore.js`
  - `server/lib/dialogValidation.js`
  - `server/lib/dialogSeed.js`

## Config / Assets
- Config/build/runtime:
  - `package.json`
  - `package-lock.json`
  - `vite.config.js`
  - `src/data/constants.js`
  - `src/data/scenes.js`
  - `src/data/conversations/part1.js`
  - `server/data/dialogs.json`
- Assets:
  - `public/backgrounds/*`
  - root PNG assets (`avatar_*.png`, `default-scene.png`, `keller-scene.png`)

## Top 15 files to read for architecture understanding
1. `src/main.jsx`
2. `src/App.jsx`
3. `src/pages/GameScreen.jsx`
4. `src/pages/AdminDialogScreen.jsx`
5. `src/pages/AvatarSelectionScreen.jsx`
6. `src/components/scene/Scene.jsx`
7. `src/components/chat/ChatPanel.jsx`
8. `src/components/interaction/PlayerInteraction.jsx`
9. `src/hooks/useScene.js`
10. `src/api/dialogApi.js`
11. `src/data/scenes.js`
12. `src/data/constants.js`
13. `server/index.js`
14. `server/app.js`
15. `server/lib/dialogStore.js`
