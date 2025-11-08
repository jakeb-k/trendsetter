import Event from '@/types/models/Event';
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
    return weeks * times_per_week;
}