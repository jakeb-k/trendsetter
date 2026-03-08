# Partner System Frontend Execution Plan (v1)

## Scope Baseline
- Source of truth:
  - `.codex/specs/partner-system/PartnerSystemFrontendRequirements.MD`
  - `.codex/specs/partner-system/PartnerSystemBackendImplementedSpec.MD`
  - `.codex/specs/partner-system/PartnerSystem.MD`
- Repository scope: `trendsetter` frontend only.
- Backend assumption: Phase 1-3 in `trendsetter-core` is implemented and stable.

## Non-Negotiable Product Constraints
- One partner per goal.
- Signals-only rendering; never show private text.
- Invite email is the only email channel.
- In-app partner notifications only after invite lifecycle.
- No pause UX in frontend v1 (active or removed).
- Logging must hard-fail when offline.
- Unlink is immediate and silent.

## API Contract Surface (Frontend Integration)
- Invite lifecycle:
  - `GET /api/v1/goals/{goal}/partner-invites`
  - `POST /api/v1/goals/{goal}/partner-invites`
  - `POST /api/v1/partner-invites/{invite}/resend`
  - `DELETE /api/v1/partner-invites/{invite}`
- Partnership and snapshot:
  - `GET /api/v1/partnerships`
  - `GET /api/v1/partnerships/{partnership}/snapshot`
  - `PATCH /api/v1/partnerships/{partnership}` (`notify_on_alerts`)
  - `DELETE /api/v1/partnerships/{partnership}`
- Partner notifications:
  - `GET /api/v1/partner-notifications`
  - `GET /api/v1/partner-notifications/unread-count`
  - `POST /api/v1/partner-notifications/{notificationId}/read`
  - `POST /api/v1/partner-notifications/read-all`
  - `DELETE /api/v1/partner-notifications/clear-read`
  - `POST /api/v1/partner-notifications/{notificationId}/encouragement`
- Public invite web:
  - `GET /api/v1/partner-invites/resolve?token=...`
  - `POST /api/v1/partner-invites/respond`

## Phase 0: Frontend Domain Foundation
- Build typed partner API layer in `api/`:
  - invites, partnerships, snapshot, notifications, encouragement.
  - normalized error mapping for 403/404/409/422/429/503.
- Add partner models and payload contracts in `types/`.
- Create dedicated domain stores/slices:
  - `invites`, `partnerships`, `snapshot_cache`, `notifications`, `unread_count`.
- Define refetch matrix and optimistic update policy in store actions.

### Phase 0 Exit Criteria
- Every backend endpoint above has a typed client function.
- Error contract is mapped to frontend UX actions.
- Domain slices exist and can be consumed by screens.

## Phase 1: Profile Tab Shell + Notification Badge
- Add/confirm Profile tab route as partner-system home.
- Wire unread badge to `unread-count` endpoint.
- Implement refresh strategy:
  - on profile focus.
  - after notification mutations (mark read/read all/clear read/encouragement).
- Keep fetches intentional (no broad app-open spam polling).

### Phase 1 Exit Criteria
- Badge appears only when unread count > 0.
- Badge stays consistent after mutation flows and screen navigation.

## Phase 2: Partnerships Overview + Empty State Invite
- Build Profile partnerships overview screen:
  - loading, empty, loaded, error states.
  - cards showing context label, goal title, role, alerts state.
- Add empty-state invite composer:
  - goal selector (only eligible goals without active partnership).
  - partner email, role, alerts toggle, send action.
- Add navigation from card tap to snapshot detail.

### Phase 2 Exit Criteria
- User can view all active partnerships with correct context labels.
- Empty state supports invite creation with validation and retry behavior.

## Phase 3: Goal Detail Invite Lifecycle
- Add/finish partner section on goal detail:
  - no_partner/invite_form/invite_submitting/invite_pending/invite_resend_cooldown/invite_declined/invite_expired/invite_cancelled/partnership_active.
- Implement owner invite actions:
  - create, resend, cancel.
- Implement resend cooldown UX:
  - consume `429` + `retry_after_seconds`.
  - countdown and disabled resend CTA until retry window passes.
- Ensure status text maps to user-friendly invite states only.

### Phase 3 Exit Criteria
- Invite lifecycle functions end-to-end from goal detail.
- Cooldown throttling is visible and actionable.

## Phase 4: Snapshot Detail + Lifecycle Controls
- Build read-only snapshot detail screen:
  - primary, secondary, tertiary signal hierarchy from requirements.
  - strict allowlist rendering of snapshot fields only.
- Add partnership controls:
  - alerts toggle (optimistic update with rollback on failure).
  - unlink (non-optimistic destructive flow with confirm + redirect + toast).
- Handle stale/deleted route:
  - on 404 or removed access, redirect to overview with friendly notice.

### Phase 4 Exit Criteria
- Snapshot never displays private feedback content.
- Toggle and unlink flows follow required optimistic/non-optimistic behavior.

## Phase 5: Notifications Inbox + Encouragement
- Build unread-only inbox:
  - loading, empty, unread_list, loading_more, error.
  - newest-first sorting and infinite scroll pagination.
- Implement notification actions:
  - mark read (optimistic).
  - read all (optimistic).
  - clear read (non-optimistic, destructive).
- Implement deep-link handling:
  - existing partnership -> open snapshot.
  - removed partnership -> safe notification fallback card.
- Implement encouragement flow:
  - show preset selector only on valid partner alert notifications.
  - one-send behavior with immediate disabled/sent state.
  - enforce invalid states: already_sent, notification_invalid, partnership_removed, not_alert_notification.

### Phase 5 Exit Criteria
- Inbox behavior matches unread-first requirements.
- Encouragement can be sent once per eligible alert and cannot be replayed.

## Phase 6: Public Invite Web Flow
- Build web invite page states:
  - loading, valid_invite, accepted, declined, expired, invalid, already_responded.
- Resolve token via public endpoint and render inviter/goal/visibility context.
- Submit accept/decline and render confirmation + install guidance copy.

### Phase 6 Exit Criteria
- Invite link is fully usable on web for all response states.
- Post-response copy clarifies same-email requirement.

## Phase 7: Hardening, Offline Rules, and QA
- Enforce offline hard-block in event feedback flows:
  - prevent submit.
  - show explicit message that log was not recorded.
- Implement retry UX for required operations:
  - invite create/resend/cancel, encouragement send, alerts toggle, unlink.
- Apply full screen-state/error-state matrix to all partner screens.
- Verify event feedback `partner_alert_status` handling:
  - queued/suppressed ignored in UX.
  - failed optional diagnostics only.
- Add test coverage:
  - store/unit tests for optimistic rollback and refetch logic.
  - integration/UI tests for major flows and error codes.

### Phase 7 Exit Criteria
- Frontend acceptance criteria in requirements are all validated.
- No private text leakage in snapshot and notification rendering paths.

## Delivery Order
1. Phase 0 foundation.
2. Phase 1 profile shell + badge.
3. Phase 2 overview + empty-state invite.
4. Phase 3 goal detail invite lifecycle.
5. Phase 4 snapshot + controls.
6. Phase 5 notifications + encouragement.
7. Phase 6 public web invite.
8. Phase 7 hardening + QA sign-off.
