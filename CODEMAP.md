# Codemap

## Entry Points
- Frontend app: `src/main.jsx`
- Frontend shell: `src/App.jsx`
- Backend server boot: `server/index.js`
- Backend app/routes: `server/app.js`

## Gameplay Critical Files
- `src/pages/GameScreen.jsx` (dialogue runtime, branching, conditional host messages)
- `src/components/scene/Scene.jsx` (scene layout + chat panel)
- `src/components/chat/ChatPanel.jsx` (chat rendering)
- `src/components/layout/HostAvatar.jsx` (host visuals)
- `src/data/scenes.js` (static scene metadata)

## Admin Critical Files
- `src/pages/AdminDialogScreen.jsx` (scene switch, CRUD, flow view)
- `src/api/dialogApi.js` (all backend requests)

## Backend Critical Files
- `server/app.js` (route contracts)
- `server/lib/dialogValidation.js` (schema + invariants)
- `server/lib/dialogStore.js` (persistence + auto-seed)
- `server/lib/dialogSeed.js` (generated canonical dialogues)
- `server/data/dialogs.json` (current live dataset)

## Important API Contracts
- Step payload expects:
  - `stepIndex: number`
  - `type: enum`
  - `speechBubbles[]: { hostId, text, showOnOptionId? }`
  - `options[]: { id, label, nextStep?, nextPart? }`

## Build/Run Scripts
- `npm run dev`
- `npm run server`
- `npm run dev:full`
- `npm run build`
