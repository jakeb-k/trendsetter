import type { EventDate } from '@/types/models/Event';
import Event from '@/types/models/Event';
import moment from 'moment';

export function calculateCompletionPercentage(startDate: Date, endDate: Date) {
    const totalDiffInDays = moment(endDate).diff(moment(startDate), 'days');
    const elapsedDiffInDays = moment().diff(moment(startDate), 'days');

    const progress = (elapsedDiffInDays / totalDiffInDays) * 100;

    // Clamp between 0 and 100 to avoid weird edge cases
    return Math.min(100, Math.max(0, progress));
}

export function calculateEventsForCurrentMonth(events: Event[]): EventDate[] {
    let dateEvents: EventDate[] = [];
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

function generateDailyEventObjects(event: Event): EventDate[] {
    let current = moment(event.created_at);
    const endOfMonth = moment().endOf('month');
    const endOfEvent = moment(event.created_at).add(
        event.repeat?.duration_in_weeks,
        'weeks'
    );
    let dateObjects: EventDate[] = [];
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

function generateWeeklyEventObjects(event: Event): EventDate[] {
    let dateObjects: EventDate[] = [];
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
            let startOfWeek = current.startOf('isoWeek');
            let increment = Math.floor(7 / (repeat?.times_per_week ?? 1));
            let count = 0;
            while (count !== repeat.times_per_week) {
                const newDate = startOfWeek.add(increment, 'days');
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
