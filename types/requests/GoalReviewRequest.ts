export default interface GoalReviewRequest {
    outcome: 'achieved' | 'partially_achieved' | 'not_achieved';
    feelings: string[];
    why: string;
    wins: string;
    obstacles: string;
    lessons: string;
    next_steps: string;
    advice?: string | null;
    stats_snapshot?: {
        points_earned?: number;
        max_possible_points?: number;
        threshold_points?: number;
        completion_reasons?: string[];
        status_counts?: Record<string, number>;
        mood_counts?: Record<string, number>;
    } | null;
}
