# Frontend repo: Trendsetter (React Native + Expo)

## Data + types

Update types/models/Goal.ts:

- completed_at: string | null
- points_earned: number
- max_possible_points: number
- threshold_points: number
- is_completable: boolean
- completion_reasons: string\[\] (points_threshold, end_date_passed)

Add:

- types/models/GoalReview.ts
- types/requests/GoalReviewRequest.ts

## API layer

In api/goalsApi.ts add:

- completeGoal(goalId)
- createGoalReview(goalId, payload)
- fetchCompletedGoals()
- fetchGoalReview(goalId)

Follow existing Axios + AsyncStorage token pattern.

## State management

Update goal store to:

- hydrate computed fields from API
- mark goal completed on completeGoal success
- store completed goals list or fetch on demand

## UX implementation

1.  Goal detail screen:

- If goal not completed and is_completable, show a high-importance CTA “Complete goal”
- Show small eligibility explanation: “You hit 75% of your target points” or “Your goal period ended yesterday”
- On press: call completeGoal, update store, navigate to review route

1.  Review route (new screen)Create app/(tabs)/goals/\[id\]/review-goal.tsx (or equivalent consistent route):

- Comprehensive form with structured prompts and feeling options
- Show stats header (points, threshold, completion reason, counts if available)
- Submit calls createGoalReview, on success show locked “Review submitted” state and route to completed goal summary

1.  Completed goals browsingAdd a screen or section that lists completed goals:

- minimal: a new route app/(tabs)/completed-goals.tsx and link from goals tab, or a segmented control inside goals list
- tapping a completed goal opens its detail with “View review” leading to a read-only review screen

## Behaviour rules

- Do not allow edits to completed goal UI (disable edit actions)
- Review cannot be edited after submission, UI should reflect locked state
- If API says not eligible at completion tap, show a clear message and do not navigate

## Acceptance criteria

A goal becomes completable when pointsEarned ≥ 75% maxPossiblePoints or end_date+24h passes, user can complete it early or after end date, completion locks goal, user is forced into a comprehensive review flow, review is submitted once and becomes read-only, user can browse completed goals and view their reviews, no commits unless explicitly asked.
