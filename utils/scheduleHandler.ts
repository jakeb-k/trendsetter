import type { EventDate } from '@/types/models/Event';
import Event from '@/types/models/Event';
import moment, { Moment } from 'moment';

function resolveEventStart(event: Event): Moment {
    return moment(event.scheduled_for ?? event.created_at).startOf('day');
}

function resolveEventEnd(event: Event): Moment {
    if (!event.repeat) {
        return resolveEventStart(event).clone();
    }

    const durationInWeeks = Math.max(1, event.repeat.duration_in_weeks ?? 1);

    return resolveEventStart(event)
        .clone()
        .add(durationInWeeks, 'weeks')
        .subtract(1, 'day')
        .startOf('day');
}

function buildWeeklyOccurrenceOffsets(timesPerWeek: number): number[] {
    const boundedTimesPerWeek = Math.max(1, Math.min(7, timesPerWeek));
    const offsets: number[] = [];

    for (let index = 0; index < boundedTimesPerWeek; index++) {
        offsets.push(Math.floor((index * 7) / boundedTimesPerWeek));
    }

    return Array.from(new Set(offsets));
}

function buildSingleEventOccurrence(
    event: Event,
    windowStart: Moment,
    windowEnd: Moment
): EventDate[] {
    const eventStart = resolveEventStart(event);

    if (
        eventStart.isSameOrAfter(windowStart, 'day') &&
        eventStart.isSameOrBefore(windowEnd, 'day')
    ) {
        return [
            {
                date: eventStart.format('YYYY-MM-DD'),
                eventID: event.id,
            },
        ];
    }

    return [];
}

function buildOccurrencesForWindow(
    event: Event,
    windowStart: Moment,
    windowEnd: Moment
): EventDate[] {
    if (!event.repeat?.frequency) {
        return buildSingleEventOccurrence(event, windowStart, windowEnd);
    }

    const eventStart = resolveEventStart(event);
    const eventEnd = resolveEventEnd(event);

    if (
        windowStart.isAfter(eventEnd, 'day') ||
        windowEnd.isBefore(eventStart, 'day')
    ) {
        return [];
    }

    switch (event.repeat.frequency) {
        case 'daily':
            return generateDailyEventObjects(event, windowStart, windowEnd);
        case 'monthly':
            return generateMonthlyEventObjects(event, windowStart, windowEnd);
        default:
            return generateWeeklyEventObjects(event, windowStart, windowEnd);
    }
}

export function calculateEventsForDateRange(
    events: Event[],
    rangeStart: Date | string,
    rangeEnd: Date | string
): EventDate[] {
    const windowStart = moment(rangeStart).startOf('day');
    const windowEnd = moment(rangeEnd).startOf('day');

    if (windowStart.isAfter(windowEnd, 'day')) {
        return [];
    }

    return events
        .flatMap((event) => buildOccurrencesForWindow(event, windowStart, windowEnd))
        .sort((left, right) => {
            const dateDiff =
                moment(left.date).valueOf() - moment(right.date).valueOf();

            if (dateDiff !== 0) {
                return dateDiff;
            }

            return left.eventID - right.eventID;
        });
}

export function calculateCompletionPercentage(startDate: Date, endDate: Date) {
    const totalDiffInDays = moment(endDate).diff(moment(startDate), 'days');
    const elapsedDiffInDays = moment().diff(moment(startDate), 'days');

    const progress = (elapsedDiffInDays / totalDiffInDays) * 100;

    // Clamp between 0 and 100 to avoid weird edge cases
    return Math.min(100, Math.max(0, progress));
}

export function calculateEventsForCurrentMonth(
    events: Event[],
    currentMonthDate?: string
): EventDate[] {
    const monthCursor = currentMonthDate
        ? moment(currentMonthDate)
        : moment();

    return calculateEventsForDateRange(
        events,
        monthCursor.clone().startOf('month').toDate(),
        monthCursor.clone().endOf('month').toDate()
    );
}

function generateDailyEventObjects(
    event: Event,
    windowStart: Moment,
    windowEnd: Moment
): EventDate[] {
    let current = moment.max(resolveEventStart(event).clone(), windowStart.clone());
    const endOfEvent = resolveEventEnd(event);
    let dateObjects: EventDate[] = [];
    while (
        current.isSameOrBefore(windowEnd, 'day') &&
        current.isSameOrBefore(endOfEvent, 'day')
    ) {
        dateObjects.push({
            date: current.format('YYYY-MM-DD'),
            eventID: event.id,
        });
        current.add(1, 'day');
    }
    return dateObjects;
}

function generateWeeklyEventObjects(
    event: Event,
    windowStart: Moment,
    windowEnd: Moment
): EventDate[] {
    let dateObjects: EventDate[] = [];
    const endOfEvent = resolveEventEnd(event);
    const timesPerWeek = Math.max(
        1,
        Math.min(7, event.repeat?.times_per_week ?? 1)
    );
    const weekOffsets = buildWeeklyOccurrenceOffsets(timesPerWeek);
    let current = resolveEventStart(event).clone();

    while (current.isSameOrBefore(endOfEvent, 'day')) {
        for (const offsetDays of weekOffsets) {
            const occurrenceAt = current.clone().add(offsetDays, 'days');

            if (occurrenceAt.isAfter(endOfEvent, 'day')) {
                break;
            }

            if (
                occurrenceAt.isBefore(windowStart, 'day') ||
                occurrenceAt.isAfter(windowEnd, 'day')
            ) {
                continue;
            }

            dateObjects.push({
                date: occurrenceAt.format('YYYY-MM-DD'),
                eventID: event.id,
            });
        }
        current.add(1, 'week');
    }

    return dateObjects;
}

function generateMonthlyEventObjects(
    event: Event,
    windowStart: Moment,
    windowEnd: Moment
): EventDate[] {
    const endOfEvent = resolveEventEnd(event);
    let cursor = resolveEventStart(event).clone();
    let dateObjects: EventDate[] = [];

    while (cursor.isSameOrBefore(endOfEvent, 'day')) {
        if (
            cursor.isSameOrAfter(windowStart, 'day') &&
            cursor.isSameOrBefore(windowEnd, 'day')
        ) {
            dateObjects.push({
                date: cursor.format('YYYY-MM-DD'),
                eventID: event.id,
            });
        }

        cursor = cursor.clone().add(1, 'month').startOf('day');
    }

    return dateObjects;
}
