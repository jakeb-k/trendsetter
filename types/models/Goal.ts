export default interface Goal {
    id: number, 
    user_id: number, 
    title: string, 
    description: string,
    category: string, 
    status: string, 
    start_date: Date,
    end_date: Date,
    completed_at?: string | null,
    points_earned?: number,
    max_possible_points?: number,
    threshold_points?: number,
    is_completable?: boolean,
    completion_reasons?: string[],
    review_summary?: {
        outcome?: string;
        completed_at?: string;
    } | null,
    events?: Event[], 
}
