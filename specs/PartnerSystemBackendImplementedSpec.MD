# Partner System Backend Implemented Spec (trendsetter-core)

## Purpose
This document is a consolidated handoff of what is implemented in backend for Partner System v1. It is intended for frontend engineers, QA, and UI/UX designers.

## Implementation Scope Summary
- Phase 1: invite lifecycle + partnership creation/claim flow.
- Phase 2: safe partner snapshot + lifecycle controls.
- Phase 3: alert evaluation + in-app notifications + encouragement.
- Security hardening pass: throttling/cooldown, atomic encouragement handling, after-commit notification dispatch, scheduler overlap locks.

## Core Domain Rules Enforced
- One active partnership per goal (`goal_partnerships.goal_id` unique).
- Partner relationship is 1:1 per goal.
- No self-invites.
- Invite acceptance binds by authenticated account claim flow.
- Partner data access is signals-only.
- Paused partnerships suppress alert generation.
- `notify_on_alerts=false` suppresses alert generation.
- Unlink/deletion removes access immediately.

## Data Model (Implemented)

### `goal_partnerships`
- `goal_id`, `initiator_user_id`, `partner_user_id`
- `status`: `active|paused`
- `role`: `cheerleader|drill_sergeant|silent`
- `notify_on_alerts` boolean
- `paused_at`

### `goal_partner_invites`
- `goal_id`, `inviter_user_id`, optional `invitee_user_id`
- `invitee_email`
- `status`: `pending|accepted|declined|expired|cancelled`
- `role`, `notify_on_alerts`
- `token_hash`, `expires_at`, `last_sent_at`, `responded_at`
- `archived_at`

### `goal_partnership_alert_events`
- `partnership_id`, `goal_id`, `subject_user_id`, `recipient_user_id`
- `evaluation_source`: `log_submit|scheduled_scan|manual_debug`
- `selected_alert_type`: `consecutive_misses|streak_broken|inactivity|behind_pace` nullable
- `candidate_types`, `outcome`, `reason_codes`
- `dedupe_key`, `signal_date`, `snapshot_excerpt`
- `notification_id`, `evaluated_at`

### `notifications` (Laravel database notifications)
- Used for:
  - `partner_alert`
  - `partner_encouragement`

## Backend Services (Implemented)
- `GoalOccurrenceService`
  - shared recurrence generation + eligibility calculations
- `GoalPartnerSnapshotService`
  - safe signals-only snapshot
- `GoalPartnershipAlertEvaluator`
  - evaluates alert candidates, dedupe, cooldown, suppression, persists `goal_partnership_alert_events`
- `GoalPartnershipNotificationService`
  - creates partner alert and encouragement notifications
- `PartnerInviteRegistrationService`
  - claims accepted invites on verified login/registration

## Alert Types and Priority
- Types:
  - `consecutive_misses`
  - `streak_broken`
  - `inactivity`
  - `behind_pace`
- Priority when multiple candidates true:
  1. `consecutive_misses`
  2. `streak_broken`
  3. `inactivity`
  4. `behind_pace`

## Alert Trigger Model (Implemented)
- Immediate:
  - on `POST /api/v1/events/{event}/feedback` (`log_submit`)
- Scheduled:
  - `goal-partnerships:evaluate-alerts` daily at 01:00 (`scheduled_scan`)
- No app-open / `getGoals` trigger in v1.

## Suppression and Anti-Spam
- Grace window (`PARTNER_ALERT_GRACE_HOURS`, default 6).
- Dedupe by stable `dedupe_key`.
- Rate limit by generated alerts window (`PARTNER_ALERT_RATE_LIMIT_HOURS`, default 24).
- Scheduled scan narrowing:
  - skip partnerships recently evaluated by `log_submit` within configured hours.
  - skip partnerships with recent generated alert inside cooldown.

## Security/Consistency Hardening
- Authenticated invite/resend throttled via `partner-invite-authenticated`.
- Resend cooldown with `429` + `Retry-After`.
- Encouragement send path is transactional with row lock to prevent duplicate concurrent sends.
- Notification classes dispatch after transaction commit (`afterCommit()`).
- Scheduled partner commands configured with `withoutOverlapping(...)`.

