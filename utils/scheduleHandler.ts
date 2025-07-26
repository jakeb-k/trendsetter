import Event from '@/types/models/Event';
import moment from 'moment';

export function isWeeklyTrigger(startDate: Date) {
    const diffInDays = moment().diff(moment(startDate), 'days');
    return diffInDays % 7 === 0;
}

export function isWeeklyTriggerFromSelectedDate(
    startDate: Date,
    selectedDate: Date
) {
    const diffInDays = moment(selectedDate).diff(moment(startDate), 'days');
    return diffInDays % 7 === 0;
}

export function setDateEvents(events: Event[] = [], date?: string): Event[] {
    if (date)
        return events.filter((event) =>
            isWeeklyTriggerFromSelectedDate(event.scheduled_for, new Date(date))
        );
    return events.filter((event) => isWeeklyTrigger(event.scheduled_for));
}

export function createDateArrayForCurrentMonth(
    month: string,
    events: Event[]
): string[] {
    let startDate = moment(month, 'MMMM YYYY').startOf('month');
    const endOfMonth = moment(month, 'MMMM YYYY').endOf('month');
    let datesArray: string[] = [];
    while (startDate.isBefore(endOfMonth)) {
        const matchedEvents = events.filter((event) =>
            isWeeklyTriggerFromSelectedDate(
                event.scheduled_for,
                new Date(startDate.format('YYYY-MM-DD'))
            )
        );
        matchedEvents.forEach(() => {
            datesArray.push(startDate.format('YYYY-MM-DD'));
        })
        
        startDate = startDate.add(1, 'day');
    }

    return datesArray;
}

function getNextOccurrence(startDate: Date, type: 'weekly' | 'monthly'): Date {
    const now = new Date();
    let next = new Date(startDate);

    while (next < now) {
        next = new Date(next);
        if (type === 'weekly') {
            next.setDate(next.getDate() + 7);
        } else if (type === 'monthly') {
            next.setMonth(next.getMonth() + 1);
        }
    }

    return next;
}

export function setUpcomingEvents(
    events: Event[] = []
): (Event & { upcomingDate: Date })[] {
    return events
        .filter((event) => !isWeeklyTrigger(event.scheduled_for)) // skip unwanted ones
        .map((event) => {
            const scheduled = new Date(event.scheduled_for);
            let upcomingDate = scheduled;

            if (event.repeat) {
                if (
                    event.repeat.frequency === 'weekly' ||
                    event.repeat.frequency === 'monthly'
                ) {
                    upcomingDate = getNextOccurrence(
                        scheduled,
                        event.repeat.frequency
                    );
                }
            }

            return {
                ...event,
                upcomingDate,
            };
        });
}

export function calculateCompletionPercentage(startDate: Date, endDate: Date) {
    const totalDiffInDays = moment(endDate).diff(moment(startDate), 'days');
    const elapsedDiffInDays = moment().diff(moment(startDate), 'days');

    const progress = (elapsedDiffInDays / totalDiffInDays) * 100;

    // Clamp between 0 and 100 to avoid weird edge cases
    return Math.min(100, Math.max(0, progress));
}
