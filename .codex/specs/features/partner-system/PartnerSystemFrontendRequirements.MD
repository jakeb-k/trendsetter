# Partner System Frontend Product Spec (v1)

## Purpose

Define the frontend behaviour for the Partner System in `trendsetter`, aligned to the implemented backend in `trendsetter-core`.

This spec covers:

- invite creation
- invite status visibility
- partnership discovery
- partnership snapshot viewing
- notifications
- encouragement
- destructive lifecycle actions

This spec does not redefine backend logic.  
It defines how the frontend should present, structure, and handle the feature.

---

## Product Rules

These rules are non-negotiable.

- One partner per goal
- One partnership is tied to one goal only
- Partner visibility is signals-only
- Partner cannot edit goals, events, logs, or private written content
- Invite email is the only email channel
- Ongoing accountability alerts are in-app only
- Logging counts only when online
- Unlink is silent and immediate
- No pause state in frontend v1
- A partnership is either active or removed
- Alert notifications can be toggled on or off
- Read notifications disappear from the unread inbox view

---

## Information Architecture

### Main Entry Points

#### Goal Detail

Used to:

- create partner invite for the specific goal
- view invite status
- view partnership state

#### Profile Tab

A new Profile tab exists in v1.

This tab is the home for:

- partner notifications inbox
- partnerships overview
- partner-related actions

The profile tab icon should display a notification badge when unread partner alerts exist.

---

## Core User Flows

### 1. Invite a Partner

A user can invite a partner from goal detail.

#### If the Goal Has No Active Partnership

Show a clear accountability CTA.

Example direction:

> Bring in a partner to help you stay on track.

UI elements:

- short privacy helper text
- email input
- role selector
- alerts toggle
- send invite button

Helper copy:

> Partners see progress signals, not private notes.

#### Role Options

- cheerleader
- drill_sergeant
- silent

#### Alerts Toggle

Boolean toggle controlling `notify_on_alerts`.

---

### After Invite Is Sent

Replace the creation form with a pending invite state.

Display:

- invited email
- invite status
- resend button
- cancel button
- resend cooldown messaging if throttled

---

### Invite Statuses Visible To Owner

- pending
- accepted
- declined
- expired
- cancelled

Frontend should not expose backend token semantics.

Only user-meaningful statuses.

---

## Public Invite Acceptance Flow (Web)

Invite emails open a web page, not the mobile app.

The page allows the invited person to:

- see inviter name
- see goal title
- see visibility rules
- accept invite
- decline invite

### Web Page States

- loading
- valid_invite_waiting
- accepted_success
- declined_success
- expired_invite
- invalid_invite
- already_responded

---

### Post Response Behaviour

After accept or decline:

- show confirmation
- encourage installing the app
- explain that the same email must be used when registering

---

## Partnerships Overview

Accessible from the Profile tab.

Displays all active partnerships.

---

### Empty State

If user has zero partnerships:

Headline example:

Get a partner to help you stay consistent

Subtext:

Invite someone to keep you accountable.  
They’ll only see progress signals, not your private notes.

Allow invite creation from this screen.

Inputs:

- goal selector (only goals without partnerships)
- partner email
- role selector
- alerts toggle
- send invite button

---

### Partnership Card

Each card shows:

- context label
    - "Your partner"
    - "Goal owner"

- goal title
- role
- alerts enabled or disabled
- tap target to snapshot

Do not use the term counterparty.

---

## Partnership Snapshot Detail

Read-only view of goal progress signals.

Opened from:

- partnerships overview
- notification deep links

---

### Content Hierarchy

#### Primary Signals

Most visually prominent:

- streak_length
- pace_status
- last_log_at OR inactivity_days

---

#### Secondary Signals

- points_earned
- points_expected_by_today
- next_scheduled_event_at
- next_scheduled_event_label

---

#### Tertiary Signals

- weekly_consistency_percent
- rolling_consistency_percent
- momentum_trend
- momentum_delta_percent

---

### Privacy Rules

This screen must never render:

- feedback notes
- moods
- feelings
- reasons
- AI plan content
- written reflections

Frontend must only display the defined snapshot contract.

---

## Partnership Controls

Controls appear on snapshot detail screen.

### Available Controls

- alerts_toggle
- unlink_partnership

---

### Alerts Toggle

Optimistic update allowed.

Behaviour:

1. Switch UI immediately
2. Attempt backend update
3. Roll back if failure

---

### Unlink

Destructive action.

Flow:

1. Show destructive confirmation
2. Submit unlink
3. On success
    - remove partnership
    - redirect to partnerships overview
    - show success toast

---

### Stale Snapshot Route

