# Next Tasks

## 1) Admin UX: backend connectivity banner
- Task: Show clear “Backend offline” state in Admin when API fails.
- Acceptance:
  - Visible banner on request failure.
  - Hide banner after successful reload.

## 2) Gameplay conditional logic hardening
- Task: Add tests for `showOnOptionId` rendering behavior.
- Acceptance:
  - For conditional bubbles, only matching bubble renders.
  - For no match, fallback behavior defined and tested.

## 3) Seed lifecycle cleanup
- Task: Decide if seed endpoints remain or become dev-only.
- Acceptance:
  - Explicit policy documented.
  - If dev-only, guarded by env flag.

## 4) Admin branch editing safety
- Task: Prevent invalid transitions in UI before submit.
- Acceptance:
  - Dropdown/select for `nextStep` from existing steps.
  - Inline warnings for dead-end/dangling transitions.

## 5) Data migration versioning
- Task: Add schema version in `dialogs.json`.
- Acceptance:
  - Version key present.
  - Startup migration path documented.

## Bugs/Repro to watch
- Admin appears empty if backend not running.
  - Repro: run only frontend and open Admin.
  - Expected: explicit offline warning (currently missing).
