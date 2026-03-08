## Partner accountability, high-level functional requirements

### Core rules

Each goal can have **at most one partner**.A user can have **different partners for different goals**.The relationship is strictly **1-to-1 per goal**, no groups, no feeds.Partners can **observe progress signals only**, never edit, never message freely.All partner features are **opt-in** and **reversible without notification**.

Logging only counts when the app is online. If there is no connection, logging is blocked and clearly fails.

## Partner invite flow

A user can invite a partner by entering their email for a specific goal.

The invite:

- is scoped to that goal only
- clearly explains what the partner will see
- explains when the partner will be notified
- expires if not accepted within a defined time window

The invited person:

- receives an email with a link
- must sign in or sign up to continue
- sees the goal name and sharing rules before accepting
- can accept or decline

If accepted, the partner relationship becomes active.If declined or expired, nothing else happens.

A goal cannot have more than one active partner at a time.

## Partner visibility rules

Once active, the partner can see a **high-level progress view** of the goal.

This view shows:

- current streak length
- when the last log was submitted
- whether the user is ahead, on track, or behind pace
- weekly consistency trends
- total progress relative to where they should be by today
- next upcoming scheduled event

This view never shows:

- written reflections
- feelings or mood selections
- reasons, excuses, or explanations
- AI-generated plans or notes
- any private text

The partner cannot change anything about the goal.

## Accountability alerts

Partner alerts are **in-app only** after the initial invite email.

Alerts are triggered when:

- a streak is broken
- multiple expected logs are missed in a row
- the user falls meaningfully behind pace
- the user has been inactive for several days

Alerts are:

- delayed with a grace period to avoid false positives
- rate-limited so they don’t spam
- framed as “they may need encouragement”, not failure

Each alert allows the partner to send a one-tap encouragement.

## Hybrid alert evaluation model

Partner alert checks run in two ways:

1.  When the user opens the app or submits a log, the system checks whether any accountability conditions are now true and triggers alerts if needed.
2.  Periodically in the background, the system checks for users who haven’t opened the app recently and evaluates the same conditions.

This ensures alerts still fire even if the user avoids opening the app.

Alerts are never triggered by client-side state alone, only by what the system has actually received.

## Pause and unlink behaviour

Either person can:

- pause partner notifications
- fully remove the partner relationship

Pausing:

- stops all alerts
- keeps the partner view available

Removing:

- immediately removes access
- removes the goal from the partner’s view
- sends no notification or message to the other person

If a goal is deleted, any partner relationship tied to it is silently removed.

## User expectations and clarity

The app clearly communicates:

- logs only count when online
- partner updates depend on logs being received
- partners see signals, not private thoughts
- partner links can be ended at any time without explanation

## Out-of-scope for v1

No public profilesNo feedsNo comments or free-text messagesNo leaderboardsNo group accountabilityNo offline logging or syncing

## Success criteria for this feature

Users feel:

- supported, not monitored
- accountable without shame
- safe sharing progress without over-exposure

Product metrics:

- higher log consistency after adding a partner
- lower streak abandonment
- higher 7-day and 30-day retention for users with partners
