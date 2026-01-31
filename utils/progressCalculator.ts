import Event from '@/types/models/Event';
import EventFeedback from '@/types/models/EventFeedback';
import Goal from '@/types/models/Goal';

const pointsMap = {
    nailed_it: 4,
    completed: 3,
    struggled: 2,
    partial: 1,
    skipped: 0,
};

export function calculateMaxProgressForGoal(goal: Goal, events: Event[]) {
    const goalEvents = events.filter((event) => event.goal_id === goal.id);
    return goalEvents.reduce(
        (acc, event) => acc + calculateMaxProgressForEvent(event),
        0
    );
}

export function calculateMaxProgressForEvent(event: Event): number {
    const repeat = event.repeat!;

    if (!repeat) return 4;
    const weeks = repeat.duration_in_weeks ?? 0;
    const times_per_week =
        repeat.frequency === 'weekly' ? repeat.times_per_week! : 1;
    return weeks * times_per_week * 4;
}

export function calculateProgressForGoal(goal: Goal, events: Event[]) {
    const goalEvents = events.filter((event) => event.goal_id === goal.id);
    return goalEvents.reduce(
        (acc, event) => acc + calculateMaxProgressForEvent(event),
        0
    );
}

export function calculateCurrentProgressForEvent(eventFeedback: EventFeedback[]) {
    return eventFeedback.reduce(
        (acc, feedback) => acc + pointsMap[feedback.status],
        0
    );
}

export function calculatePointsEarnedFromFeedbackMap(
    feedbackMap: Record<string, EventFeedback[]>
) {
    return Object.values(feedbackMap).reduce(
        (acc, feedback) => acc + calculateCurrentProgressForEvent(feedback),
        0
    );
}

export function calculateCompletionStats(
    goal: Goal,
    events: Event[],
    feedbackMap: Record<string, EventFeedback[]>
) {
    const pointsEarned = calculatePointsEarnedFromFeedbackMap(feedbackMap);
    const maxPossiblePoints = calculateMaxProgressForGoal(goal, events);
    const thresholdPoints = Math.ceil(maxPossiblePoints * 0.75);
    const completionReasons: string[] = [];
    if (maxPossiblePoints > 0 && pointsEarned >= thresholdPoints) {
        completionReasons.push('points_threshold');
    }
    const endDatePassed =
        new Date().getTime() >=
        new Date(goal.end_date).getTime() + 24 * 60 * 60 * 1000;
    if (endDatePassed) {
        completionReasons.push('end_date_passed');
    }

    return {
        pointsEarned,
        maxPossiblePoints,
        thresholdPoints,
        completionReasons,
        isCompletable: completionReasons.length > 0,
    };
}
