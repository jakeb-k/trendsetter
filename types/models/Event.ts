export default interface Event {
    id: number;
    title: string;
    description: string;
    repeat?: {
        frequency: string;
        times_per_week?: number;
        duration_in_weeks: number;
    };
    scheduled_for: Date;
    created_at?: Date;
    completed_at: Date | null;
    points: number;
}

export interface EventDate {
    date: string;
    eventID: number;
}
