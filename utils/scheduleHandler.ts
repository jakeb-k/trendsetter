
import Event from '@/types/models/Event';
import moment from 'moment';

export function isWeeklyTrigger(startDate: Date) {
    const diffInDays = moment().diff(moment(startDate), 'days');
    return diffInDays % 7 === 0;
}

export function setTodaysEvents(events: Event[] = []): Event[] {
  return events.filter((event) => isWeeklyTrigger(event.scheduled_for));
}