# Partner System Frontend Execution Plan (v1)

## Objective
Deliver frontend partner flows in `trendsetter` that match the backend already implemented in `trendsetter-core` Phase 1-3.

## Dependencies (Already Available)
- Backend invite lifecycle APIs
- Backend partnership + snapshot APIs
- Backend notifications + encouragement APIs
- Scheduled evaluator + suppression/rate-limit behavior

## Phase FE-0: API Contracts and Domain Types
### Scope
- Define partner domain API clients and types for:
  - invites
  - partnerships
  - snapshots
  - partner notifications
  - encouragement actions

### Deliverables
- Typed request/response models.
- Normalizers for nullable fields (`deep_link`, `read_at`, missing partnership).
- Error mapper for `403/404/409/422/429/503`.

### Exit Criteria
- All partner endpoints callable via typed API layer.

## Phase FE-1: Invite Lifecycle UI
### Scope
- Goal detail invite creation.
- Invite list management (resend/cancel).
- Public token resolve + respond views.

### Deliverables
- Invite composer component.
- Pending invites section.
- Public invite screen with accept/decline.
- Cooldown/429 UX for resend with retry timer copy.

### Exit Criteria
- User can invite, resend, cancel, and token responder can accept/decline end-to-end.

## Phase FE-2: Partnerships List + Snapshot Detail
### Scope
- Partnerships index.
- Partnership snapshot detail (read-only, signals-only).
- Deep link routing into detail.

### Deliverables
- `PartnershipsListScreen`.
- `PartnershipSnapshotScreen`.
- Shared snapshot metric cards/formatters.
- Guardrails against private field rendering.

### Exit Criteria
- Active and paused partnerships are visible and snapshot detail is stable.

## Phase FE-3: Lifecycle Controls
### Scope
- `notify_on_alerts` toggle.
- pause/unpause.
- unlink with confirmation.

### Deliverables
- Control panel on partnership detail.
- Optimistic update with rollback on API failure.
- Redirect handling when partnership is no longer accessible.

### Exit Criteria
- All lifecycle actions work and update list/detail state consistently.

## Phase FE-4: Notifications Inbox + Encouragement
### Scope
- Inbox list + pagination.
- unread badge.
- mark read / read all / clear read.
- one-tap preset encouragement.

### Deliverables
- `PartnerNotificationsScreen`.
- Notification item components by type (`partner_alert`, `partner_encouragement`).
- Encouragement action component with disable-after-send behavior.

### Exit Criteria
- Inbox lifecycle works and encouragement enforces one-time semantics in UI.

## Phase FE-5: Owner Feedback Status Integration
### Scope
- Surface `partner_alert` result from event feedback submit response:
  - queued
  - suppressed (+ message)
  - failed (+ message)

### Deliverables
- Post-submit status banner/toast component.
- State hooks in event feedback flow.

### Exit Criteria
- Owner gets clear feedback when partner alerting was queued/suppressed/failed.

## Phase FE-6: Hardening, QA, and Rollout
### Scope
- Full scenario QA and regression suite.
- Offline hard-fail validation for log submission.
- Edge-case navigation handling.

### Test Matrix (Frontend)
- Invite create/resend/cancel happy + error paths.
- Resolve/respond token flows for pending/expired/used.
- Snapshot redaction.
- Pause/unpause/unlink from both roles.
- Notifications list/read/read-all/clear-read.
- Encouragement one-time behavior and invalid preset handling.
- Missing partnership deep-link redirect behavior.

### Exit Criteria
- Signoff across product + backend + QA.

## Recommended Build Order
1. FE-0 contracts and types.
2. FE-1 invite lifecycle.
3. FE-2 list + snapshot.
4. FE-3 lifecycle controls.
5. FE-4 notifications + encouragement.
6. FE-5 feedback status integration.
7. FE-6 hardening and release.
