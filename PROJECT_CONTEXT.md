# Project Context

## Purpose
Regelreich is a dialogue-driven educational game (React + Vite frontend, Node/Express backend) about identifying manipulation strategies in fictional social discourse.

## Current Product State
- Two app modes in one UI: `Spiel` and `Admin`.
- Gameplay runs scene-by-scene (`Teil 0..5`) with chat-style host conversation and player choices.
- Admin manages per-scene dialogue steps and branch logic.
- Backend is local JSON-backed, with automatic seeding if data is missing/empty.

## Core User Flows
1. Player picks avatar in scene 0.
2. In scene 1, player picks host (Clara/Uwe), persisted in localStorage.
3. Scenes 1..5 run as step-based dialogues with branching via `nextStep`/`nextPart`.
4. Admin can switch scenes, edit steps/messages/options, inspect flow graph.

## Data Model (runtime)
- Scene contains ordered `steps`.
- Step contains:
  - `stepIndex`
  - `type` (`intro|example|activity|summary|transition|dialog`)
  - `speechBubbles[]` with `hostId`, `text`, optional `showOnOptionId`
  - `options[]` with `id`, `label`, optional `nextStep`, optional `nextPart`

## Key Invariants
- `sceneId` is 0..5 only.
- `stepIndex` unique per scene.
- `nextStep` must exist in same scene.
- `nextPart` must reference existing scene.
- `hostId` must be `selected|clara|uwe`.
- If a next-step has conditional messages (`showOnOptionId`), only matching message(s) should render.

## Known Operational Dependency
Admin appears empty if backend is down. Start both via `npm run dev:full`.
