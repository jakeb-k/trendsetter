Frontend requirements

Partner entry points: goal screen has “Add partner”, partners section lists active/paused goal partnerships, each partnership opens a read-only progress view.

Invite creation UI: email input, clear explanation of what partner will see, toggle-style controls for what’s shared (signals only) and when partner is notified, role selector (cheerleader, drill sergeant, silent) that only affects tone, send invite, show pending state, allow resend, allow cancel.

Invite acceptance UI: deep link opens app, if not signed in it routes through auth then returns, shows inviter name, goal name, what the partner can see, what notifications they’ll get, accept/decline buttons, success state routes to the partnered goal view.

Partner goal view UI (signals only): streak length, last log time, weekly consistency trend, points vs expected-by-today, pace status ahead/on track/behind, next scheduled event, momentum indicator, no journals/feelings/AI plan, no edit controls.

In-app alerts UI: notifications inbox or banner, alert types for streak break, multiple misses, behind pace, inactivity, each alert links to the partnered goal view, each alert includes one-tap encouragement presets, partner can mute/pause notifications per goal.

Connection handling: logging screens must hard-block submission when offline, show explicit error state “no connection, log didn’t count”, never imply points/streak updated if post failed.

Controls: initiator and partner can pause notifications, both can remove partnership, removal is silent and immediate, partner then sees nothing for that goal, no in-app message about being removed beyond the goal disappearing.
