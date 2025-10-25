import Event from '@/types/models/Event';
import moment from 'moment';

type DateEvent = { date: string; eventID: number };

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
        });

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
    return (
        events
            // keeping this commented because I want to see previous events ive made.
            // .filter((event) =>
            //     moment(event.created_at)
            //         .add(event.repeat?.duration_in_weeks, 'weeks')
            //         .isAfter(moment())
            // )
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
            })
    );
}

export function calculateCompletionPercentage(startDate: Date, endDate: Date) {
    const totalDiffInDays = moment(endDate).diff(moment(startDate), 'days');
    const elapsedDiffInDays = moment().diff(moment(startDate), 'days');

    const progress = (elapsedDiffInDays / totalDiffInDays) * 100;

    // Clamp between 0 and 100 to avoid weird edge cases
    return Math.min(100, Math.max(0, progress));
}

export function calculateEventsForCurrentMonth(events: Event[]): DateEvent[] {
    let dateEvents: DateEvent[] = [];
    const endOfMonth = moment().endOf('month');
    const startOfMonth = moment().startOf('month');

    events.forEach((event) => {
        const { repeat } = event;
        if (!repeat) {
            if (
                moment(event.scheduled_for).isBefore(endOfMonth) &&
                moment(event.scheduled_for).isAfter(startOfMonth)
            ) {
                dateEvents.push({
                    date: moment(event.scheduled_for).format('YYYY-MM-DD'),
                    eventID: event.id,
                });
            }
            return dateEvents;
        } else {
            const endOfEvent = moment(event.created_at).add(
                event.repeat?.duration_in_weeks,
                'weeks'
            );

            if (startOfMonth.isAfter(endOfEvent)) return;
        }

        switch (repeat.frequency) {
            case 'daily':
                dateEvents.push(...generateDailyEventObjects(event));
                break;
            case 'weekly':
                dateEvents.push(...generateWeeklyEventObjects(event));
                break;
            // case 'bi-monthly':
            //     generateDailyEventObjects(event);
            //     break;
            case 'monthly':
                dateEvents.push(generateMonthlyEventObjects(event));
                break;

            default:
                break;
        }
    });

    return dateEvents;
}

function generateDailyEventObjects(event: Event): DateEvent[] {
    let current = moment(event.created_at);
    const endOfMonth = moment().endOf('month');
    const endOfEvent = moment(event.created_at).add(
        event.repeat?.duration_in_weeks,
        'weeks'
    );
    let dateObjects: DateEvent[] = [];
    while (
        current.isSameOrBefore(endOfMonth, 'day') &&
        current.isBefore(endOfEvent)
    ) {
        dateObjects.push({
            date: current.format('YYYY-MM-DD'),
            eventID: event.id,
        });
        current.add(1, 'day');
    }
    return dateObjects;
}

function generateWeeklyEventObjects(event: Event): DateEvent[] {
    let dateObjects: DateEvent[] = [];
    const { repeat } = event;

    let current = moment(event.created_at);
    const endOfMonth = moment().endOf('month');
    const endOfEvent = moment(event.created_at).add(
        event.repeat?.duration_in_weeks,
        'weeks'
    );

    while (
        current.isSameOrBefore(endOfMonth, 'day') &&
        current.isBefore(endOfEvent)
    ) {
        if (repeat?.times_per_week && repeat?.times_per_week! > 1) {
            let startOfWeek = current.clone().startOf('isoWeek');
            let increment = Math.floor(7 / (repeat?.times_per_week ?? 1));
            let count = 0;
            while (count !== repeat.times_per_week) {
                const newDate = startOfWeek.clone().add(increment, 'days');
                dateObjects.push({
                    date: newDate.format('YYYY-MM-DD'),
                    eventID: event.id,
                });
                count++;
            }
        } else {
            dateObjects.push({
                date: current.format('YYYY-MM-DD'),
                eventID: event.id,
            });
        }
        current.add(1, 'week');
    }
    return dateObjects;
}

function generateMonthlyEventObjects(event: Event) {
    const currentMonthValue = moment().month() + 1;
    const dateValue = moment(event.created_at).format('YYYY-MM-DD');
    const [year, , day] = dateValue.split('-');
    return {
        date: `${year}-${String(currentMonthValue).padStart(2, '0')}-${day}`,
        eventID: event.id,
    };
}
