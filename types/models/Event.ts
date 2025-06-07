export default interface Event {
    id: number;
    title: string;
    description: string;
    repeat?: {
        frequency: string;
        duration_of_weeks: number;
    };
    scheduled_for: Date;
    completed_at: Date | null;
    points: number;
}
