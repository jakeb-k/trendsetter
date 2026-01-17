import type { EventDate } from '@/types/models/Event';
import Event from '@/types/models/Event';
import moment from 'moment';
import { calculateEventsForCurrentMonth } from './scheduleHandler';

export function computeDateRangeFromEventStart(
    event: Event,
    loggedDates: string[],
    events: Event[],
) {
    let scheduledDates = calculateEventsForCurrentMonth(events)
        .filter(
            (eventDate: EventDate) =>
                eventDate.eventID == event.id &&
                moment(eventDate.date).isSameOrBefore(moment(), 'day'),
        )
        .reverse()
        .map((eventDate: EventDate) => {
            return eventDate.date;
        });

    const loggedSet = new Set(loggedDates);
    const isToday = (date: string) => moment(date).isSame(moment(), 'day');

    let streak = 0;

    for (let i = 0; i < scheduledDates.length; i++) {
        const date = scheduledDates[i];

        if (i === 0 && isToday(date) && !loggedSet.has(date)) continue; // don’t kill streak on today

        if (!loggedSet.has(date)) break;
        streak++;
    }

    return streak;
}
