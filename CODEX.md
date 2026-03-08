# CODEX.md

## Purpose

This repository exists to build a mobile product that helps users follow through on meaningful goals.

The frontend is not just a visual shell for backend data.
It is the layer that turns rules, state, and product intent into something that feels motivating, clear, and reliable to use every day.

This document defines the operating rules for AI-assisted frontend development in this repository.

---

## Core philosophy

Prefer clarity over cleverness, consistency over novelty, mobile usability over engineering theatre, explicit product behaviour over vague abstraction, and simple state boundaries over sprawling frontend architecture.

The goal is not to create the most impressive React Native codebase.
The goal is to create a frontend that is:

- easy to use
- hard to misuse
- visually coherent
- behaviourally predictable
- straightforward to maintain
- tightly aligned with product intent

Every frontend change should make the app feel more trustworthy, more focused, and more motivating.

---

## Product lens

Trendsetter is not a social feed, not a productivity toy, and not a gamified dashboard for its own sake.

It is an execution and accountability product.

Frontend work should reinforce:

- momentum
- clarity
- consistency
- accountability
- emotional safety
- low friction
- visible progress

If a screen, interaction, or component does not improve one of those, it is probably noise.

---

## Non-negotiable frontend rules

### 1. Product behaviour comes first

Do not start from components.
Start from the user flow.

Before building anything meaningful, determine:

- who this screen is for
- what they are trying to do
- what state they are in
- what can go wrong
- what the screen should communicate
- what action should feel primary

A technically correct screen that feels confusing is still bad frontend.

### 2. Mobile-first always

This is a mobile product.
Do not let web habits leak into implementation or design thinking.

Avoid defaulting to:

- desktop information density
- browser-style interaction assumptions
- hover-like affordances
- page-centric thinking
- CSS-first abstraction habits
- over-reliance on wide-layout patterns

Every screen should feel intentional on a phone first.

### 3. State must have a clear owner

Frontend bugs often come from state confusion, not syntax.

For any meaningful feature, be explicit about what belongs in:

- local component state
- shared app state
- server-derived state
- temporary UI state
- navigation state

Do not duplicate truth across multiple places unless there is a very clear reason.

### 4. Backend contracts are the source of truth

The frontend should present product behaviour, not invent it.

Do not:

- silently reinterpret backend states
- expose fields not explicitly safe to render
- assume hidden fields are harmless
- create client-only rules that can drift from backend intent

When data is restricted, derived, or role-sensitive, render only the explicitly approved subset.

### 5. Simplicity beats abstraction

Do not introduce complexity just because it looks “senior”.

Avoid:

- giant generic components
- deeply abstracted hooks with vague responsibilities
- multiple competing state patterns
- one-off wrappers pretending to be a design system
- over-configured architecture for small features

Prefer boring, readable, direct code.

### 6. Loading, error, and empty states are required

These are not polish.
They are product behaviour.

Every meaningful screen or flow should deliberately handle:

- loading
- refreshing
- empty data
- validation errors
- missing resources
- access loss
- destructive actions
- retryable failures
- stale routes
- offline constraints if relevant

### 7. Privacy is a frontend concern too

The backend may protect the data, but the frontend still controls what gets rendered.

Never render private content just because it exists on a payload.
Never use generic spread-based rendering for sensitive models.
Never rely on “the backend would not send that” as protection.

### 8. Navigation is part of the feature

Routes are not plumbing.
They are user experience.

For every route or deep link, consider:

- how the user got here
- whether the route is still valid
- what happens if the underlying data is gone
- where back should take them
- whether the user should still have access
- what the safe fallback is

### 9. UX should support the user, not punish them

The app should feel motivating and honest, not shamey or cringe.

Frontend copy, hierarchy, and feedback should be:

- supportive
- calm
- clear
- encouraging
- non-punitive

Avoid guilt language, fake urgency, or grindset theatre.

### 10. Prefer false silence over noisy nonsense

Not every backend event needs a frontend celebration.
Not every successful mutation needs a toast.
Not every internal state deserves user-facing copy.

Only surface what genuinely helps the user.

---

## AI workflow rules

### 11. Multi-agent workflow is mandatory for meaningful work

Do not use a single-agent loop for non-trivial frontend work.

Meaningful work must use multiple perspectives, such as:

- product / UX planning
- screen implementation
- review / criticism
- test design
- privacy or security review when relevant

One agent should not define, build, and approve the same frontend behaviour alone.

### 12. AI is an accelerator, not an authority

Generated code is a proposal, not truth.

Do not accept an implementation because:

- it looks polished
- it uses advanced patterns
- it has lots of files
- it comes with many tests
- it “feels reusable”

AI is useful for speed.
Human judgement is still responsible for correctness, simplicity, and taste.

### 13. Specs before screens

For any meaningful feature:

- define the flow
- define the states
- define the key actions
- define the failure modes
- define the acceptance criteria
- then implement

Do not improvise product behaviour directly in JSX.

### 14. Review is not optional

Every meaningful frontend change should be challenged.

Review should look for:

- weak UX hierarchy
- duplicated state
- stale route bugs
- unsafe optimistic updates
- accidental privacy leaks
- poor loading/error handling
- unnecessary abstraction
- backend contract drift

### 15. Generated tests do not equal confidence

Frontend tests are useful, but they do not replace reasoning.

For important features, verify:

- user-visible states
- edge cases
- destructive flows
- missing or stale data
- permissions and restricted views
- role-based rendering
- offline or retry paths where relevant