If snapshot loads after unlink:

- redirect to partnerships overview
- show friendly notice

---

## Notifications Inbox

Located inside the Profile tab.

Only partner-related notifications appear here.

---

### Inbox Behaviour

- unread only view
- newest first
- read notifications hidden
- infinite scroll
- badge updates on read
- clear read removes history

---

### Notification Item

Each item displays:

- title
- relative time
- goal title
- unread state
- tap target

---

### Tap Behaviour

If partnership exists:

open_snapshot_detail

If partnership removed:

- show_safe_notification_card
- display_message_no_access

---

## Encouragement UX

Encouragement exists only on partner alert notifications.

The interaction should feel lightweight.

---

### Interaction Model

Tapping encouragement opens a preset selector.

Presentation style:

- emoji or reaction sheet
- compact overlay

---

### Preset Keys

Example keys:

- youve_got_this
- small_steps_count
- reset_and_continue
- one_check_in_today

---

### After Sending Encouragement

- disable presets
- show sent state
- prevent resubmission

Encouragement unavailable if:

- already_sent
- notification_invalid
- partnership_removed
- not_alert_notification

---

## Owner Encouragement Notification

Owners may receive an encouragement notification.

It should:

- appear in the same notifications area
- not reveal additional partner data
- remain within the signals-only model

---

## Event Feedback Integration

Event feedback responses may include:

partner_alert_status

Possible values:

- queued
- suppressed
- failed

---

### UX Rule

Do not surface partner alert plumbing to users.

Recommended behaviour:

- queued -> ignore
- suppressed -> ignore
- failed -> optional logging only

User intent is logging progress, not managing alerts.

---

## Network and Offline Behaviour

### Logging

If offline:

- block submission
- show error message
- explain log not recorded

---

### Retryable Operations

Operations that must show retry behaviour:

- invite_create
- invite_resend
- invite_cancel
- encouragement_send
- alerts_toggle
- unlink

---

### Resend Cooldown

If API returns:

429 with retry_after_seconds

UI must show countdown cooldown message.

---

## Screen States

### Goal Detail Partner Section

- no_partner
- invite_form
- invite_submitting
- invite_pending
- invite_resend_cooldown
- invite_declined
- invite_expired
- invite_cancelled
- partnership_active

---

### Partnerships Overview

- loading
- empty
- loaded
- error

---

### Snapshot Detail

- loading
- loaded
- missing_partnership
- error

---

### Notifications Inbox

- loading
- empty
- unread_list
- loading_more
- error

---

### Public Invite Web Page

- loading
- valid_invite
- accepted
- declined
- expired
- invalid
- already_responded

---

## State Management

Partner domain state should be separated logically.

Recommended slices:

- invites
- partnerships
- snapshot_cache
- notifications
- unread_count

---

## Refetch Rules

Refetch data after:

- invite_create
- invite_resend
- invite_cancel
- unlink
- alerts_toggle
- encouragement_send
- mark_read
- read_all
- clear_read

---

## Optimistic Updates

Allowed:

- alerts_toggle
- mark_read
- read_all

Not allowed:

- invite_send
- invite_resend
- invite_cancel
- unlink
- encouragement_send
- clear_read

---

## Error Handling Contract

### 403

- show_access_denied
- redirect_from_protected_screen

### 404

- treat_as_removed_resource
- redirect_to_partnerships_overview

### 409

- stale_state_conflict
- refetch_and_retry

### 422

- inline_validation_error
- do_not_disable_action

### 429

- display_rate_limit_message
- show_retry_timer

### 503

- temporary_service_failure
- allow_retry

---

## Copy and Tone

All UI copy should be:

- supportive
- calm
- accountability focused
- non punitive

Examples:

Privacy reassurance:

Partners see progress signals, not private notes.

Online logging notice:

Logging only counts when you're connected.

Avoid guilt or discipline-heavy language.

---

## Frontend Acceptance Criteria

The system is complete when:

- invite flow works end to end
- invite states visible to owner
- public invite page handles all states
- partnerships overview distinguishes owner vs partner context
- snapshot shows only safe signals
- alerts toggle functions correctly
- unlink redirects and removes access
- notifications show unread newest first
- unread badge updates correctly
- infinite scroll functions
- alert notifications open snapshot
- removed partnership notifications fallback safely
- encouragement sent once per alert
- offline logging blocked
- resend cooldown displayed
- no private text rendered

---

## Build Order Recommendation

1. profile tab with notification badge
2. partnerships overview with empty state
3. goal detail partner invite flow
4. snapshot detail view
5. notifications inbox with infinite scroll
6. encouragement interaction
7. public invite webpage
8. error and offline state hardening
