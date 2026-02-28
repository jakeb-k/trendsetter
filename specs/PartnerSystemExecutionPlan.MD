# Partner System Execution Plan

## Scope baseline
- Sources: `trendsetter/specs/PartnerSystem.MD`, `trendsetter/specs/PartnerSystemFrontend.MD`, `trendsetter-core/specs/PartnerSystemBackend.MD`.
- Repos: mobile app in `trendsetter`, API in `trendsetter-core`.
- v1 boundaries: one partner per goal, signals-only visibility, invite email only, in-app alerts, silent unlink/removal, no offline logging.

## Phase 1: Backend data model + invite lifecycle
- Add partner domain tables in `trendsetter-core/database/migrations`:
  - partnership record per goal (active/paused/removed state + settings).
  - invite records (email, token hash, status pending/accepted/declined/expired/canceled, expiry, role tone).
  - alert/notification records (type, dedupe/rate-limit metadata, read state, deep-link target).
  - optional encouragement records (preset-only, no free text).
- Add Eloquent models + relations in `trendsetter-core/app/Models` and wire relations from `Goal` and `User`.
- Add invite mailer + templates in `trendsetter-core/app/Mail`.
- Add API routes + controller actions in `trendsetter-core/routes/api.php` and `trendsetter-core/app/Http/Controllers` for:
  - create invite, list pending invites, resend invite, cancel invite.
  - fetch invite metadata by token.
  - accept/decline invite (accept requires auth).
- Enforce rules: no self-invite, one active partner per goal, no duplicate active link, invite expiry and single-use claim.
- Tests: feature coverage in `trendsetter-core/tests/Feature/Api` for invite lifecycle and permissions.

## Phase 2: Safe partner snapshot + lifecycle controls
- Build a snapshot service in `trendsetter-core/app/Services` returning only approved signals:
  - streak, last log time, inactivity days, weekly consistency, rolling consistency.
  - points earned vs expected-by-today, pace status and delta, next scheduled event, momentum trend.
- Add partner-facing read endpoints and owner/partner lifecycle endpoints:
  - pause/unpause alerts per goal.
  - unlink/remove partnership (silent immediate revoke).
- Ensure access-control denies raw logs, journal text, feelings, reasons, AI plan text, and all write operations.
- Handle goal deletion via cascade + silent cleanup.
- Tests: snapshot redaction and lifecycle behavior.

## Phase 3: Hybrid alert evaluation + in-app notifications
- Implement alert evaluator service in `trendsetter-core/app/Services` for:
  - streak break, consecutive misses, behind pace threshold, inactivity threshold.
  - grace period + 24h per-goal rate limit + duplicate suppression.
- Trigger evaluation on:
  - successful log submissions (`EventController@storeEventFeedback`).
  - user check-in endpoints (`GoalController@getGoals` and relevant reads).
- Add periodic evaluation:
  - console command in `trendsetter-core/app/Console/Commands`.
  - scheduler registration in `trendsetter-core/routes/console.php`.
- Persist observability fields for generated/delivered alerts and evaluator reason.
- Add in-app notifications API (list, mark-read, encouragement tap).

## Phase 4: Frontend partner flows + offline hard-block
- Add partner API client in `trendsetter/api` and types in `trendsetter/types`.
- Add UI routes/screens in `trendsetter/app`:
  - invite creation from `app/(tabs)/goals/[id].tsx`.
  - partners list section (active/paused partnerships).
  - invite acceptance screen via deep link.
  - partner read-only goal snapshot screen.
  - notifications inbox/banner with one-tap encouragement presets.
- Add controls for pause/unlink for both users.
- Add explicit offline hard-block for logging in `trendsetter/components/events/EventFeedbackForm.tsx` and related logging flows:
  - show exact failure state and avoid optimistic “saved” UI on network failure.

## Phase 5: Integration, QA, and rollout safeguards
- API contract and payload consistency checks between app and backend.
- End-to-end scenario validation:
  - invite send/accept/decline/expire.
  - paused state suppresses alerts while keeping view access.
  - silent unlink + goal deletion cleanup.
  - scheduled evaluator catches users who stop opening app.
- Add docs for env/config defaults (expiry window, thresholds, grace period, rate limits).

## Kickoff order (now)
1. Implement Phase 1 backend schema + invite APIs + tests.
2. Implement Phase 2 snapshot and lifecycle controls.
3. Implement Phase 3 alert engine and notification APIs.
4. Integrate Phase 4 frontend flows.
