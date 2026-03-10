# Architecture

Stand: 2026-03-08

## Gesamtaufbau
- Monorepo-artige Struktur mit Frontend (`src/`) und lokalem Backend (`server/`).
- Frontend orchestriert Navigation/Rendering; Backend liefert persistente Dialogzustände und validiert Branch-Logik.

## Frontend-Schichten
- Entry: `index.html`, `src/main.jsx`, `src/App.jsx`.
- App-Orchestrierung (`App.jsx`):
  - Moduswechsel Spiel/Admin
  - Teilnavigation + Unterkapitel
  - Host-/Avatar-Session-State
  - Vorladen von Dialogdaten für Navigationslogik
- Spielruntime (`src/pages/GameScreen.jsx`):
  - Lädt Szenendialoge je Teil über API
  - Fallback auf statische Daten für Robustheit
  - Verarbeitet bedingte Host-Nachrichten (`showOnOptionId`)
  - Enthält Aktivitäten-Logik für Teile 2-4 (Sentence-Marking, Choice, Booster, Bucket-Sort)
  - Kapselt Submit-Mapping, Reset-Pfade und Transition-Steuerung über lokale Hilfsfunktionen
  - Übergänge über `nextStep`/`nextPart`, inkl. Chat-Verlaufssynchronisation
- Laufzeit-Rendering (`src/components/chat/ChatPanel.jsx`, `src/components/scene/MonitorActivityScene.jsx`):
  - Teilen sich die Absatzdarstellung für Host-/Player-Nachrichten
- Adminruntime (`src/pages/AdminDialogScreen.jsx`):
  - Szenen- und Step-CRUD
  - Flow-Ansicht pro Step (Kanten auf Step/Teil/Ende)
  - Optionales JSON-Feld für `activityConfig`

## Backend-Schichten
- Entry: `server/index.js` bootet Express-App aus `server/app.js`.
- API-Layer (`server/app.js`):
  - Szenenübersicht, Dialog-CRUD, Flow-Endpunkt, Seed-Endpunkte
  - Fehlerbehandlung + CORS/JSON-Middleware
- Validation-Layer (`server/lib/dialogValidation.js`):
  - Existenzprüfungen, Referenzprüfungen, Payload-Normalisierung, Logik-Validierung
- Persistence-Layer (`server/lib/dialogStore.js`):
  - JSON-Read/Write mit Write-Queue
  - Auto-Erzeugung/Auto-Seed bei fehlender oder leerer Datenbasis
  - Sicherstellung aller `sceneId` aus `SCENES`
- Seed-Layer (`server/lib/dialogSeed.js`):
  - Generiert kanonische Startdialoge

## API-Vertrag (kompakt)
- `GET /api/scenes`
- `GET /api/scenes/:sceneId/dialogs`
- `GET /api/scenes/:sceneId/dialogs/:stepIndex`
- `GET /api/scenes/:sceneId/flow`
- `POST /api/scenes/:sceneId/dialogs`
- `PUT /api/scenes/:sceneId/dialogs/:stepIndex`
- `DELETE /api/scenes/:sceneId/dialogs/:stepIndex`
- `POST /api/dialogs/seed`, `POST /api/scenes/:sceneId/dialogs/seed`
