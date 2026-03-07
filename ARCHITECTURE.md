# Architecture

## System Overview
- Frontend: React (Vite), client-side scene engine + admin editor.
- Backend: Express REST API, file persistence in `server/data/dialogs.json`.
- No external DB; local JSON store with write queue and auto-seed strategy.

## Frontend Layers
1. App shell (`src/App.jsx`): mode switch, chapter nav, selected host/avatar state.
2. Gameplay (`src/pages/GameScreen.jsx`):
   - loads scene dialogs from backend
   - fallback to static source if API unavailable
   - handles branch transitions
   - applies conditional message rendering (`showOnOptionId`)
3. Admin (`src/pages/AdminDialogScreen.jsx`): scene selector, step editor, branch flow visualization.

## Backend Layers
1. HTTP layer (`server/app.js`): validation + REST routes.
2. Store (`server/lib/dialogStore.js`):
   - read/write JSON
   - queued writes
   - auto-create/auto-seed if empty
3. Validation (`server/lib/dialogValidation.js`): payload normalization + logic constraints.
4. Seed builder (`server/lib/dialogSeed.js`): canonical generated content for scenes 0..5.

## Main REST API
- `GET /api/scenes`
- `GET /api/scenes/:sceneId/dialogs`
- `GET /api/scenes/:sceneId/dialogs/:stepIndex`
- `GET /api/scenes/:sceneId/flow`
- `POST /api/scenes/:sceneId/dialogs`
- `PUT /api/scenes/:sceneId/dialogs/:stepIndex`
- `DELETE /api/scenes/:sceneId/dialogs/:stepIndex`
- `POST /api/dialogs/seed`
- `POST /api/scenes/:sceneId/dialogs/seed`

## Persistence Strategy
- Source of truth: `server/data/dialogs.json`.
- If missing or all scenes have zero steps, store auto-seeds via `buildSeedDialogs()`.
- Store also ensures all scene IDs (0..5) exist in file.