---

## Product-oriented frontend standards

### 16. Every screen needs a clear primary action

The user should not have to guess what matters most.

Each screen should make obvious:

- what this screen is for
- what matters most
- what they can do next
- what state they are currently in

If a screen is visually busy but directionless, it is failing.

### 17. Information hierarchy must be intentional

Do not dump all available metrics onto the screen just because the backend provides them.

Prioritise:

- what drives user understanding
- what affects decision-making
- what reinforces momentum
- what should be noticed immediately
- what can sit lower as supporting context

### 18. Empty states should be useful

An empty state should not feel like dead air.

It should:

- explain what is missing
- explain why it matters
- suggest what to do next

Good empty states create momentum.
Bad empty states just confirm nothing is there.

### 19. Destructive actions must feel deliberate

Anything that removes access, breaks relationships, or deletes user progress must be handled with care.

Destructive flows should include:

- clear intent
- confirmation where appropriate
- safe success handling
- correct redirect or fallback behaviour
- no ambiguous UI aftermath

### 20. Role and visibility boundaries must be obvious

If a user is seeing a restricted or role-specific view, the UI should make that mode clear.

Do not create screens where it is ambiguous whether the user is:

- owner
- partner
- viewer
- actor
- restricted observer

The UI should reinforce what they can and cannot do.

---

## State and data rules

### 21. Store only what the frontend actually owns

Do not push every piece of data into shared state.

Shared state is for frontend-owned behaviour that truly needs to survive across screens or sessions.
Server state should remain server-shaped unless there is a strong reason to transform it.

### 22. Derived state should stay derived

Do not store something that can be cleanly computed from existing state unless doing so solves a real UX or performance problem.

Duplication creates drift.

### 23. Optimistic updates must earn trust

Only use optimistic updates when:

- rollback is clean
- the action is low-risk
- the user benefit is real
- backend failure is unlikely and recoverable

Do not use optimistic updates for destructive or socially sensitive actions unless the system can recover cleanly.

### 24. Refetch and invalidation behaviour must be deliberate

After every mutation, be clear about:

- what should update immediately
- what should refetch
- what can stay stale briefly
- what must never remain stale

Do not rely on random side effects to keep the UI current.

---

## Component and code standards

### 25. Components should have obvious responsibilities

A good component should be easy to describe in one sentence.

Bad signs:

- it fetches, transforms, renders, and mutates everything
- it knows too much about multiple domains
- it is highly configurable but used once
- it handles unrelated responsibilities because it was convenient

### 26. Extract only when it improves clarity

Do not extract components, hooks, or utilities just to make the file shorter.

Extract when it creates:

- reuse
- clearer ownership
- cleaner screen composition
- isolated complexity
- safer rendering

### 27. Naming should be direct

Names should describe what something is or does in product terms.

Prefer:

- screen names tied to the feature
- component names tied to actual usage
- hook names tied to meaningful responsibilities

Avoid vague names that sound reusable but explain nothing.

### 28. Avoid “smart” styling systems inside the app

Use a consistent, low-drama styling approach.
Do not build styling abstractions that are harder to understand than the styles themselves.

The styling system should support product consistency, not become a second architecture layer.

---

## UX and interaction standards

### 29. Feedback should be immediate but restrained

Users should understand what happened after an action, but the app should not become noisy.

Use visual feedback intentionally:

- loading indicators when waiting matters
- success feedback when confidence matters
- error feedback when action is needed
- subtle confirmation when the action is routine

### 30. Inputs should reduce friction

Forms and user inputs should feel easy on mobile.

Consider:

- keyboard handling
- autofill opportunities
- field order
- validation timing
- error clarity
- submit affordance
- disabled/loading state clarity

### 31. Notifications are product surfaces, not just data lists

If the product includes alerts or notifications, the frontend should treat them as part of the user experience, not a raw inbox dump.

Prioritise:

- relevance
- clarity
- actionability
- safe fallbacks
- correct unread/read behaviour
- low clutter

---

## Testing and verification standards

### 32. Test behaviour, not implementation trivia

Good frontend tests prove:

- the user sees the right thing
- the right action is available
- the wrong action is unavailable
- state changes update the screen correctly
- edge cases do not leave the UI broken

Do not overfit tests to component internals.

### 33. Every meaningful feature needs unhappy-path testing

Do not stop at the happy path.

Test:

- loading
- empty
- mutation failure
- stale route
- access denied
- deleted resource
- retry flow
- validation failure
- restricted rendering

### 34. Critical frontend invariants must be protected

Prioritise test coverage around:

- privacy-safe rendering
- role-based views
- destructive flows
- navigation fallbacks
- unread/read state transitions
- backend-driven visibility rules
- state invalidation after mutation

---

## Review checklist

Before finalising any meaningful frontend change, ask:

- Is the user flow clear
- Is the primary action obvious
- Are loading, error, and empty states handled
- Is the screen mobile-first in layout and interaction
- Is state ownership clean
- Is the backend contract respected
- Is private or restricted data impossible to render accidentally
- Are destructive actions safe
- Are routes safe under stale or missing data
- Is this the simplest implementation that satisfies the requirement

If the answer to any of these is no, the work is not done.

---

## Final standard

This frontend should feel focused, calm, and reliable.

We are not trying to build the most clever mobile codebase.
We are trying to build a product that helps people keep promises to themselves.

Anything that makes the frontend noisier, more abstract, more fragile, more confusing, or more self-indulgent is the wrong direction.
