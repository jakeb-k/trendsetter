import { useEventsStore } from "@/stores/useEventStore";
import Event from "@/types/models/Event";
import Goal from "@/types/models/Goal";

const {events} = useEventsStore(); 

export function calculateMaxProgressForGoal(goal: Goal){
    const goalEvents = events.filter((event) => event.goal_id === goal.id.toString()); 

    return goalEvents.reduce((acc, event) => {
        return calculateMaxProgressForEvent(event) + acc
    },0)

}

export function calculateMaxProgressForEvent(event: Event): number{
    const repeat = event.repeat!;
    return repeat.duration_in_weeks * ( repeat.frequency === 'weekly' ? repeat.times_per_week! : 1)
}