## Authenticated Partner APIs

### Invite Management
- `GET /api/v1/goals/{goal}/partner-invites`
- `POST /api/v1/goals/{goal}/partner-invites` (throttled)
- `POST /api/v1/partner-invites/{invite}/resend` (throttled)
- `DELETE /api/v1/partner-invites/{invite}`

### Partnerships and Snapshot
- `GET /api/v1/partnerships`
- `GET /api/v1/partnerships/{partnership}/snapshot`
- `PATCH /api/v1/partnerships/{partnership}` body: `{ notify_on_alerts: boolean }`
- `POST /api/v1/partnerships/{partnership}/pause`
- `POST /api/v1/partnerships/{partnership}/unpause`
- `DELETE /api/v1/partnerships/{partnership}`

### Partner Notifications
- `GET /api/v1/partner-notifications`
- `GET /api/v1/partner-notifications/unread-count`
- `POST /api/v1/partner-notifications/{notificationId}/read`
- `POST /api/v1/partner-notifications/read-all`
- `DELETE /api/v1/partner-notifications/clear-read`
- `POST /api/v1/partner-notifications/{notificationId}/encouragement`

### Event Feedback Trigger
- `POST /api/v1/events/{event}/feedback`
  - response includes `partner_alert` status payload (`queued|suppressed|failed` semantics).

## Public Invite APIs
- `GET /api/v1/partner-invites/resolve?token=...` (public throttle)
- `POST /api/v1/partner-invites/respond` (public throttle)

## Snapshot Contract (Signals-Only)
- `streak_length`
- `last_log_at`
- `inactivity_days`
- `weekly_consistency_percent`
- `rolling_consistency_percent`
- `points_earned`
- `points_expected_by_today`
- `pace_status`
- `pace_delta`
- `next_scheduled_event_at`
- `next_scheduled_event_label`
- `momentum_trend`
- `momentum_delta_percent`

Never exposed:
- feedback note text
- moods/feelings/reasons
- AI plan content
- review private text

## Notification Payload Contract (Partner Alert)
- `partner_alert_type`
- `source`
- `title`
- `body`
- `partnership_id`
- `goal_id`
- `goal_title`
- `role`
- `deep_link`
- `dedupe_key`
- `related_alert_event_id`
- `encouragement`:
  - `allowed`
  - `already_sent`
  - `presets`

## Encouragement Rules
- Preset-only; no free text.
- Only valid on `partner_alert` notifications.
- Recipient authorization enforced.
- One encouragement per source alert notification.

## Scheduler/Commands
- `partner-invites:prune` daily 00:00
- `goal-partnerships:evaluate-alerts` daily 01:00
- `partner-notifications:prune` daily 01:30

## Config Surface

### `config/partner_alerts.php`
- `grace_hours` (default 6)
- `rate_limit_hours` (default 24)
- `scan_recent_log_submit_hours` (default 24)
- `consecutive_misses_threshold` (default 1)
- `inactivity_days` (default 3)
- `behind_pace_points` (default 2)
- `min_expected_points` (default 4)
- `scan_chunk_size` (default 200)
- `suppressed_retention_days` (default 7)
- `read_notification_retention_days` (default 7)
- encouragement preset map

### `config/services.php` (`partner_invites`, `partner_notifications`)
- invite expiry/claim/retention windows
- resend cooldown
- authenticated invite rate limits
- schedule lock minute values

## Test Status (Latest Validation)
- Full backend test suite passing:
  - 134 passed
  - 8 skipped
- Partner-system-specific unit/feature/console coverage included.

## UI/Mockup Guidance Notes
- Design for clear separation:
  - invite lifecycle
  - partnership list
  - snapshot detail (read-only)
  - notifications inbox
  - encouragement actions
- Include explicit states for:
  - paused partnership
  - notify toggle off
  - resend cooldown (`429`)
  - missing/unlinked partnership deep link
  - alert suppressed vs queued vs failed after feedback submit
