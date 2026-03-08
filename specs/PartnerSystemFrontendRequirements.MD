# Partner System Frontend Requirements (v1)

## Purpose
Define the frontend requirements for Partner System v1 in `trendsetter`, aligned to the backend that is now implemented in `trendsetter-core` (invite lifecycle, safe snapshot, alerts inbox, encouragement, and lifecycle controls).

## Inputs Used
- `trendsetter/specs/PartnerSystem.MD`
- `trendsetter/specs/PartnerSystemExecutionPlan.MD`
- implemented backend behavior in `trendsetter-core` (Phase 1-3 + security hardening)

## Product Rules (Non-Negotiable)
- One partner per goal (no groups).
- Partner visibility is signals-only (no notes, moods, reflections, AI text).
- Partner cannot edit goal/events/logs.
- Invite email is the only email channel; alerts are in-app only.
- Logging counts only when online (offline logging blocked in v1).
- Unlink is silent and immediate.
- Pausing stops alerts but keeps partner snapshot access.

## Roles and Permissions
- Goal Owner:
  - create/resend/cancel invites
  - accept/decline outcome visibility via resolve/respond pages
  - view partnerships and snapshot
  - pause/unpause/unlink
  - submit event feedback (may trigger partner alert evaluation)
- Partner:
  - view partnerships and snapshot
  - pause/unpause/unlink
  - read/clear notifications
  - send one preset encouragement per alert
- Non-participant:
  - no partnership/snapshot/notification access

## Required Frontend Surfaces

### 1) Invite Flow
- Goal details action: “Invite Partner”.
- Form fields:
  - `invitee_email`
  - `role` (`cheerleader|drill_sergeant|silent`)
  - `notify_on_alerts` boolean
- Invite management list:
  - pending/accepted/declined/expired/cancelled
  - resend
  - cancel
- Public invite screen (deep link):
  - resolve token state
  - show goal title + inviter + sharing rules
  - accept/decline CTA

### 2) Partnerships List
- Partnerships index view grouped by state:
  - active
  - paused
- Card fields:
  - counterparty name
  - goal title
  - role
  - `notify_on_alerts`
  - status badge

### 3) Partnership Snapshot Detail (Read-Only)
- Show only safe snapshot fields:
  - streak length
  - last log at
  - inactivity days
  - weekly consistency %
  - rolling consistency %
  - points earned
  - points expected by today
  - pace status
  - pace delta
  - next scheduled event at
  - next scheduled event label
  - momentum trend
  - momentum delta %
- Must never render private text fields even if present accidentally.

### 4) Partnership Controls
- `notify_on_alerts` toggle (PATCH partnership).
- pause/unpause controls.
- unlink control with destructive confirmation.
- If detail route opens after unlink: redirect to partnerships list with toast.

### 5) Partner Notifications Inbox
- Paginated list.
- Unread badge count.
- Mark one read.
- Mark all read.
- Clear read (hard delete behavior reflected in UI).
- Deep-link handling:
  - if partnership still exists: open snapshot detail
  - if missing: show notification content with no protected deep link

### 6) Encouragement
- Show preset chips/buttons on `partner_alert` notifications only.
- Submit one preset encouragement per alert notification.
- Disable controls after success (`already_sent=true`).
- Show backend validation errors for invalid preset or inaccessible alert.

### 7) Event Feedback UX Integration
- Owner feedback submit response includes `partner_alert` status:
  - `queued`
  - `suppressed` (+ reason message)
  - `failed` (+ message)
- FE must surface that status non-blockingly after save.

### 8) Offline/Network Requirements
- Event logging must hard-fail offline.
- Invite create/resend and encouragement send must show explicit retryable failures.
- For resend cooldown (`429` + `retry_after_seconds`), UI should show countdown-style message.

## API Contract Requirements (Frontend)

### Partnership APIs
- `GET /api/v1/partnerships`
- `GET /api/v1/partnerships/{id}/snapshot`
- `PATCH /api/v1/partnerships/{id}` body: `{ "notify_on_alerts": boolean }`
- `POST /api/v1/partnerships/{id}/pause`
- `POST /api/v1/partnerships/{id}/unpause`
- `DELETE /api/v1/partnerships/{id}`

### Invite APIs
- `GET /api/v1/goals/{goalId}/partner-invites`
- `POST /api/v1/goals/{goalId}/partner-invites`
- `POST /api/v1/partner-invites/{inviteId}/resend`
- `DELETE /api/v1/partner-invites/{inviteId}`
- `GET /api/v1/partner-invites/resolve?token=...`
- `POST /api/v1/partner-invites/respond` body: `{ token, decision }`

### Notification APIs
- `GET /api/v1/partner-notifications?per_page=...`
- `GET /api/v1/partner-notifications/unread-count`
- `POST /api/v1/partner-notifications/{notificationId}/read`
- `POST /api/v1/partner-notifications/read-all`
- `DELETE /api/v1/partner-notifications/clear-read`
- `POST /api/v1/partner-notifications/{notificationId}/encouragement` body: `{ "preset_key": "..." }`

## State and Caching Requirements
- Keep partner domain state in dedicated store slice(s):
  - invites
  - partnerships
  - snapshot detail cache by partnership id
  - notifications + unread count
- Invalidate/refetch rules:
  - after invite create/resend/cancel
  - after pause/unpause/unlink/toggle notify
  - after mark-read/read-all/clear-read/encouragement
- Avoid tying alert evaluation to generic reads (no app-open-driven evaluation endpoint assumptions).

## Error Handling Requirements
- Standardize handling for `403`, `404`, `409`, `422`, `429`, `503`.
- For `404` on partnership detail, redirect back to partnerships page.
- For invite resend `429`, display retry seconds.
- For encouragement `422`, keep action available unless `already_sent` is true.

## UX/Copy Requirements
- Tone is supportive/accountability-oriented, not punitive.
- Explicit privacy copy: “Partners see progress signals, not private notes.”
- Explicit online-only copy for logging.

## Frontend Acceptance Criteria
- Invite flow works end-to-end including public token accept/decline.
- Partner snapshot screens never display private fields.
- Lifecycle controls (notify toggle/pause/unpause/unlink) are fully functional.
- Inbox supports full read lifecycle and one-tap encouragement.
- Offline/logging and resend cooldown states are clearly handled.
- UI gracefully handles unlinked/missing partnership deep links.
