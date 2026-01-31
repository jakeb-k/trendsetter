export default interface GoalReviewRequest {
    outcome: 'achieved' | 'partially_achieved' | 'not_achieved';
    feelings: string[];
    why: string;
    wins: string;
    obstacles: string;
    lessons: string;
    next_steps: string;
    advice?: string | null;
}
